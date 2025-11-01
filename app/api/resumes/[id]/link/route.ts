// app/api/resumes/[id]/link/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/config/db";
import { resumesTable, resumeLinksTable } from "@/config/schema";
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
  label: z.string().min(2),
  url: z.string().url(),
  order: z.number().int().min(0).default(0),
});

// POST /api/resumes/[id]/link
export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id: raw } = await ctx.params;
  const id = decodeURIComponent(raw ?? "").trim();
  if (!UUID_RE.test(id)) return json({ error: "Invalid resume id" }, 400);

  const uid = await requireUid();
  if (!uid) return json({ error: "Unauthorized" }, 401);

  const resume = await db.query.resumesTable.findFirst({
    where: and(eq(resumesTable.id, id), eq(resumesTable.userId, uid)),
  });
  if (!resume) return json({ error: "Not found" }, 404);

  const dataUnknown = await req.json().catch(() => null);
  if (!dataUnknown) return json({ error: "Invalid JSON body" }, 400);

  // allow string order too
  const parsed = z.object({
    label: z.string().min(2),
    url: z.string().url(),
    order: z.union([z.string(), z.number()]).optional(),
  }).safeParse(dataUnknown);
  if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);

  const v = parsed.data;
  const [row] = await db
    .insert(resumeLinksTable)
    .values({
      resumeId: id,
      label: v.label.trim(),
      url: v.url.trim(),
      order: v.order == null ? 0 : Number(v.order),
    })
    .returning();

  return json({ link: row }, 201);
}
