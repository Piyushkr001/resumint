// app/api/resumes/[id]/export/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Buffer } from "node:buffer";
import PDFDocument from "pdfkit";

// ✅ We need Node APIs (streams) for pdfkit
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Experience = {
  id: string;
  company: string;
  title: string;
  location?: string | null;
  startDate: string; // YYYY-MM-DD
  endDate?: string | null;
  isCurrent: boolean;
  bullets?: string[] | null;
};

type Education = {
  id: string;
  school: string;
  degree: string;
  field?: string | null;
  location?: string | null;
  startYear?: number | null;
  endYear?: number | null;
  achievements?: string[] | null;
  gradeType?: "percentage" | "cgpa10" | "cgpa4" | "gpa" | "letter" | null;
  gradeValue?: string | null;
};

type LinkRow = { id: string; label: string; url: string; order: number };

type Resume = {
  id: string;
  title: string;              // Treat as candidate/display name
  role: string;               // e.g. "Frontend Developer"
  template: "clean" | "modern" | "minimal" | "elegant";
  summary?: string | null;
  skills?: string[] | null;
  jobDescription?: string | null;
  isPublic: boolean;
  atsScore?: number;
  experiences: Experience[];
  educations: Education[];
  links: LinkRow[];
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/* ------------------------------- helpers ------------------------------- */

function getOrigin(req: NextRequest) {
  // Prefer explicit base URL; otherwise build from forwarded headers/host
  const env = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  if (env) return env.replace(/\/+$/, "");

  const xfProto = req.headers.get("x-forwarded-proto");
  const xfHost = req.headers.get("x-forwarded-host");
  const proto = xfProto ?? req.headers.get("x-forwarded-protocol") ?? "http";
  const host = xfHost ?? req.headers.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

class UpstreamError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function fetchResumeJSON(req: NextRequest, id: string): Promise<Resume> {
  const origin = getOrigin(req);
  const cookie = req.headers.get("cookie") ?? "";

  const res = await fetch(`${origin}/api/resumes/${id}`, {
    // forward user cookies so auth/session works
    headers: { Cookie: cookie, Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    // Throw with the actual status so we can propagate it (401/404/etc.)
    throw new UpstreamError(res.status, `Upstream /api/resumes/${id} failed: ${res.status} ${errText}`);
  }

  const j = await res.json();
  // API might return { resume, experiences, educations, links } or a flat resume
  const r = (j?.resume ?? j) as Partial<Resume>;
  return {
    id: r.id as string,
    title: r.title ?? "",
    role: r.role ?? "",
    template: (r.template as Resume["template"]) ?? "clean",
    summary: r.summary ?? null,
    skills: r.skills ?? [],
    jobDescription: r.jobDescription ?? null,
    isPublic: !!r.isPublic,
    atsScore: typeof r.atsScore === "number" ? r.atsScore : (r as any).ats ?? 0,
    experiences: (j.experiences ?? r.experiences ?? []) as Experience[],
    educations: (j.educations ?? r.educations ?? []) as Education[],
    links: (j.links ?? r.links ?? []) as LinkRow[],
  };
}

function formatGrade(e: Education) {
  if (!e.gradeType || !e.gradeValue) return null;
  switch (e.gradeType) {
    case "percentage": return `${e.gradeValue}%`;
    case "cgpa10":     return `${e.gradeValue} / 10`;
    case "cgpa4":      return `${e.gradeValue} / 4`;
    case "gpa":        return `${e.gradeValue} GPA`;
    case "letter":     return `${e.gradeValue}`;
    default: return e.gradeValue;
  }
}

function pdfToBuffer(doc: InstanceType<typeof PDFDocument>): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.end();
  });
}

function sectionHeading(doc: InstanceType<typeof PDFDocument>, text: string) {
  doc.moveDown(0.6);
  doc.font("Helvetica-Bold").fontSize(13).fillColor("#111111").text(text);
  doc.moveDown(0.2);
  doc.moveTo(doc.x, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).lineWidth(0.5).stroke("#DDDDDD");
  doc.moveDown(0.3);
}

/* --------------------------------- GET --------------------------------- */

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    // 🔧 Next 15/16: params is a Promise
    const { id: rawId } = await ctx.params;
    if (!rawId || rawId === "undefined") {
      return NextResponse.json({ error: "Missing id in route." }, { status: 400 });
    }

    let id: string;
    try {
      id = decodeURIComponent(rawId);
    } catch {
      return NextResponse.json({ error: "Invalid id encoding." }, { status: 400 });
    }

    if (!UUID_RE.test(id)) {
      return NextResponse.json({ error: "Invalid resume id." }, { status: 400 });
    }

    const format = req.nextUrl.searchParams.get("format") ?? "pdf";
    const attachment = req.nextUrl.searchParams.get("download") === "1";

    if (format !== "pdf") {
      return NextResponse.json({ error: "Only PDF export is supported." }, { status: 400 });
    }

    // Pull data from your existing API (auth respected via forwarded cookies)
    const resume = await fetchResumeJSON(req, id);

    // -------------------------- Render PDF (pdfkit) --------------------------
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 56, right: 56 },
      info: { Title: `${resume.title} – ${resume.role}`, Author: "Resume Builder" },
    });

    // Header (Name + Role)
    doc.font("Helvetica-Bold").fontSize(20).fillColor("#111111").text(resume.title || "Untitled", { continued: false });
    if (resume.role) {
      doc.font("Helvetica").fontSize(12).fillColor("#444444").text(resume.role);
    }

    // Links row (inline)
    const links = (resume.links ?? []).sort((a, b) => a.order - b.order);
    if (links.length) {
      doc.moveDown(0.3);
      doc.font("Helvetica").fontSize(9).fillColor("#0066CC");
      const joined = links.map(l => `${l.label}: ${l.url}`).join("   •   ");
      doc.text(joined, { link: undefined, underline: false });
      doc.fillColor("#111111");
    }

    // Summary
    if (resume.summary) {
      sectionHeading(doc, "Summary");
      doc.font("Helvetica").fontSize(10).fillColor("#222222")
        .text(resume.summary, { lineGap: 2 });
    }

    // Skills
    if (resume.skills && resume.skills.length) {
      sectionHeading(doc, "Skills");
      doc.font("Helvetica").fontSize(10).fillColor("#222222")
        .text(resume.skills.join(" • "), { lineGap: 2 });
    }

    // Experience
    if (resume.experiences && resume.experiences.length) {
      sectionHeading(doc, "Experience");
      for (const e of resume.experiences) {
        const line1 = `${e.title ?? ""}${e.title && e.company ? " • " : ""}${e.company ?? ""}`;
        const line2 = [
          e.startDate,
          e.isCurrent ? "Present" : (e.endDate || "—"),
        ].filter(Boolean).join(" — ");
        const meta = [line2, e.location].filter(Boolean).join("   •   ");

        doc.font("Helvetica-Bold").fontSize(11).fillColor("#111111").text(line1);
        if (meta) doc.font("Helvetica").fontSize(9).fillColor("#666666").text(meta);

        if (e.bullets?.length) {
          doc.moveDown(0.2);
          doc.font("Helvetica").fontSize(10).fillColor("#222222");
          for (const b of e.bullets) {
            doc.text(`• ${b}`, { indent: 10, paragraphGap: 0, lineGap: 1 });
          }
        }
        doc.moveDown(0.5);
      }
    }

    // Education
    if (resume.educations && resume.educations.length) {
      sectionHeading(doc, "Education");
      for (const ed of resume.educations) {
        const line1 = `${ed.degree ?? ""}${ed.degree && ed.school ? " • " : ""}${ed.school ?? ""}`;
        const years = [
          ed.startYear ? String(ed.startYear) : null,
          ed.endYear ? String(ed.endYear) : null,
        ].filter(Boolean).join(" — ");
        const parts = [years || null, ed.field || null, ed.location || null].filter(Boolean) as string[];

        const grade = formatGrade(ed);
        if (grade) parts.push(`Grade: ${grade}`);

        const meta = parts.join("   •   ");

        doc.font("Helvetica-Bold").fontSize(11).fillColor("#111111").text(line1);
        if (meta) doc.font("Helvetica").fontSize(9).fillColor("#666666").text(meta);

        if (ed.achievements?.length) {
          doc.moveDown(0.2);
          doc.font("Helvetica").fontSize(10).fillColor("#222222");
          for (const a of ed.achievements) {
            doc.text(`• ${a}`, { indent: 10, paragraphGap: 0, lineGap: 1 });
          }
        }
        doc.moveDown(0.5);
      }
    }

    const pdfBuffer = await pdfToBuffer(doc);

    // Content-Disposition
    const filenameSafe = `${(resume.title || "resume").replace(/[^\w\d-]+/g, "_")}.pdf`;
    const headers = new Headers({
      "Content-Type": "application/pdf",
      "Content-Length": String(pdfBuffer.length),
      "Cache-Control": "no-store",
      "Content-Disposition": `${attachment ? "attachment" : "inline"}; filename="${filenameSafe}"`,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), { status: 200, headers });
  } catch (err: any) {
    // Propagate upstream statuses (401/404) instead of masking as 500
    if (err instanceof UpstreamError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json(
      { error: err?.message ?? "Export failed" },
      { status: 500 }
    );
  }
}
