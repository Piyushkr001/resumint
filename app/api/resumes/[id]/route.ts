// app/api/resumes/[id]/route.ts
// Next.js 16: params is a Promise — always `await` it.
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
  resumeEducationsTable,
  resumeLinksTable,
} from "@/config/schema";
import { verifyAccessToken } from "@/lib/jwt";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function json(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

// FIX: more robust cookie lookup + no `await cookies()`
async function requireUid(): Promise<string | null> {
  try {
    const jar = await cookies();
    const token =
      jar.get("token")?.value ??
      jar.get("session")?.value ??
      jar.get("__session")?.value ??
      null;
    if (!token) return null;

    const { payload } = await verifyAccessToken(token);
    const sub = payload?.sub;
    return sub ? String(sub) : null;
  } catch {
    return null;
  }
}

const UpdateBody = z.object({
  title: z.string().min(2).optional(),
  role: z.string().min(2).optional(),
  template: z.enum(["clean", "modern", "minimal", "elegant"]).optional(),
  summary: z.string().max(800).nullable().optional(),
  skills: z.union([z.string(), z.array(z.string()).max(50)]).nullable().optional(),
  jobDescription: z.string().nullable().optional(),
  isPublic: z.boolean().optional(),
  atsScore: z.number().int().min(0).max(100).optional(),
});

function parseSkills(input?: string | string[] | null): string[] | null {
  if (input == null) return null;
  if (Array.isArray(input)) {
    return input.map((s) => s.trim()).filter(Boolean).slice(0, 50);
  }
  return input
    .split(/[,\n]/g)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);
}

// GET /api/resumes/[id]
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id: raw } = await ctx.params; // ✅ keep awaiting params
  const id = decodeURIComponent(raw ?? "").trim();
  if (!UUID_RE.test(id)) return json({ error: "Invalid resume id" }, 400);

  const uid = await requireUid();
  if (!uid) return json({ error: "Unauthorized" }, 401);

  const resume = await db.query.resumesTable.findFirst({
    where: and(eq(resumesTable.id, id), eq(resumesTable.userId, uid)),
  });
  if (!resume) return json({ error: "Not found" }, 404);

  const [experiences, educations, links] = await Promise.all([
    db
      .select()
      .from(resumeExperiencesTable)
      .where(eq(resumeExperiencesTable.resumeId, id)),
    db
      .select()
      .from(resumeEducationsTable)
      .where(eq(resumeEducationsTable.resumeId, id)),
    db
      .select()
      .from(resumeLinksTable)
      .where(eq(resumeLinksTable.resumeId, id)),
  ]);

  return json({
    resume: { ...resume, skills: resume.skills ?? [] },
    experiences,
    educations,
    links,
  });
}

// PATCH /api/resumes/[id]
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id: raw } = await ctx.params; // ✅ keep awaiting params
  const id = decodeURIComponent(raw ?? "").trim();
  if (!UUID_RE.test(id)) return json({ error: "Invalid resume id" }, 400);

  const uid = await requireUid();
  if (!uid) return json({ error: "Unauthorized" }, 401);

  const bodyUnknown = await req.json().catch(() => null);
  if (!bodyUnknown) return json({ error: "Invalid JSON body" }, 400);

  const parsed = UpdateBody.safeParse(bodyUnknown);
  if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);

  // Enforce ownership exists first
  const ownerRow = await db.query.resumesTable.findFirst({
    where: and(eq(resumesTable.id, id), eq(resumesTable.userId, uid)),
  });
  if (!ownerRow) return json({ error: "Not found" }, 404);

  const data = parsed.data;
  const patch: Partial<typeof resumesTable.$inferInsert> = {};

  if (data.title !== undefined) patch.title = data.title;
  if (data.role !== undefined) patch.role = data.role;
  if (data.template !== undefined) patch.template = data.template;
  if (data.summary !== undefined) patch.summary = data.summary ?? null;
  if (data.jobDescription !== undefined)
    patch.jobDescription = data.jobDescription ?? null;
  if (data.isPublic !== undefined) patch.isPublic = data.isPublic;
  if (data.atsScore !== undefined) patch.atsScore = data.atsScore;
  if (data.skills !== undefined) {
    const parsedSkills = parseSkills(data.skills);
    patch.skills = parsedSkills && parsedSkills.length ? parsedSkills : null;
  }

  const [updated] = await db
    .update(resumesTable)
    .set({ ...patch, updatedAt: new Date() })
    .where(and(eq(resumesTable.id, id), eq(resumesTable.userId, uid)))
    .returning();

  return json({ resume: { ...updated, skills: updated.skills ?? [] } });
}

// DELETE /api/resumes/[id]
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id: raw } = await ctx.params; // ✅ keep awaiting params
  const id = decodeURIComponent(raw ?? "").trim();
  if (!UUID_RE.test(id)) return json({ error: "Invalid resume id" }, 400);

  const uid = await requireUid();
  if (!uid) return json({ error: "Unauthorized" }, 401);

  const [deleted] = await db
    .delete(resumesTable)
    .where(and(eq(resumesTable.id, id), eq(resumesTable.userId, uid)))
    .returning({ id: resumesTable.id });

  if (!deleted) return json({ error: "Not found" }, 404);
  return json({ ok: true, id: deleted.id });
}
