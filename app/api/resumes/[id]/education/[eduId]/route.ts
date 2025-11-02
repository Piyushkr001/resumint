// app/api/resumes/[id]/education/[eduId]/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/config/db";
import { resumesTable, resumeEducationsTable } from "@/config/schema";
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

const PatchBody = z.object({
  school: z.string().min(2).optional(),
  degree: z.string().min(2).optional(),
  field: z.string().optional(),
  location: z.string().optional(),
  gradeType: z.string().max(40).optional(),
  gradeValue: z.string().max(40).optional(),
  startYear: z.union([z.number(), z.string()]).nullable().optional(),
  endYear: z.union([z.number(), z.string()]).nullable().optional(),
  achievements: z.array(z.string()).max(20).optional(),
});

// PATCH /api/resumes/[id]/education/[eduId]
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string; eduId: string }> }
) {
  const { id: rRaw, eduId: eRaw } = await ctx.params;
  const resumeId = decodeURIComponent(rRaw ?? "").trim();
  const eduId = decodeURIComponent(eRaw ?? "").trim();
  if (!UUID_RE.test(resumeId) || !UUID_RE.test(eduId))
    return json({ error: "Invalid id" }, 400);

  const uid = await requireUid();
  if (!uid) return json({ error: "Unauthorized" }, 401);

  const owner = await db.query.resumesTable.findFirst({
    where: and(eq(resumesTable.id, resumeId), eq(resumesTable.userId, uid)),
  });
  if (!owner) return json({ error: "Not found" }, 404);

  const bodyUnknown = await req.json().catch(() => null);
  if (!bodyUnknown) return json({ error: "Invalid JSON body" }, 400);
  const parsed = PatchBody.safeParse(bodyUnknown);
  if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);

  const v = parsed.data;
  const toNum = (x: string | number | null | undefined) =>
    x == null || x === "" ? null : Number(x);

  const patch: Partial<typeof resumeEducationsTable.$inferInsert> = {};
  if (v.school !== undefined) patch.school = v.school;
  if (v.degree !== undefined) patch.degree = v.degree;
  if (v.field !== undefined) patch.field = v.field || null;
  if (v.location !== undefined) patch.location = v.location || null;
  if (v.gradeType !== undefined) patch.gradeType = v.gradeType || null;
  if (v.gradeValue !== undefined) patch.gradeValue = v.gradeValue || null;
  if (v.startYear !== undefined) patch.startYear = toNum(v.startYear);
  if (v.endYear !== undefined) patch.endYear = toNum(v.endYear);
  if (v.achievements !== undefined)
    patch.achievements = (v.achievements ?? []).map((a) => a.trim()).filter(Boolean);

  const [updated] = await db
    .update(resumeEducationsTable)
    .set({ ...patch, updatedAt: new Date() })
    .where(
      and(
        eq(resumeEducationsTable.id, eduId),
        eq(resumeEducationsTable.resumeId, resumeId)
      )
    )
    .returning();

  if (!updated) return json({ error: "Not found" }, 404);
  return json({ education: updated });
}

// DELETE /api/resumes/[id]/education/[eduId]
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string; eduId: string }> }
) {
  const { id: rRaw, eduId: eRaw } = await ctx.params;
  const resumeId = decodeURIComponent(rRaw ?? "").trim();
  const eduId = decodeURIComponent(eRaw ?? "").trim();
  if (!UUID_RE.test(resumeId) || !UUID_RE.test(eduId))
    return json({ error: "Invalid id" }, 400);

  const uid = await requireUid();
  if (!uid) return json({ error: "Unauthorized" }, 401);

  const owner = await db.query.resumesTable.findFirst({
    where: and(eq(resumesTable.id, resumeId), eq(resumesTable.userId, uid)),
  });
  if (!owner) return json({ error: "Not found" }, 404);

  const [deleted] = await db
    .delete(resumeEducationsTable)
    .where(
      and(
        eq(resumeEducationsTable.id, eduId),
        eq(resumeEducationsTable.resumeId, resumeId)
      )
    )
    .returning({ id: resumeEducationsTable.id });

  if (!deleted) return json({ error: "Not found" }, 404);
  return json({ ok: true, id: deleted.id });
}
