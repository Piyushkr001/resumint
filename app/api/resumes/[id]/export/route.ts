// app/api/resumes/[id]/export/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { PassThrough } from "stream";

export const runtime = "nodejs";              // PDFKit needs Node.js runtime
export const dynamic = "force-dynamic";       // always fresh
export const revalidate = 0;

type Experience = {
  id: string;
  company: string;
  title: string;
  location?: string | null;
  startDate: string;
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
  title: string;
  role: string;
  template: "clean" | "modern" | "minimal" | "elegant";
  summary?: string | null;
  skills?: string[] | null;
  jobDescription?: string | null;
  isPublic: boolean;
  atsScore: number;
  experiences: Experience[];
  educations: Education[];
  links: LinkRow[];
};

function formatGrade(gt?: Education["gradeType"], gv?: string | null) {
  if (!gt || !gv) return null;
  const v = String(gv).trim();
  if (!v) return null;
  switch (gt) {
    case "percentage": return `${v.replace(/%$/, "")}%`;
    case "cgpa10": return `${v}/10`;
    case "cgpa4": return `${v}/4`;
    case "gpa": return `${v} GPA`;
    case "letter": return v.toUpperCase();
    default: return v;
  }
}

async function fetchResume(req: NextRequest, id: string): Promise<Resume> {
  // call your own API so you keep all auth logic in one place
  const origin = req.nextUrl.origin;
  const r = await fetch(`${origin}/api/resumes/${id}`, {
    headers: {
      cookie: req.headers.get("cookie") ?? "",
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (r.status === 401) {
    throw new Error("Unauthorized");
  }
  if (!r.ok) {
    const txt = await r.text().catch(() => r.statusText);
    throw new Error(txt || "Failed to load resume");
  }

  const j = await r.json();
  const base: any = j?.resume ?? j ?? {};
  return {
    id: base.id,
    title: base.title ?? "",
    role: base.role ?? "",
    template: base.template ?? "clean",
    summary: base.summary ?? null,
    skills: base.skills ?? [],
    jobDescription: base.jobDescription ?? null,
    isPublic: !!base.isPublic,
    atsScore: typeof base.atsScore === "number" ? base.atsScore : 0,
    experiences: j.experiences ?? base.experiences ?? [],
    educations: j.educations ?? base.educations ?? [],
    links: j.links ?? base.links ?? [],
  } as Resume;
}

function drawSectionTitle(doc: PDFKit.PDFDocument, text: string) {
  doc
    .moveDown(0.6)
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#111")
    .text(text.toUpperCase(), { underline: false });
  doc
    .moveTo(doc.page.margins.left, doc.y + 2)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y + 2)
    .lineWidth(1)
    .strokeColor("#e5e7eb")
    .stroke();
  doc.moveDown(0.4);
}

function drawSmallLabel(doc: PDFKit.PDFDocument, label: string, value?: string | null) {
  if (!value) return;
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#374151")
    .text(`${label}: ${value}`);
}

function drawBulletList(doc: PDFKit.PDFDocument, items?: string[] | null) {
  if (!items?.length) return;
  items.forEach((line) => {
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#111")
      .list([line], { bulletRadius: 1.5, textIndent: 10, bulletIndent: 5 });
  });
}

function drawTagRow(doc: PDFKit.PDFDocument, tags: string[]) {
  if (!tags.length) return;
  const startY = doc.y;
  const startX = doc.x;
  const tagPaddingX = 6;
  const tagPaddingY = 3;
  const tagGap = 5;
  const tagHeight = 14;
  let x = startX;
  let y = startY;

  doc.fontSize(9);

  for (const t of tags) {
    const w = doc.widthOfString(t) + tagPaddingX * 2;
    if (x + w > doc.page.width - doc.page.margins.right) {
      x = doc.page.margins.left;
      y += tagHeight + tagGap;
    }
    // bg
    doc
      .save()
      .roundedRect(x, y, w, tagHeight, 3)
      .fill("#F3F4F6")
      .restore();

    doc
      .fillColor("#111")
      .text(t, x + tagPaddingX, y + tagPaddingY, { width: w - tagPaddingX * 2, height: tagHeight - tagPaddingY * 2 });

    x += w + tagGap;
  }

  doc.moveTo(doc.x, y + tagHeight).moveDown(0.6);
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = decodeURIComponent(params.id);
    const format = req.nextUrl.searchParams.get("format") ?? "pdf";
    const attachment = req.nextUrl.searchParams.get("download") === "1";

    if (format !== "pdf") {
      return NextResponse.json({ error: "Only format=pdf is supported." }, { status: 400 });
    }

    const resume = await fetchResume(req, id);

    // Build PDF
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const stream = doc.pipe(new PassThrough());

    // HEADER
    doc
      .font("Helvetica-Bold")
      .fontSize(18)
      .fillColor("#111")
      .text(resume.title || "Resume", { continued: false });

    doc
      .moveDown(0.2)
      .font("Helvetica")
      .fontSize(11)
      .fillColor("#2563EB")
      .text(resume.role || "", { continued: false });

    // Summary
    if (resume.summary) {
      drawSectionTitle(doc, "Summary");
      doc
        .font("Helvetica")
        .fontSize(10.5)
        .fillColor("#111")
        .text(resume.summary, { align: "left" });
    }

    // Skills
    if ((resume.skills ?? []).length) {
      drawSectionTitle(doc, "Skills");
      drawTagRow(doc, resume.skills!);
    }

    // Experience
    if ((resume.experiences ?? []).length) {
      drawSectionTitle(doc, "Experience");
      for (const e of resume.experiences) {
        const line1 =
          `${e.title ?? ""}${e.company ? " • " + e.company : ""}`.trim().replace(/^•\s*/, "");
        doc.font("Helvetica-Bold").fontSize(11).fillColor("#111").text(line1);
        const dates = `${e.startDate ?? "—"} — ${e.isCurrent ? "Present" : (e.endDate || "—")}`;
        const meta = [dates, e.location].filter(Boolean).join(" • ");
        doc.font("Helvetica").fontSize(10).fillColor("#6B7280").text(meta);
        if (e.bullets?.length) {
          drawBulletList(doc, e.bullets);
        }
        doc.moveDown(0.4);
      }
    }

    // Education
    if ((resume.educations ?? []).length) {
      drawSectionTitle(doc, "Education");
      for (const ed of resume.educations) {
        const line1 =
          `${ed.degree ?? ""}${ed.school ? " • " + ed.school : ""}`.trim().replace(/^•\s*/, "");
        doc.font("Helvetica-Bold").fontSize(11).fillColor("#111").text(line1);

        const yearSpan = `${ed.startYear ?? "—"} — ${ed.endYear ?? "—"}`;
        const bits = [yearSpan, ed.field, ed.location].filter(Boolean);
        const grade = formatGrade(ed.gradeType, ed.gradeValue);
        if (grade) bits.push(`Grade: ${grade}`);
        doc.font("Helvetica").fontSize(10).fillColor("#6B7280").text(bits.join(" • "));

        if (ed.achievements?.length) {
          drawBulletList(doc, ed.achievements);
        }
        doc.moveDown(0.4);
      }
    }

    // Links
    if ((resume.links ?? []).length) {
      drawSectionTitle(doc, "Links");
      const sorted = [...resume.links].sort((a, b) => a.order - b.order);
      for (const l of sorted) {
        // label
        doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#111").text(l.label);
        // url as hyperlink
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor("#2563EB")
          .text(l.url, { link: l.url, underline: true });
        doc.moveDown(0.2);
      }
    }

    doc.end();

    // Convert Node stream -> Web ReadableStream
    const readable = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => controller.enqueue(chunk));
        stream.on("end", () => controller.close());
        stream.on("error", (err) => controller.error(err));
      },
      cancel() {
        stream.destroy();
      },
    });

    const filenameBase = (resume.title || "Resume").replace(/[^\w\s.-]/g, "").trim() || "Resume";
    const headers = new Headers({
      "Content-Type": "application/pdf",
      "Cache-Control": "no-store",
      "Content-Disposition": `${attachment ? "attachment" : "inline"}; filename="${filenameBase}.pdf"`,
    });

    return new NextResponse(readable, { status: 200, headers });
  } catch (err: any) {
    const msg = typeof err?.message === "string" ? err.message : "Export failed";
    const code = /unauthor/i.test(msg) ? 401 : 500;
    return NextResponse.json({ error: msg }, { status: code });
  }
}
