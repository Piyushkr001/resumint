// app/api/resumes/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/config/db";
import { resumesTable } from "@/config/schema";
import { verifyAccessToken } from "@/lib/jwt";

const CreateBody = z.object({
  title: z.string().min(2),
  role: z.string().min(2),
  template: z.enum(["clean", "modern", "minimal", "elegant"]),
  summary: z.string().max(800).optional().nullable(),
  skills: z.union([
    z.string(),               // comma/newline separated
    z.array(z.string()).max(50),
  ]).optional(),
  jobDescription: z.string().optional().nullable(),
  isPublic: z.boolean().optional().default(false),
});

function parseSkills(input?: string | string[] | null): string[] | null {
  if (!input) return null;
  if (Array.isArray(input)) {
    return input.map((s) => s.trim()).filter(Boolean).slice(0, 50);
  }
  return input
    .split(/[,\n]/g)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);
}

async function requireUserId(): Promise<string | null> {
  const jar = cookies();
  const token = (await jar).get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await verifyAccessToken(token);
    return String(payload.sub);
  } catch {
    return null;
  }
}

// GET /api/resumes?q=&limit=&offset=
export async function GET(req: Request) {
  const uid = await requireUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10) || 20, 50);
  const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10) || 0, 0);

  const where = q
    ? and(
        eq(resumesTable.userId, uid),
        or(
          ilike(resumesTable.title, `%${q}%`),
          ilike(resumesTable.role, `%${q}%`),
          ilike(resumesTable.template, `%${q}%`)
        )
      )
    : eq(resumesTable.userId, uid);

  const rows = await db
    .select({
      id: resumesTable.id,
      title: resumesTable.title,
      role: resumesTable.role,
      template: resumesTable.template,
      atsScore: resumesTable.atsScore,
      updatedAt: resumesTable.updatedAt,
    })
    .from(resumesTable)
    .where(where)
    .orderBy(desc(resumesTable.updatedAt))
    .limit(limit)
    .offset(offset);

  return NextResponse.json({ items: rows, limit, offset });
}

// POST /api/resumes
export async function POST(req: Request) {
  const uid = await requireUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => ({}));
  const parsed = CreateBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const body = parsed.data;
  const skills = parseSkills(body.skills);

  const [created] = await db
    .insert(resumesTable)
    .values({
      userId: uid,
      title: body.title,
      role: body.role,
      template: body.template,
      summary: body.summary || null,
      skills: skills && skills.length ? skills : null,
      jobDescription: body.jobDescription || null,
      isPublic: body.isPublic ?? false,
      atsScore: 0,
    })
    .returning({
      id: resumesTable.id,
      title: resumesTable.title,
      role: resumesTable.role,
      template: resumesTable.template,
      atsScore: resumesTable.atsScore,
      updatedAt: resumesTable.updatedAt,
    });

  return NextResponse.json({ resume: created }, { status: 201 });
}
