// app/api/resumes/[id]/experience/route.ts
//@ts-nocheck
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/config/db";
import {
  resumesTable,
  resumeExperiencesTable,
} from "@/config/schema";
import { verifyAccessToken } from "@/lib/jwt";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function json(data: any, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

async function requireUid(): Promise<string | null> {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await verifyAccessToken(token);
    return payload?.sub ? String(payload.sub) : null;
  } catch {
    return null;
  }
}

const Body = z.object({
  company: z.string().min(2),
  title: z.string().min(2),
  location: z.string().optional(),
  startDate: z.string().min(4), // YYYY-MM-DD
  endDate: z.string().nullable().optional(),
  isCurrent: z.boolean().default(false),
  bullets: z.array(z.string()).max(20).optional(),
});

// POST /api/resumes/[id]/experience
export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id: raw } = await ctx.params;
  const id = decodeURIComponent(raw ?? "").trim();
  if (!UUID_RE.test(id)) return json({ error: "Invalid resume id" }, 400);

  const uid = await requireUid();
  if (!uid) return json({ error: "Unauthorized" }, 401);

  // Ensure ownership
  const resume = await db.query.resumesTable.findFirst({
    where: and(eq(resumesTable.id, id), eq(resumesTable.userId, uid)),
  });
  if (!resume) return json({ error: "Not found" }, 404);

  const dataUnknown = await req.json().catch(() => null);
  if (!dataUnknown) return json({ error: "Invalid JSON body" }, 400);

  const parsed = Body.safeParse(dataUnknown);
  if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);

  const v = parsed.data;

  const [row] = await db
    .insert(resumeExperiencesTable)
    .values({
      resumeId: id,
      company: v.company,
      title: v.title,
      location: v.location || null,
      startDate: new Date(v.startDate),
      endDate: v.isCurrent ? null : (v.endDate ? new Date(v.endDate) : null),
      isCurrent: !!v.isCurrent,
      bullets: (v.bullets ?? []).map((b) => b.trim()).filter(Boolean),
    })
    .returning();

  return json({ experience: row }, 201);
}
