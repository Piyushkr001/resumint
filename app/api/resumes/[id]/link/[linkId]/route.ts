// app/api/resumes/[id]/link/[linkId]/route.ts
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

const PatchBody = z.object({
  label: z.string().min(2).optional(),
  url: z.string().url().optional(),
  order: z.union([z.number().int(), z.string()]).optional(),
});

// PATCH /api/resumes/[id]/link/[linkId]
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string; linkId: string }> }
) {
  const { id: rRaw, linkId: lRaw } = await ctx.params;
  const resumeId = decodeURIComponent(rRaw ?? "").trim();
  const linkId = decodeURIComponent(lRaw ?? "").trim();
  if (!UUID_RE.test(resumeId) || !UUID_RE.test(linkId))
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
  const patch: Partial<typeof resumeLinksTable.$inferInsert> = {};
  if (v.label !== undefined) patch.label = v.label.trim();
  if (v.url !== undefined) patch.url = v.url.trim();
  if (v.order !== undefined) patch.order = Number(v.order);

  const [updated] = await db
    .update(resumeLinksTable)
    .set({ ...patch, updatedAt: new Date() })
    .where(and(eq(resumeLinksTable.id, linkId), eq(resumeLinksTable.resumeId, resumeId)))
    .returning();

  if (!updated) return json({ error: "Not found" }, 404);
  return json({ link: updated });
}

// DELETE /api/resumes/[id]/link/[linkId]
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string; linkId: string }> }
) {
  const { id: rRaw, linkId: lRaw } = await ctx.params;
  const resumeId = decodeURIComponent(rRaw ?? "").trim();
  const linkId = decodeURIComponent(lRaw ?? "").trim();
  if (!UUID_RE.test(resumeId) || !UUID_RE.test(linkId))
    return json({ error: "Invalid id" }, 400);

  const uid = await requireUid();
  if (!uid) return json({ error: "Unauthorized" }, 401);

  const owner = await db.query.resumesTable.findFirst({
    where: and(eq(resumesTable.id, resumeId), eq(resumesTable.userId, uid)),
  });
  if (!owner) return json({ error: "Not found" }, 404);

  const [deleted] = await db
    .delete(resumeLinksTable)
    .where(and(eq(resumeLinksTable.id, linkId), eq(resumeLinksTable.resumeId, resumeId)))
    .returning({ id: resumeLinksTable.id });

  if (!deleted) return json({ error: "Not found" }, 404);
  return json({ ok: true, id: deleted.id });
}
