// app/api/resumes/new/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { db } from "@/config/db";
import {
  resumesTable,
  resumeExperiencesTable,
  resumeEducationsTable,
  resumeLinksTable,
} from "@/config/schema";
import { verifyAccessToken } from "@/lib/jwt";

const TemplateEnum = z.enum(["clean", "modern", "minimal", "elegant"]);

// ----- Zod schemas for child sections -----
const ExperienceSchema = z.object({
  company: z.string().min(2),
  title: z.string().min(2),
  location: z.string().optional().nullable(),
  startDate: z.string().min(4), // ISO "YYYY-MM-DD" (or parseable)
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().optional().default(false),
  bullets: z.array(z.string()).max(20).optional(),
});

const EducationSchema = z.object({
  school: z.string().min(2),
  degree: z.string().min(2),
  field: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  startYear: z.number().int().min(1900).max(2100).optional().nullable(),
  endYear: z.number().int().min(1900).max(2100).optional().nullable(),
  achievements: z.array(z.string()).max(20).optional(),
});

const LinkSchema = z.object({
  label: z.string().min(2).max(80),
  url: z.string().url(),
  order: z.number().int().min(0).max(1000).optional(),
});

// ----- Body schema -----
const BodySchema = z.object({
  title: z.string().min(2),
  role: z.string().min(2),
  template: TemplateEnum.default("clean"),
  summary: z.string().max(800).optional().nullable(),
  // accept string "a, b, c" or string[]:
  skills: z.union([z.string(), z.array(z.string()).max(50)]).optional(),
  jobDescription: z.string().optional().nullable(),
  isPublic: z.boolean().optional().default(false),

  experiences: z.array(ExperienceSchema).optional(),
  educations: z.array(EducationSchema).optional(),
  links: z.array(LinkSchema).optional(),
});

function parseSkills(input?: string | string[]) {
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
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await verifyAccessToken(token);
    return String(payload.sub);
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => ({}));
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const body = parsed.data;

  const skills = parseSkills(body.skills);

  // transaction: create resume + children
  const result = await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(resumesTable)
      .values({
        userId,
        title: body.title,
        role: body.role,
        template: body.template,
        summary: body.summary ?? null,
        skills: skills && skills.length ? skills : null,
        jobDescription: body.jobDescription ?? null,
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

    // experiences
    if (body.experiences?.length) {
      await tx.insert(resumeExperiencesTable).values(
        //@ts-ignore
        body.experiences.map((e, idx) => ({
          resumeId: created.id,
          company: e.company,
          title: e.title,
          location: e.location ?? null,
          startDate: new Date(e.startDate),
          endDate: e.endDate ? new Date(e.endDate) : null,
          isCurrent: !!e.isCurrent,
          bullets: e.bullets?.slice(0, 20) ?? null,
        }))
      );
    }

    // educations
    if (body.educations?.length) {
      await tx.insert(resumeEducationsTable).values(
        body.educations.map((ed) => ({
          resumeId: created.id,
          school: ed.school,
          degree: ed.degree,
          field: ed.field ?? null,
          location: ed.location ?? null,
          startYear: ed.startYear ?? null,
          endYear: ed.endYear ?? null,
          achievements: ed.achievements?.slice(0, 20) ?? null,
        }))
      );
    }

    // links
    if (body.links?.length) {
      await tx.insert(resumeLinksTable).values(
        body.links.map((l, i) => ({
          resumeId: created.id,
          label: l.label,
          url: l.url,
          order: l.order ?? i,
        }))
      );
    }

    return created;
  });

  return NextResponse.json({ resume: result }, { status: 201 });
}
