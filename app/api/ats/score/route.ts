// app/api/ats/score/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

import { db } from "@/config/db";
import { atsAnalysesTable } from "@/config/schema";
import { verifyAccessToken } from "@/lib/jwt";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ------------------------------ helpers ------------------------------ */
const STOP = new Set([
  "and","or","the","a","an","of","to","in","for","with","on","at","by","as",
  "is","are","be","this","that","from","your","you","we","our","their","they",
  "it","i","me","my","mine","us","will","shall","can","could","should","must",
  "have","has","had","do","did","done","not","no","yes","but","if","then",
  "about","across","over","under","within","between","per","etc","via"
]);
const SKILL_HINTS = [
  "nextjs","react","typescript","javascript","tailwind","shadcn","drizzle","neon",
  "postgres","node","express","redux","zustand","clerk","oauth","vite","webpack",
  "bun","jest","testing","e2e","cypress","storybook","accessibility","a11y",
  "docker","kubernetes","ci","cd","vercel","render","seo","performance","security",
  "chartjs","threejs","pdfkit","pdfjs","rest","graphql"
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\+\#\.\- ]+/g, " ")
    .split(/\s+/g)
    .filter(t => t && t.length > 2 && !STOP.has(t));
}
function isUsefulKeyword(k: string) {
  if (k.length <= 2) return false;
  if (/^\d+$/.test(k)) return false;
  if (["developer","engineer","senior","junior","team","product","company","role"].includes(k)) return false;
  return true;
}
function rankKeywords(text: string, max = 40): string[] {
  const tokens = tokenize(text);
  const freq = new Map<string, number>();
  for (const t of tokens) {
    const w = t.replace(/\.$/, "");
    freq.set(w, (freq.get(w) ?? 0) + (SKILL_HINTS.includes(w) ? 4 : 1));
  }
  const ranked = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([w]) => w)
    .filter(isUsefulKeyword);

  const dedup: string[] = [];
  for (const k of ranked) {
    if (!dedup.some(d => d.includes(k) || k.includes(d))) dedup.push(k);
    if (dedup.length >= max) break;
  }
  return dedup;
}
function pickTopKeywordsFromJD(jd: string) {
  const ranked = rankKeywords(jd, 60);
  const hinted = ranked.filter(r => SKILL_HINTS.includes(r));
  const others = ranked.filter(r => !SKILL_HINTS.includes(r));
  return Array.from(new Set([...hinted.slice(0, 20), ...others.slice(0, 20)])).slice(0, 30);
}
function extractSignals(resumeText: string) {
  const email = resumeText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? null;
  const phone = resumeText.match(/(\+?\d[\d\-\s()]{8,}\d)/)?.[0] ?? null;
  const links = Array.from(resumeText.matchAll(/https?:\/\/[^\s)]+/g)).map(m => m[0]);
  const github = links.find(l => /github\.com\//i.test(l)) ?? null;
  const linkedin = links.find(l => /linkedin\.com\//i.test(l)) ?? null;
  return { email, phone, github, linkedin, links };
}
function scoreATS(resumeText: string, jdText: string) {
  const jdKeys = pickTopKeywordsFromJD(jdText);
  const resTokens = new Set(tokenize(resumeText));
  const matched = jdKeys.filter(k => resTokens.has(k));
  const missing = jdKeys.filter(k => !resTokens.has(k));

  let base = 0;
  for (const k of matched) base += SKILL_HINTS.includes(k) ? 4 : 2;
  const ideal = jdKeys.reduce((acc, k) => acc + (SKILL_HINTS.includes(k) ? 4 : 2), 0);
  const coverage = ideal ? Math.min(1, base / ideal) : 0;

  const sig = extractSignals(resumeText);
  let boost = 0;
  if (sig.email) boost += 0.03;
  if (sig.phone) boost += 0.02;
  if (sig.github || sig.linkedin) boost += 0.03;

  const score = Math.round(Math.min(100, (coverage + boost) * 100));
  const extras = rankKeywords(resumeText, 40).filter(k => !jdKeys.includes(k)).slice(0, 15);

  const issues: string[] = [];
  if (!sig.email) issues.push("Email not detected");
  if (!sig.phone) issues.push("Phone not detected");
  if (!sig.linkedin) issues.push("LinkedIn not detected");
  if (resumeText.length < 1200) issues.push("Resume text seems too short");
  if (missing.length > 15) issues.push("Many JD keywords missing");
  if (score < 60) issues.push("Low JD match — tailor your bullets");

  const summary = `Matched ${matched.length}/${jdKeys.length} target skills. ${
    issues.length ? `Issues: ${issues.join("; ")}.` : "No major issues detected."
  }`;

  return { score, matched, missing, extras, issues, summary };
}

async function requireUid(): Promise<string | null> {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return null;
  try {
    const { payload } = await verifyAccessToken(cookie);
    const sub = payload?.sub;
    return sub ? String(sub) : null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null) as
      | { resumeText?: string; jdText?: string; save?: boolean; resumeId?: string }
      | null;

    if (!body || !body.resumeText || !body.jdText) {
      return NextResponse.json({ error: "Provide resumeText and jdText" }, { status: 400 });
    }

    const result = scoreATS(body.resumeText, body.jdText);

    // Optional save
    let savedId: string | null = null;
    if (body.save) {
      const uid = await requireUid();
      if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      const jdHash = crypto.createHash("sha256").update(body.jdText).digest("hex");

      const [row] = await db
        .insert(atsAnalysesTable)
        .values({
          userId: uid,
          resumeId: body.resumeId ?? null,
          jdHash,
          score: result.score,
          matched: result.matched,
          missing: result.missing,
          extras: result.extras,
          issues: result.issues,
        })
        .returning({ id: atsAnalysesTable.id });

      savedId = row?.id ?? null;
    }

    return NextResponse.json({ ...result, id: savedId }, { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Scoring failed" }, { status: 500 });
  }
}
