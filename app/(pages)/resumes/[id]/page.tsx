// app/resumes/[id]/page.tsx
// @ts-nocheck
"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import {
  ArrowLeft, Plus, Pencil, Trash2, Save, Loader2, GraduationCap,
  Building2, Link2, Calendar, MoveUp, MoveDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";

/* ---------- Types that align with your schema ---------- */
type Experience = {
  id: string;
  company: string;
  title: string;
  location?: string | null;
  startDate: string; // "YYYY-MM-DD"
  endDate?: string | null; // "YYYY-MM-DD" | null
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
  // NEW:
  gradeType?: "percentage" | "cgpa10" | "cgpa4" | "gpa" | "letter" | null;
  gradeValue?: string | null;
};

type LinkRow = {
  id: string;
  label: string;
  url: string;
  order: number;
};

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

/* ---------- Helpers ---------- */
async function readError(res: Response) {
  try {
    const j = await res.json();
    return j?.error || j?.message || res.statusText;
  } catch {
    try { return await res.text(); } catch { return "Something went wrong"; }
  }
}

function linesToArray(s: string | undefined) {
  if (!s) return [];
  return s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function arrayToLines(a: string[] | null | undefined) {
  return (a ?? []).join("\n");
}

const uuidSchema = z.string().uuid();

// Pretty print grade in list rows
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

/* ---------- Zod forms ---------- */
const ExpSchema = z.object({
  company: z.string().min(2),
  title: z.string().min(2),
  location: z.string().optional(),
  startDate: z.string().min(4), // YYYY-MM-DD
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().default(false),
  bulletsText: z.string().optional(), // UI only
});
type ExpValues = z.infer<typeof ExpSchema>;

// ✅ Include gradeType & gradeValue in schema
const EduSchema = z.object({
  school: z.string().min(2),
  degree: z.string().min(2),
  field: z.string().optional(),
  location: z.string().optional(),
  startYear: z.string().optional(),
  endYear: z.string().optional(),
  achievementsText: z.string().optional(),
  gradeType: z.enum(["percentage", "cgpa10", "cgpa4", "gpa", "letter"])
    .or(z.literal("")).optional(),
  gradeValue: z.string().max(20).optional(),
});
type EduValues = z.infer<typeof EduSchema>;

const LinkSchema = z.object({
  label: z.string().min(2),
  url: z.string().url("Enter a valid URL"),
  order: z.coerce.number().int().min(0).default(0),
});
type LinkValues = z.infer<typeof LinkSchema>;

/* ---------- Page ---------- */
export default function ResumeEditorPage() {
  const params = useParams();
  const router = useRouter();

  // robust extraction: id can be string | string[]
  const id = React.useMemo(() => {
    const raw = (params?.id ?? "") as string | string[];
    const s = Array.isArray(raw) ? raw[0] : raw;
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  }, [params]);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [resume, setResume] = React.useState<Resume | null>(null);

  const load = React.useCallback(async () => {
    // guard invalid/missing id to avoid spurious 400s
    const idOk = uuidSchema.safeParse(id);
    if (!idOk.success) {
      setError("Invalid resume id");
      setLoading(false);
      return;
    }

    const ac = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/resumes/${idOk.data}`, {
        credentials: "include",
        cache: "no-store",
        signal: ac.signal,
      });

      if (res.status === 401) {
        toast.error("Please log in.");
        router.push(`/login?next=/resumes/${idOk.data}`);
        return;
      }

      if (!res.ok) throw new Error(await readError(res));

      const j = await res.json();

      // Normalize: some APIs return {resume}, some may include related arrays separately.
      const r = j?.resume ?? j ?? {};
      const normalized: Resume = {
        id: r.id,
        title: r.title ?? "",
        role: r.role ?? "",
        template: r.template ?? "clean",
        summary: r.summary ?? null,
        skills: r.skills ?? [],
        jobDescription: r.jobDescription ?? null,
        isPublic: !!r.isPublic,
        atsScore: typeof r.atsScore === "number" ? r.atsScore : 0,
        experiences: j.experiences ?? r.experiences ?? [],
        educations: j.educations ?? r.educations ?? [],
        links: j.links ?? r.links ?? [],
      };

      setResume(normalized);
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        setError(e?.message ?? "Failed to load resume");
      }
    } finally {
      setLoading(false);
    }

    return () => ac.abort();
  }, [id, router]);

  React.useEffect(() => { load(); }, [load]);

  /* ----- Experience CRUD ----- */
  function ExperienceSection() {
    const [open, setOpen] = React.useState(false);
    const [editId, setEditId] = React.useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);

    const editing = resume?.experiences.find((x) => x.id === editId) || null;

    const form = useForm<ExpValues>({
      resolver: zodResolver(ExpSchema),
      defaultValues: {
        company: editing?.company ?? "",
        title: editing?.title ?? "",
        location: editing?.location ?? "",
        startDate: editing?.startDate ?? "",
        endDate: editing?.endDate ?? "",
        isCurrent: editing?.isCurrent ?? false,
        bulletsText: arrayToLines(editing?.bullets),
      },
    });

    // ensure fresh values populate when selecting a different row to edit
    React.useEffect(() => {
      if (!open) return;
      if (editing) {
        form.reset({
          company: editing.company,
          title: editing.title,
          location: editing.location ?? "",
          startDate: editing.startDate,
          endDate: editing.endDate ?? "",
          isCurrent: editing.isCurrent,
          bulletsText: arrayToLines(editing.bullets),
        });
      } else {
        form.reset({
          company: "",
          title: "",
          location: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          bulletsText: "",
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editing?.id, open]);

    function onOpenAdd() {
      setEditId(null);
      setOpen(true);
    }

    function onOpenEdit(id: string) {
      setEditId(id);
      setOpen(true);
    }

    async function onSubmit(v: ExpValues) {
      const payload = {
        company: v.company.trim(),
        title: v.title.trim(),
        location: v.location?.trim() || undefined,
        startDate: v.startDate,
        endDate: v.isCurrent ? null : v.endDate || null,
        isCurrent: v.isCurrent,
        bullets: linesToArray(v.bulletsText),
      };

      const url = editId
        ? `/api/resumes/${resume!.id}/experience/${editId}`
        : `/api/resumes/${resume!.id}/experience`;
      const method = editId ? "PATCH" : "POST";

      await toast.promise(
        (async () => {
          const r = await fetch(url, {
            method,
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!r.ok) throw new Error(await readError(r));
          await load();
          setOpen(false);
        })(),
        { loading: editId ? "Updating…" : "Adding…", success: "Saved!", error: (e) => String(e?.message ?? "Failed") }
      );
    }

    async function onConfirmDelete(id: string) {
      setConfirmDeleteId(null);
      await toast.promise(
        (async () => {
          const r = await fetch(`/api/resumes/${resume!.id}/experience/${id}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (!r.ok) throw new Error(await readError(r));
          await load();
        })(),
        { loading: "Deleting…", success: "Deleted", error: (e) => String(e?.message ?? "Failed") }
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" /> Experience
          </CardTitle>
          <CardDescription>Add your work history and impact bullets.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!resume?.experiences?.length && (
            <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              No experience yet. Click “Add Experience”.
            </div>
          )}

          {resume?.experiences?.map((e) => (
            <div key={e.id} className="rounded-md border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium">{e.title} • {e.company}</p>
                  <p className="text-xs text-muted-foreground">
                    <Calendar className="mr-1 inline h-3.5 w-3.5" />
                    {e.startDate} — {e.isCurrent ? "Present" : (e.endDate || "—")}
                    {e.location ? ` • ${e.location}` : ""}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => onOpenEdit(e.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setConfirmDeleteId(e.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {!!e.bullets?.length && (
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={onOpenAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Experience
          </Button>
        </CardFooter>

        {/* Add/Edit Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "Edit experience" : "Add experience"}</DialogTitle>
              <DialogDescription>Company, title, dates, and impact bullets.</DialogDescription>
            </DialogHeader>

            <form
              id="exp-form"
              onSubmit={(e) => { e.preventDefault(); }}
              className="grid gap-3"
            >
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-1">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" {...form.register("company")} />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" {...form.register("title")} />
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-3">
                <div className="grid gap-1">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" {...form.register("location")} />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="startDate">Start date</Label>
                  <Input id="startDate" type="date" {...form.register("startDate")} />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="endDate">End date</Label>
                  <Input id="endDate" type="date" {...form.register("endDate")} disabled={form.watch("isCurrent")} />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="text-sm font-medium">Currently working here</p>
                  <p className="text-xs text-muted-foreground">Disables the end date.</p>
                </div>
                <Switch
                  checked={!!form.watch("isCurrent")}
                  onCheckedChange={(v) => form.setValue("isCurrent", v, { shouldDirty: true })}
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="bullets">Achievements (one per line)</Label>
                <Textarea id="bullets" rows={5} {...form.register("bulletsText")} />
              </div>
            </form>

            <DialogFooter className="gap-2 sm:justify-end">
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={form.handleSubmit(onSubmit)}>
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete confirm */}
        <AlertDialog open={!!confirmDeleteId} onOpenChange={(v) => !v && setConfirmDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this experience?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end gap-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => onConfirmDelete(confirmDeleteId!)}>
                Delete
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    );
  }

  /* ----- Education CRUD ----- */
  function EducationSection() {
    const [open, setOpen] = React.useState(false);
    const [editId, setEditId] = React.useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);

    const editing = resume?.educations.find((x) => x.id === editId) || null;

    const form = useForm<EduValues>({
      resolver: zodResolver(EduSchema),
      defaultValues: {
        school: editing?.school ?? "",
        degree: editing?.degree ?? "",
        field: editing?.field ?? "",
        location: editing?.location ?? "",
        startYear: editing?.startYear ? String(editing.startYear) : "",
        endYear: editing?.endYear ? String(editing.endYear) : "",
        achievementsText: arrayToLines(editing?.achievements),
        gradeType: editing?.gradeType ?? "",
        gradeValue: editing?.gradeValue ?? "",
      },
    });

    React.useEffect(() => {
      if (!open) return;
      if (editing) {
        form.reset({
          school: editing.school,
          degree: editing.degree,
          field: editing.field ?? "",
          location: editing.location ?? "",
          startYear: editing.startYear ? String(editing.startYear) : "",
          endYear: editing.endYear ? String(editing.endYear) : "",
          achievementsText: arrayToLines(editing.achievements),
          gradeType: editing.gradeType ?? "",
          gradeValue: editing.gradeValue ?? "",
        });
      } else {
        form.reset({
          school: "",
          degree: "",
          field: "",
          location: "",
          startYear: "",
          endYear: "",
          achievementsText: "",
          gradeType: "",
          gradeValue: "",
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editing?.id, open]);

    // ✅ Fix: watch the gradeType so we can use it in placeholder
    const gradeType = form.watch("gradeType");

    function onOpenAdd() {
      setEditId(null);
      setOpen(true);
    }

    function onOpenEdit(id: string) {
      setEditId(id);
      setOpen(true);
    }

    async function onSubmit(v: EduValues) {
      const payload = {
        school: v.school.trim(),
        degree: v.degree.trim(),
        field: v.field?.trim() || undefined,
        location: v.location?.trim() || undefined,
        startYear: v.startYear ? Number(v.startYear) : null,
        endYear: v.endYear ? Number(v.endYear) : null,
        achievements: linesToArray(v.achievementsText),
        gradeType: v.gradeType ? (v.gradeType as Education["gradeType"]) : null,
        gradeValue: v.gradeValue?.trim() ? v.gradeValue.trim() : null,
      };

      const url = editId
        ? `/api/resumes/${resume!.id}/education/${editId}`
        : `/api/resumes/${resume!.id}/education`;
      const method = editId ? "PATCH" : "POST";

      await toast.promise(
        (async () => {
          const r = await fetch(url, {
            method,
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!r.ok) throw new Error(await readError(r));
          await load();
          setOpen(false);
        })(),
        { loading: editId ? "Updating…" : "Adding…", success: "Saved!", error: (e) => String(e?.message ?? "Failed") }
      );
    }

    async function onConfirmDelete(id: string) {
      setConfirmDeleteId(null);
      await toast.promise(
        (async () => {
          const r = await fetch(`/api/resumes/${resume!.id}/education/${id}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (!r.ok) throw new Error(await readError(r));
          await load();
        })(),
        { loading: "Deleting…", success: "Deleted", error: (e) => String(e?.message ?? "Failed") }
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" /> Education
          </CardTitle>
          <CardDescription>Your academic background and achievements.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!resume?.educations?.length && (
            <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              No education yet. Click “Add Education”.
            </div>
          )}

          {resume?.educations?.map((e) => (
            <div key={e.id} className="rounded-md border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium">{e.degree} • {e.school}</p>
                  <p className="text-xs text-muted-foreground">
                    {(e.startYear ?? "—")} — {(e.endYear ?? "—")}
                    {e.field ? ` • ${e.field}` : ""}
                    {e.location ? ` • ${e.location}` : ""}
                    {formatGrade(e.gradeType, e.gradeValue) ? ` • Grade: ${formatGrade(e.gradeType, e.gradeValue)}` : ""}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => onOpenEdit(e.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setConfirmDeleteId(e.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {!!e.achievements?.length && (
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {e.achievements.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={onOpenAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Education
          </Button>
        </CardFooter>

        {/* Add/Edit Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "Edit education" : "Add education"}</DialogTitle>
              <DialogDescription>School, degree, years, achievements, and grade.</DialogDescription>
            </DialogHeader>

            <form id="edu-form" onSubmit={(e) => e.preventDefault()} className="grid gap-3">
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-1">
                  <Label htmlFor="school">School/Institute</Label>
                  <Input id="school" {...form.register("school")} />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="degree">Board/Degree</Label>
                  <Input id="degree" {...form.register("degree")} />
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-1">
                  <Label htmlFor="field">Subjects/Field</Label>
                  <Input id="field" {...form.register("field")} />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" {...form.register("location")} />
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-1">
                  <Label htmlFor="startYear">Start year</Label>
                  <Input id="startYear" type="number" {...form.register("startYear")} />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="endYear">End year</Label>
                  <Input id="endYear" type="number" {...form.register("endYear")} />
                </div>
              </div>

              {/* NEW: Grade */}
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-1">
                  <Label htmlFor="gradeType">Grade type</Label>
                  <select
                    id="gradeType"
                    className="h-10 w-full rounded-md border bg-transparent px-3 text-sm"
                    {...form.register("gradeType")}
                  >
                    <option value="">Select…</option>
                    <option value="percentage">Percentage</option>
                    <option value="cgpa10">CGPA (out of 10)</option>
                    <option value="cgpa4">CGPA (out of 4)</option>
                    <option value="gpa">GPA</option>
                    <option value="letter">Letter (A, A+, etc.)</option>
                  </select>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="gradeValue">Grade value</Label>
                  <Input
                    id="gradeValue"
                    placeholder={
                      gradeType === "percentage" ? "e.g., 82"
                        : gradeType === "cgpa10" ? "e.g., 8.2"
                        : gradeType === "cgpa4" ? "e.g., 3.6"
                        : gradeType === "gpa" ? "e.g., 3.7"
                        : gradeType === "letter" ? "e.g., A+"
                        : "—"
                    }
                    disabled={!gradeType}
                    {...form.register("gradeValue")}
                  />
                  <p className="text-xs text-muted-foreground">
                    {gradeType === "percentage" && "Enter just the number; % will be added automatically."}
                    {gradeType === "cgpa10" && "Max 10; decimals allowed (e.g., 8.23)."}
                    {gradeType === "cgpa4" && "Max 4; decimals allowed (e.g., 3.45)."}
                    {gradeType === "gpa" && "Typical scale is 0–4; enter the number (e.g., 3.7)."}
                    {gradeType === "letter" && "Enter a letter grade (e.g., A, A+, B+)."}
                  </p>
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="achievements">Achievements (one per line)</Label>
                <Textarea id="achievements" rows={5} {...form.register("achievementsText")} />
              </div>
            </form>

            <DialogFooter className="gap-2 sm:justify-end">
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={form.handleSubmit(onSubmit)}>
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete confirm */}
        <AlertDialog open={!!confirmDeleteId} onOpenChange={(v) => !v && setConfirmDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this education?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end gap-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => onConfirmDelete(confirmDeleteId!)}>
                Delete
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    );
  }

  /* ----- Links CRUD ----- */
  function LinksSection() {
    const [open, setOpen] = React.useState(false);
    const [editId, setEditId] = React.useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);

    const editing = resume?.links.find((x) => x.id === editId) || null;

    const form = useForm<LinkValues>({
      resolver: zodResolver(LinkSchema),
      defaultValues: {
        label: editing?.label ?? "",
        url: editing?.url ?? "",
        order: editing?.order ?? 0,
      },
    });

    React.useEffect(() => {
      if (!open) return;
      if (editing) {
        form.reset({ label: editing.label, url: editing.url, order: editing.order });
      } else {
        form.reset({ label: "", url: "", order: (resume?.links?.length ?? 0) });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editing?.id, open]);

    function onOpenAdd() {
      setEditId(null);
      setOpen(true);
    }

    function onOpenEdit(id: string) {
      setEditId(id);
      setOpen(true);
    }

    async function onSubmit(v: LinkValues) {
      const payload = {
        label: v.label.trim(),
        url: v.url.trim(),
        order: Number(v.order) || 0,
      };

      const url = editId
        ? `/api/resumes/${resume!.id}/link/${editId}`
        : `/api/resumes/${resume!.id}/link`;
      const method = editId ? "PATCH" : "POST";

      await toast.promise(
        (async () => {
          const r = await fetch(url, {
            method,
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!r.ok) throw new Error(await readError(r));
          await load();
          setOpen(false);
        })(),
        { loading: editId ? "Updating…" : "Adding…", success: "Saved!", error: (e) => String(e?.message ?? "Failed") }
      );
    }

    async function onConfirmDelete(id: string) {
      setConfirmDeleteId(null);
      await toast.promise(
        (async () => {
          const r = await fetch(`/api/resumes/${resume!.id}/link/${id}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (!r.ok) throw new Error(await readError(r));
          await load();
        })(),
        { loading: "Deleting…", success: "Deleted", error: (e) => String(e?.message ?? "Failed") }
      );
    }

    // simple up/down reorder
    async function bumpOrder(rowId: string, dir: "up" | "down") {
      const items = [...(resume?.links ?? [])].sort((a, b) => a.order - b.order);
      const idx = items.findIndex((x) => x.id === rowId);
      const swapIdx = dir === "up" ? idx - 1 : idx + 1;
      if (idx < 0 || swapIdx < 0 || swapIdx >= items.length) return;

      const a = items[idx], b = items[swapIdx];
      await toast.promise(
        (async () => {
          const update = async (row: LinkRow, newOrder: number) => {
            const r = await fetch(`/api/resumes/${resume!.id}/link/${row.id}`, {
              method: "PATCH",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ order: newOrder }),
            });
            if (!r.ok) throw new Error(await readError(r));
          };
          await update(a, b.order);
          await update(b, a.order);
          await load();
        })(),
        { loading: "Reordering…", success: "Reordered", error: (e) => String(e?.message ?? "Failed") }
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" /> Links
          </CardTitle>
          <CardDescription>Portfolio, GitHub, LinkedIn, website, etc.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!resume?.links?.length && (
            <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              No links yet. Click “Add Link”.
            </div>
          )}

          {resume?.links
            ?.sort((a, b) => a.order - b.order)
            .map((l, i, arr) => (
              <div key={l.id} className="rounded-md border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium">{l.label}</p>
                    <p className="text-xs text-muted-foreground break-all">{l.url}</p>
                    <div className="mt-1">
                      <Badge variant="secondary">Order: {l.order}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" disabled={i === 0} onClick={() => bumpOrder(l.id, "up")} aria-label="Move up">
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" disabled={i === arr.length - 1} onClick={() => bumpOrder(l.id, "down")} aria-label="Move down">
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onOpenEdit(l.id)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setConfirmDeleteId(l.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={onOpenAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Link
          </Button>
        </CardFooter>

        {/* Add/Edit Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "Edit link" : "Add link"}</DialogTitle>
              <DialogDescription>Provide a label and a valid URL.</DialogDescription>
            </DialogHeader>

            <form id="link-form" onSubmit={(e) => e.preventDefault()} className="grid gap-3">
              <div className="grid gap-1">
                <Label htmlFor="label">Label</Label>
                <Input id="label" {...form.register("label")} />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="url">URL</Label>
                <Input id="url" type="url" placeholder="https://…" {...form.register("url")} />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="order">Order</Label>
                <Input id="order" type="number" {...form.register("order", { valueAsNumber: true })} />
              </div>
            </form>

            <DialogFooter className="gap-2 sm:justify-end">
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={form.handleSubmit(onSubmit)}>
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete confirm */}
        <AlertDialog open={!!confirmDeleteId} onOpenChange={(v) => !v && setConfirmDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this link?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end gap-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => onConfirmDelete(confirmDeleteId!)}>
                Delete
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" aria-label="Back">
            <Link href="/dashboard/resumes"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">Loading…</h1>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2"><CardContent className="py-10 flex items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></CardContent></Card>
          <Card><CardContent className="py-10 flex items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></CardContent></Card>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-4 flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" aria-label="Back">
            <Link href="/dashboard/resumes"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">Resume</h1>
        </div>
        <Card className="border-destructive/40">
          <CardHeader><CardTitle>Failed to load</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">{error ?? "Not found"}</CardContent>
          <CardFooter className="justify-end">
            <Button onClick={load} variant="outline">Retry</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Button asChild variant="ghost" size="icon" aria-label="Back">
            <Link href="/dashboard/resumes">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight">{resume.title}</h1>
            <p className="text-sm text-muted-foreground">
              {resume.role} • <Badge variant="secondary" className="align-middle">{resume.template}</Badge>
              {resume.isPublic && <Badge className="ml-2">Public</Badge>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={resume.atsScore >= 85 ? "default" : "secondary"}>ATS {resume.atsScore}</Badge>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <ExperienceSection />
          <EducationSection />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <LinksSection />
          <Card>
            <CardHeader>
              <CardTitle>Summary & Skills</CardTitle>
              <CardDescription>Read-only preview from the main resume.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <Label>Summary</Label>
                <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{resume.summary || "—"}</p>
              </div>
              <div>
                <Label>Skills</Label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {(resume.skills ?? []).length
                    ? resume.skills!.map((s, i) => <Badge key={`${s}-${i}`} variant="outline">{s}</Badge>)
                    : <span className="text-muted-foreground">—</span>}
                </div>
              </div>
              <div>
                <Label>Job Description</Label>
                <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                  {resume.jobDescription || "—"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
