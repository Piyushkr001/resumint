// app/api/ats/extract/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createRequire } from "module";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const require = createRequire(import.meta.url);

/* ------------------------------- helpers ------------------------------- */

function isPdf(u8: Uint8Array) {
  return (
    !!u8 &&
    u8.byteLength >= 5 &&
    u8[0] === 0x25 && // %
    u8[1] === 0x50 && // P
    u8[2] === 0x44 && // D
    u8[3] === 0x46 && // F
    u8[4] === 0x2D    // -
  );
}

/** Load pdf-parse in a way that survives CJS/ESM differences. */
let _pdfParse:
  | ((data: Buffer | Uint8Array) => Promise<{ text?: string } & Record<string, any>>)
  | null = null;

async function getPdfParse() {
  if (_pdfParse) return _pdfParse;

  // Try ESM dynamic import first
  try {
    const mod: any = await import("pdf-parse");
    const fn = typeof mod === "function" ? mod : mod?.default;
    if (typeof fn === "function") {
      _pdfParse = fn;
      return fn;
    }
  } catch {}

  // Then try CJS require
  try {
    const mod: any = require("pdf-parse");
    const fn = typeof mod === "function" ? mod : mod?.default;
    if (typeof fn === "function") {
      _pdfParse = fn;
      return fn;
    }
  } catch {}

  return null;
}

async function extractWithPdfParse(u8: Uint8Array): Promise<string> {
  const pdfParse = await getPdfParse();
  if (!pdfParse) return "";
  const out = await pdfParse(Buffer.from(u8)); // prefers Buffer
  return (out?.text ?? "").trim();
}

/** Fallback using pdfjs-dist via root import (no subpath to avoid resolution issues). */
async function extractWithPdfjs(u8: Uint8Array): Promise<string> {
  // Works with pdfjs-dist v4/v5
  const pdfjs: any = await import("pdfjs-dist");
  const getDocument = pdfjs.getDocument ?? pdfjs.default?.getDocument;
  if (typeof getDocument !== "function") throw new Error("pdfjs-dist getDocument not found");

  const doc = await getDocument({
    data: u8,
    isEvalSupported: false, // safer on server
    useWorkerFetch: false,
  }).promise;

  try {
    const parts: string[] = [];
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const content = await page.getTextContent();
      const line = content.items
        .map((it: any) => (it && typeof it.str === "string" ? it.str : ""))
        .filter(Boolean)
        .join(" ");
      parts.push(line);
      page.cleanup?.();
    }
    return parts.join("\n").replace(/\s+/g, " ").trim();
  } finally {
    try { await doc.cleanup?.(); } catch {}
    try { await doc.destroy?.(); } catch {}
  }
}

async function extractPdfText(ab: ArrayBuffer): Promise<string> {
  const u8 = new Uint8Array(ab);

  // 1) Try pdf-parse (fast/simple), 2) fall back to pdfjs-dist
  try {
    const t = await extractWithPdfParse(u8);
    if (t) return t;
  } catch {}
  return await extractWithPdfjs(u8);
}

async function extractTextPlain(ab: ArrayBuffer): Promise<string> {
  return new TextDecoder("utf-8", { fatal: false }).decode(new Uint8Array(ab)).trim();
}

/* --------------------------------- POST -------------------------------- */

export async function POST(req: NextRequest) {
  try {
    const ct = (req.headers.get("content-type") || "").toLowerCase();

    // Raw bytes
    if (ct.startsWith("application/octet-stream")) {
      const ab = await req.arrayBuffer();
      if (!ab || ab.byteLength === 0) {
        return NextResponse.json({ error: "Empty body" }, { status: 400 });
      }
      const u8 = new Uint8Array(ab);
      const text = isPdf(u8) ? await extractPdfText(ab) : await extractTextPlain(ab);
      if (!text) return NextResponse.json({ error: "Could not extract text" }, { status: 422 });
      return NextResponse.json({ text }, { status: 200, headers: { "Cache-Control": "no-store" } });
    }

    // Multipart form-data
    if (ct.includes("multipart/form-data")) {
      const fd = await req.formData();
      const file = fd.get("file") as File | null;
      if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 });

      const ab = await file.arrayBuffer();
      const mime = (file.type || "").toLowerCase();
      const u8 = new Uint8Array(ab);

      const text =
        mime === "application/pdf" || isPdf(u8)
          ? await extractPdfText(ab)
          : mime === "text/plain"
          ? await extractTextPlain(ab)
          : isPdf(u8)
          ? await extractPdfText(ab)
          : await extractTextPlain(ab);

      if (!text) return NextResponse.json({ error: "Could not extract text" }, { status: 422 });
      return NextResponse.json({ text }, { status: 200, headers: { "Cache-Control": "no-store" } });
    }

    return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 415 });
  } catch (err: any) {
    console.error("ATS extract error:", err);
    return NextResponse.json({ error: err?.message ?? "Extraction failed" }, { status: 500 });
  }
}
