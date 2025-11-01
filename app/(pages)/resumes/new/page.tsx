// app/resumes/new/page.tsx
//@ts-nocheck
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  FileText,
  Save,
  Check,
  UploadCloud,
  Sparkles,
  Loader2, // spinner
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";

// -------------------- Validation --------------------
const NewResumeSchema = z.object({
  title: z.string().min(2, "Give your resume a title"),
  role: z.string().min(2, "What role is this resume for?"),
  template: z.string().min(1, "Pick a template"),
  summary: z.string().max(800, "Keep summary under 800 chars").optional(),
  skills: z.string().optional(), // comma/newline separated; we’ll parse it
  jobDescription: z.string().optional(),
  isPublic: z.boolean().default(false),
});

type NewResumeValues = z.infer<typeof NewResumeSchema>;

// Utility to parse skills string -> array
function parseSkills(s?: string): string[] {
  if (!s) return [];
  return s
    .split(/[,\n]/g)
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 20);
}

async function readError(res: Response) {
  try {
    const j = await res.json();
    return j?.error || j?.message || res.statusText;
  } catch {
    try {
      return await res.text();
    } catch {
      return "Something went wrong";
    }
  }
}

export default function NewResumePage() {
  const router = useRouter();
  const [uploadName, setUploadName] = React.useState<string>("");
  const [pdfFile, setPdfFile] = React.useState<File | null>(null);

  const form = useForm<NewResumeValues>({
    //@ts-ignore
    resolver: zodResolver(NewResumeSchema),
    defaultValues: {
      title: "",
      role: "",
      template: "clean",
      summary: "",
      skills: "",
      jobDescription: "",
      isPublic: false,
    },
    mode: "onTouched",
  });

  const watchAll = form.watch();
  const skills = parseSkills(watchAll.skills);

  // naive completeness for preview progress
  const completeness =
    [
      watchAll.title ? 20 : 0,
      watchAll.role ? 15 : 0,
      watchAll.summary ? 25 : 0,
      skills.length ? 20 : 0,
      watchAll.jobDescription ? 20 : 0,
    ].reduce((a, b) => a + b, 0) || 5;

  async function onSubmit(values: NewResumeValues) {
    const payload = {
      title: values.title.trim(),
      role: values.role.trim(),
      template: values.template,
      summary: values.summary?.trim() || undefined,
      skills: parseSkills(values.skills),
      jobDescription: values.jobDescription?.trim() || undefined,
      isPublic: !!values.isPublic,
    };

    const doRequest = async () => {
      let res: Response;

      if (pdfFile) {
        // multipart: send JSON payload in a Blob + the PDF file
        const fd = new FormData();
        fd.append(
          "payload",
          new Blob([JSON.stringify(payload)], { type: "application/json" })
        );
        fd.append("jobDescriptionPdf", pdfFile, pdfFile.name);

        res = await fetch("/api/resumes", {
          method: "POST",
          body: fd,
          credentials: "include",
        });
      } else {
        // simple JSON
        res = await fetch("/api/resumes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      }

      if (res.status === 401) {
        toast.error("Please log in to create a resume.");
        router.push("/login?next=/resumes/new");
        return;
      }

      if (!res.ok) {
        throw new Error(await readError(res));
      }

      const j = await res.json().catch(() => ({}));
      const newId = j?.id as string | undefined;

      // Redirect to the new resume or list
      router.push(newId ? `/resumes/${newId}` : "/dashboard/resumes");
    };

    await toast.promise(doRequest(), {
      loading: "Creating resume…",
      success: "Resume created!",
      error: (e) => String(e?.message ?? "Failed to create resume"),
    });
  }

  function onSaveDraft() {
    // Optional: save to localStorage or call /api/resumes/drafts
    const draft = form.getValues();
    localStorage.setItem("resumint:new-draft", JSON.stringify(draft));
    toast("Draft saved locally", { icon: "💾" });
  }

  const isSubmitting = form.formState.isSubmitting;
  const canSubmit =
    !isSubmitting && form.formState.isDirty && form.formState.isValid;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" aria-label="Back">
            <Link href="/dashboard/resumes">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">New Resume</h1>
            <p className="text-sm text-muted-foreground">
              Create a resume optimized for Applicant Tracking Systems (ATS).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onSaveDraft} disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            Save draft
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={!canSubmit}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Create
          </Button>
        </div>
      </div>

      <Separator />

      {/* Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Left: Form (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic details */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Basic details</CardTitle>
              <CardDescription>
                Title, target role and template selection.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Resume title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Frontend Developer — Jane Doe"
                  {...form.register("title")}
                  aria-invalid={!!form.formState.errors.title}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="role">Target role</Label>
                  <Input
                    id="role"
                    placeholder="e.g., Frontend Developer"
                    {...form.register("role")}
                    aria-invalid={!!form.formState.errors.role}
                  />
                  {form.formState.errors.role && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.role.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label>Template</Label>
                  <Select
                    value={form.watch("template")}
                    onValueChange={(val) =>
                      form.setValue("template", val, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clean">Clean</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="elegant">Elegant</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.template && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.template.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary & Skills */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Profile & skills</CardTitle>
              <CardDescription>
                A concise summary and keywords that highlight your strengths.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="summary">Professional summary</Label>
                <Textarea
                  id="summary"
                  rows={5}
                  placeholder="2–4 lines about your experience and impact."
                  {...form.register("summary")}
                />
                {form.formState.errors.summary && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.summary.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="skills">Skills (comma/new-line separated)</Label>
                <Textarea
                  id="skills"
                  rows={3}
                  placeholder="React, TypeScript, Tailwind, Next.js, Testing Library..."
                  {...form.register("skills")}
                />
                <p className="text-xs text-muted-foreground">
                  We’ll parse these into tags automatically.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Job Description (for ATS matching) */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Job description (optional)</CardTitle>
              <CardDescription>
                Paste a JD for better ATS alignment & suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="jd">Paste JD</Label>
                <Textarea
                  id="jd"
                  rows={6}
                  placeholder="Paste the role’s responsibilities & requirements…"
                  {...form.register("jobDescription")}
                />
              </div>

              <div className="grid gap-2">
                <Label>Import JD from PDF (optional)</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setPdfFile(file);
                      setUploadName(file ? file.name : "");
                    }}
                    disabled={isSubmitting}
                  />
                  {uploadName ? (
                    <Badge variant="secondary" className="gap-1">
                      <UploadCloud className="h-3.5 w-3.5" />
                      {uploadName}
                    </Badge>
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground">
                  If attached, the PDF is uploaded and parsed server-side.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Visibility */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Visibility</CardTitle>
              <CardDescription>Choose who can see this resume.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Public profile</p>
                <p className="text-xs text-muted-foreground">
                  If enabled, a shareable link will be available.
                </p>
              </div>
              <Switch
                checked={!!form.watch("isPublic")}
                onCheckedChange={(v: boolean) =>
                  form.setValue("isPublic", v, { shouldDirty: true })
                }
                disabled={isSubmitting}
              />
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="outline" onClick={onSaveDraft} disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                Save draft
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)} disabled={!canSubmit}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Create
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right: Live Preview */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6 space-y-4">
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Preview
                </CardTitle>
                <CardDescription>This is a lightweight preview.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="line-clamp-2 text-lg font-semibold">
                      {watchAll.title || "Untitled resume"}
                    </h3>
                    <Badge variant="secondary">{watchAll.template || "clean"}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {watchAll.role || "Target role"}
                  </p>

                  <Separator className="my-3" />

                  <p className="text-sm">
                    {watchAll.summary?.trim() ||
                      "Add a short, impact-focused professional summary here…"}
                  </p>

                  {!!skills.length && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {skills.map((s) => (
                        <Badge key={s} variant="outline">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Completeness</span>
                      <span>{completeness}%</span>
                    </div>
                    <Progress value={completeness} />
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
                  <Sparkles className="mr-2 inline h-3.5 w-3.5" />
                  ATS pro tip: match keywords from the JD in your Skills and
                  Summary sections to improve your score.
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle>Next steps</CardTitle>
                <CardDescription>After creating your resume</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <p>• Add experience, projects, and achievements.</p>
                <p>• Tailor keywords to each job.</p>
                <p>• Export as PDF or share the public link.</p>
              </CardContent>
              <CardFooter className="justify-end">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/dashboard/resumes">Back to list</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
