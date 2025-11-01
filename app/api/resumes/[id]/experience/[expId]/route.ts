// app/api/resumes/[id]/experience/[expId]/route.ts
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

const PatchBody = z.object({
  company: z.string().min(2).optional(),
  title: z.string().min(2).optional(),
  location: z.string().optional(),
  startDate: z.string().min(4).optional(),
  endDate: z.string().nullable().optional(),
  isCurrent: z.boolean().optional(),
  bullets: z.array(z.string()).max(20).optional(),
});

// PATCH /api/resumes/[id]/experience/[expId]
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string; expId: string }> }
) {
  const { id: rRaw, expId: eRaw } = await ctx.params;
  const resumeId = decodeURIComponent(rRaw ?? "").trim();
  const expId = decodeURIComponent(eRaw ?? "").trim();
  if (!UUID_RE.test(resumeId) || !UUID_RE.test(expId))
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
  const patch: Partial<typeof resumeExperiencesTable.$inferInsert> = {};
  if (v.company !== undefined) patch.company = v.company;
  if (v.title !== undefined) patch.title = v.title;
  if (v.location !== undefined) patch.location = v.location || null;
  if (v.startDate !== undefined)
    patch.startDate = new Date(v.startDate).toISOString();
  if (v.endDate !== undefined)
    patch.endDate = v.endDate === null ? null : new Date(v.endDate).toISOString();
  if (v.isCurrent !== undefined) patch.isCurrent = !!v.isCurrent;
  if (v.bullets !== undefined)
    patch.bullets = (v.bullets ?? []).map((b) => b.trim()).filter(Boolean);
  const [updated] = await db
    .update(resumeExperiencesTable)
    .set({ ...patch, updatedAt: new Date() })
    .where(
      and(
        eq(resumeExperiencesTable.id, expId),
        eq(resumeExperiencesTable.resumeId, resumeId)
      )
    )
    .returning();

  if (!updated) return json({ error: "Not found" }, 404);
  return json({ experience: updated });
}

// DELETE /api/resumes/[id]/experience/[expId]
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string; expId: string }> }
) {
  const { id: rRaw, expId: eRaw } = await ctx.params;
  const resumeId = decodeURIComponent(rRaw ?? "").trim();
  const expId = decodeURIComponent(eRaw ?? "").trim();
  if (!UUID_RE.test(resumeId) || !UUID_RE.test(expId))
    return json({ error: "Invalid id" }, 400);

  const uid = await requireUid();
  if (!uid) return json({ error: "Unauthorized" }, 401);

  // Ownership via resumeId
  const owner = await db.query.resumesTable.findFirst({
    where: and(eq(resumesTable.id, resumeId), eq(resumesTable.userId, uid)),
  });
  if (!owner) return json({ error: "Not found" }, 404);

  const [deleted] = await db
    .delete(resumeExperiencesTable)
    .where(
      and(
        eq(resumeExperiencesTable.id, expId),
        eq(resumeExperiencesTable.resumeId, resumeId)
      )
    )
    .returning({ id: resumeExperiencesTable.id });

  if (!deleted) return json({ error: "Not found" }, 404);
  return json({ ok: true, id: deleted.id });
}
