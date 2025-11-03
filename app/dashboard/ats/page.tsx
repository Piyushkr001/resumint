// app/dashboard/ats/page.tsx
"use client";

import * as React from "react";
import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";

import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";

import {
  FileUp, ClipboardPaste, Trash2, Loader2, CheckCircle2, Download, Sparkles, Link2, Mail, Phone, ShieldCheck,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Helpers (tokenization/keyword ranking used only for local signals)  */
/* ------------------------------------------------------------------ */

const STOP = new Set([
  "and","or","the","a","an","of","to","in","for","with","on","at","by","as",
  "is","are","be","this","that","from","your","you","we","our","their","they",
  "it","i","me","my","mine","us","will","shall","can","could","should","must",
  "have","has","had","do","did","done","not","no","yes","but","if","then",
  "about","across","over","under","within","between","per","etc","via"
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\+\#\.\- ]+/g, " ")
    .split(/\s+/g)
    .filter(t => t && t.length > 2 && !STOP.has(t));
}

function extractResumeSignals(text: string) {
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? null;
  const phone = text.match(/(\+?\d[\d\-\s()]{8,}\d)/)?.[0] ?? null;
  const links = Array.from(text.matchAll(/https?:\/\/[^\s)]+/g)).map(m => m[0]);
  const github = links.find(l => /github\.com\//i.test(l)) ?? null;
  const linkedin = links.find(l => /linkedin\.com\//i.test(l)) ?? null;
  const years = Array.from(text.matchAll(/(\d+)\+?\s*(?:years|yrs)/gi)).map(m => Number(m[1]));
  const claimedYoE = years.length ? Math.max(...years) : null;

  return { email, phone, links, github, linkedin, claimedYoE };
}

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type ScoreResult = {
  score: number;        // 0..100
  matched: string[];
  missing: string[];
  extras: string[];
  issues: string[];
  summary: string;
};

type ScoreAPIResponse = ScoreResult | { result: ScoreResult };

/* ------------------------------------------------------------------ */
/* File helpers                                                        */
/* ------------------------------------------------------------------ */

async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(new Error("Failed to read file"));
    r.onload = () => resolve(r.result as ArrayBuffer);
    r.readAsArrayBuffer(file);
  });
}

async function extractResumeTextViaAPI(file: File): Promise<string> {
  // 1) Try octet-stream first
  try {
    const ab = await readFileAsArrayBuffer(file);
    const res = await fetch("/api/ats/extract", {
      method: "POST",
      headers: { "Content-Type": "application/octet-stream" },
      body: ab,
    });
    if (res.ok) {
      const j = await res.json();
      const t = (j?.text ?? "").trim();
      if (t) return t;
      throw new Error(j?.error || "Empty extraction");
    } else {
      const tx = await res.text();
      throw new Error(tx || `HTTP ${res.status}`);
    }
  } catch (e: any) {
    // 2) Fallback: multipart/form-data
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/ats/extract", { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      const j = await res.json();
      const t = (j?.text ?? "").trim();
      if (t) return t;
      throw new Error(j?.error || "Empty extraction");
    } catch (ee: any) {
      throw new Error(ee?.message ?? "Extraction failed");
    }
  }
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ATSPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const [jdText, setJdText] = useState<string>("");

  const [loadingExtract, setLoadingExtract] = useState(false);
  const [loadingScore, setLoadingScore] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setResumeFile(f);
    setLoadingExtract(true);
    setResult(null);
    try {
      let text = "";
      if (f.type === "text/plain") {
        text = await f.text();
      } else {
        text = await extractResumeTextViaAPI(f);
      }
      setResumeText(text);
      toast.success("Resume extracted");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to extract resume");
    } finally {
      setLoadingExtract(false);
    }
  }

  function pasteSampleJD() {
    setJdText(
      `We are hiring a Frontend Developer with expertise in Next.js, React, and TypeScript. 
      Experience with Tailwind CSS, shadcn UI, performance optimization, accessibility, and CI/CD is preferred. 
      Knowledge of Drizzle ORM, PostgreSQL/Neon, authentication (Clerk/OAuth), testing (Jest/Cypress), 
      and deploying to Vercel is a plus.`
    );
  }

  function clearAll() {
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setResumeText("");
    setJdText("");
    setResult(null);
  }

  /* ----------------------------- CHANGED ------------------------------ */
  /* Now calls your API: POST /api/ats/score with { resumeText, jdText }  */
  async function compute() {
    if (!resumeText.trim()) {
      toast.error("Please upload a resume (PDF/TXT) first.");
      return;
    }
    if (!jdText.trim()) {
      toast.error("Please paste a Job Description.");
      return;
    }
    setLoadingScore(true);
    try {
      const res = await fetch("/api/ats/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jdText,
          // optional knobs you might support on the API:
          // maxKeywords: 60,
          // weightHints: true,
        }),
      });

      if (!res.ok) {
        // Try to surface server's error payload
        let msg = "";
        try { msg = await res.text(); } catch {}
        throw new Error(msg || `Scoring failed (HTTP ${res.status})`);
      }

      const json: ScoreAPIResponse = await res.json();
      const payload: ScoreResult = (json as any).result ?? (json as ScoreResult);

      // Basic shape guard
      if (
        typeof payload?.score !== "number" ||
        !Array.isArray(payload?.matched) ||
        !Array.isArray(payload?.missing)
      ) {
        throw new Error("Invalid score payload");
      }

      setResult(payload);
      toast.success("ATS analysis ready");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to score");
    } finally {
      setLoadingScore(false);
    }
  }
  /* ------------------------------------------------------------------- */

  function downloadReport() {
    if (!result) return;
    const blob = new Blob(
      [JSON.stringify({ result, meta: { createdAt: new Date().toISOString() } }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ats-report.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  const signals = useMemo(() => (resumeText ? extractResumeSignals(resumeText) : null), [resumeText]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">ATS Analyzer</h1>
          <p className="text-sm text-muted-foreground">
            Upload your resume and paste a Job Description to see a keyword-match score and quick fixes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={clearAll}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
          <Button onClick={compute} disabled={loadingExtract || loadingScore}>
            {loadingScore ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Analyze
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      {/* FLEX layout */}
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Left: Inputs */}
        <div className="flex-1 min-w-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>1) Upload Resume</CardTitle>
              <CardDescription>PDF or text. We extract text for scoring.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFile}
                  disabled={loadingExtract}
                />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={loadingExtract}>
                  <FileUp className={`mr-2 h-4 w-4 ${loadingExtract ? "animate-pulse" : ""}`} />
                  {resumeFile ? "Change" : "Choose file"}
                </Button>
              </div>
              {loadingExtract && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Extracting text…
                </div>
              )}
              {!!resumeText && (
                <Tabs defaultValue="preview" className="w-full">
                  <TabsList>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="signals">Signals</TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview">
                    <div className="rounded-md border p-3 max-h-56 overflow-auto whitespace-pre-wrap text-sm">
                      {resumeText.slice(0, 3000) || "—"}
                    </div>
                  </TabsContent>
                  <TabsContent value="signals">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="rounded-md border p-3 text-sm">
                        <div className="flex items-center gap-2 font-medium"><Mail className="h-4 w-4" /> Email</div>
                        <div className="mt-1 text-muted-foreground">{signals?.email ?? "—"}</div>
                      </div>
                      <div className="rounded-md border p-3 text-sm">
                        <div className="flex items-center gap-2 font-medium"><Phone className="h-4 w-4" /> Phone</div>
                        <div className="mt-1 text-muted-foreground">{signals?.phone ?? "—"}</div>
                      </div>
                      <div className="rounded-md border p-3 text-sm sm:col-span-2">
                        <div className="flex items-center gap-2 font-medium"><Link2 className="h-4 w-4" /> Links</div>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {(signals?.links ?? []).length
                            ? signals!.links!.slice(0, 6).map((l) => <Badge key={l} variant="secondary">{l}</Badge>)
                            : <span className="text-muted-foreground text-xs">—</span>}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2) Job Description</CardTitle>
              <CardDescription>Paste the JD for the role you’re targeting.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                rows={10}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the JD here (skills, responsibilities, requirements)…"
              />
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={pasteSampleJD}>
                  <ClipboardPaste className="mr-2 h-4 w-4" />
                  Paste a sample JD
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Results */}
        <div className="w-full md:w-[420px] md:flex-none space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ATS Score</CardTitle>
              <CardDescription>Based on JD keyword coverage & resume hygiene.</CardDescription>
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="text-sm text-muted-foreground">
                  Run analysis to see your score.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-semibold">{result.score}</div>
                    <Badge variant={result.score >= 85 ? "default" : "secondary"}>
                      {result.score >= 85 ? "Excellent" : result.score >= 70 ? "Good" : "Needs work"}
                    </Badge>
                  </div>
                  <Progress value={result.score} />
                  <div className="text-xs text-muted-foreground">{result.summary}</div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={downloadReport} disabled={!result}>
                <Download className="mr-2 h-4 w-4" />
                Download report (JSON)
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Keywords</CardTitle>
              <CardDescription>Matched vs. missing from the JD.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {!result ? (
                <div className="text-sm text-muted-foreground">Run analysis to see keywords.</div>
              ) : (
                <>
                  <div>
                    <div className="mb-1 text-xs font-medium">Matched</div>
                    <div className="flex flex-wrap gap-1">
                      {result.matched.length
                        ? result.matched.map(k => <Badge key={`m-${k}`} variant="secondary">{k}</Badge>)
                        : <span className="text-xs text-muted-foreground">—</span>}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-medium">Missing</div>
                    <div className="flex flex-wrap gap-1">
                      {result.missing.length
                        ? result.missing.map(k => <Badge key={`x-${k}`} variant="outline" className="border-destructive/50 text-destructive">{k}</Badge>)
                        : <span className="text-xs text-muted-foreground">—</span>}
                    </div>
                  </div>
                  {!!result.extras.length && (
                    <div>
                      <div className="mb-1 text-xs font-medium">Extra skills in resume</div>
                      <div className="flex flex-wrap gap-1">
                        {result.extras.map(k => <Badge key={`e-${k}`} variant="outline">{k}</Badge>)}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Issues</CardTitle>
              <CardDescription>Fix these to improve ATS pass rates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {!result ? (
                <div className="text-sm text-muted-foreground">Nothing to show yet.</div>
              ) : result.issues.length ? (
                <ul className="list-disc pl-5 text-sm">
                  {result.issues.map((i) => <li key={i}>{i}</li>)}
                </ul>
              ) : (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <ShieldCheck className="h-4 w-4" />
                  Looks good — no major issues detected.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
