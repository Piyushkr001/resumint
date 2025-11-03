// app/api/analytics/track/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { db } from "@/config/db";
import { verifyAccessToken } from "@/lib/jwt";
import {
  resumeMetricsDailyTable,
  resumesTable,
} from "@/config/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireUid(): Promise<string | null> {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await verifyAccessToken(token);
    const sub = payload?.sub;
    return sub ? String(sub) : null;
  } catch {
    return null;
  }
}

/**
 * POST /api/analytics/track
 * body: { resumeId: string, type: "view" | "download" }
 * Increments today's counters for the owner of the resume.
 */
export async function POST(req: Request) {
  const uid = await requireUid();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null) as
    | { resumeId?: string; type?: "view" | "download" }
    | null;

  if (!body?.resumeId || !body?.type) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // Ownership check
  const owner = await db.query.resumesTable.findFirst({
    where: and(eq(resumesTable.id, body.resumeId), eq(resumesTable.userId, uid)),
    columns: { id: true },
  });
  if (!owner) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const today = new Date().toISOString().slice(0, 10); // UTC day
  // Upsert by unique(resume_id, date)
  const inc = body.type === "view" ? { views: 1, downloads: 0 } : { views: 0, downloads: 1 };

  await db
    .insert(resumeMetricsDailyTable)
    .values({
      userId: uid,
      resumeId: body.resumeId,
      date: today,
      views: inc.views,
      downloads: inc.downloads,
    })
    .onConflictDoUpdate({
      target: [resumeMetricsDailyTable.resumeId, resumeMetricsDailyTable.date],
      set: {
        views: (resumeMetricsDailyTable.views as any).plus(inc.views),
        downloads: (resumeMetricsDailyTable.downloads as any).plus(inc.downloads),
      },
    });

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
