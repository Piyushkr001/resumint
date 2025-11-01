// app/api/resumes/[id]/education/route.ts
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

const Body = z.object({
  school: z.string().min(2),
  degree: z.string().min(2),
  field: z.string().optional(),
  location: z.string().optional(),
  startYear: z.number().int().min(1900).max(3000).nullable().optional(),
  endYear: z.number().int().min(1900).max(3000).nullable().optional(),
  achievements: z.array(z.string()).max(20).optional(),
});

// POST /api/resumes/[id]/education
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

  // allow strings too and coerce
  const pre = z.object({
    school: z.string().min(2),
    degree: z.string().min(2),
    field: z.string().optional(),
    location: z.string().optional(),
    startYear: z.union([z.string(), z.number()]).nullable().optional(),
    endYear: z.union([z.string(), z.number()]).nullable().optional(),
    achievements: z.array(z.string()).max(20).optional(),
  }).safeParse(dataUnknown);
  if (!pre.success) return json({ error: pre.error.flatten() }, 400);

  const v = pre.data;
  const toNum = (x: string | number | null | undefined) =>
    x == null || x === "" ? null : Number(x);

  const [row] = await db
    .insert(resumeEducationsTable)
    .values({
      resumeId: id,
      school: v.school,
      degree: v.degree,
      field: v.field || null,
      location: v.location || null,
      startYear: toNum(v.startYear),
      endYear: toNum(v.endYear),
      achievements: (v.achievements ?? []).map((a) => a.trim()).filter(Boolean),
    })
    .returning();

  return json({ education: row }, 201);
}
