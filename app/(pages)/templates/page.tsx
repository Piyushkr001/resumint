// app/template/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Search, Eye, Sparkles, CheckCircle2, Wand2, Star,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types & Data                                                        */
/* ------------------------------------------------------------------ */

type TemplateId = "clean" | "modern" | "minimal" | "elegant";

type TemplateInfo = {
  id: TemplateId;
  name: string;
  tagline: string;
  badges: string[]; // e.g. ["ATS-friendly", "1-page"]
  bestFor: string[];
  highlights: string[];
  popularity: number; // 1..100
};

const TEMPLATES: TemplateInfo[] = [
  {
    id: "clean",
    name: "Clean",
    tagline: "Crisp, readable, and ATS-safe.",
    badges: ["ATS-friendly", "1-page"],
    bestFor: ["Product", "Frontend", "General"],
    highlights: ["Strong typographic hierarchy", "Simple sections", "Great for juniors/switchers"],
    popularity: 92,
  },
  {
    id: "modern",
    name: "Modern",
    tagline: "Contemporary with subtle accents.",
    badges: ["ATS-friendly", "2-column"],
    bestFor: ["Design-leaning", "Frontend", "Full-stack"],
    highlights: ["Subtle accent color", "Compact header", "Dense content layout"],
    popularity: 88,
  },
  {
    id: "minimal",
    name: "Minimal",
    tagline: "Ultra-simple, no distractions.",
    badges: ["ATS-friendly", "1-page"],
    bestFor: ["Research", "Backend", "Data/ML"],
    highlights: ["Spacious margins", "Few lines & rules", "Laser focus on content"],
    popularity: 81,
  },
  {
    id: "elegant",
    name: "Elegant",
    tagline: "Polished with refined details.",
    badges: ["ATS-friendly", "2-column"],
    bestFor: ["Leadership", "Senior ICs", "Client-facing"],
    highlights: ["Accented headings", "Subtle dividers", "Excellent readability"],
    popularity: 86,
  },
];

/* ------------------------------------------------------------------ */
/* Little Resume Preview (mock content just for visual feel)          */
/* ------------------------------------------------------------------ */

function TemplatePreview({ variant }: { variant: TemplateId }) {
  const accent =
    variant === "clean" ? "bg-neutral-900"
    : variant === "modern" ? "bg-blue-600"
    : variant === "minimal" ? "bg-neutral-800"
    : "bg-purple-700";

  const border =
    variant === "modern" || variant === "elegant" ? "border border-border" : "border border-transparent";

  const headerAccent = variant === "modern" || variant === "elegant";

  return (
    <div className={`w-full rounded-lg ${border} bg-white dark:bg-neutral-950 p-5`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xl font-semibold leading-tight truncate">Piyush Kumar</div>
          <div className="text-xs text-muted-foreground">Frontend Developer</div>
        </div>
        {headerAccent && <div className={`h-6 w-6 rounded-sm ${accent}`} aria-hidden />}
      </div>

      <Separator className="my-4" />

      {/* Body (2-col feel using flex) */}
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Left column */}
        <div className="flex-1 space-y-3">
          <section>
            <div className="mb-1 text-sm font-medium">Experience</div>
            <div className="space-y-2">
              {[0, 1].map((i) => (
                <div key={i} className="rounded-md border border-dashed p-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Frontend Engineer • Acme</div>
                    <div className="text-[10px] text-muted-foreground">2024 — Present</div>
                  </div>
                  <ul className="mt-1 list-disc pl-4 text-[11px] text-muted-foreground">
                    <li>Built accessible UI with Next.js + Shadcn.</li>
                    <li>Improved TTI by ~30% via code-splitting.</li>
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-1 text-sm font-medium">Education</div>
            <div className="rounded-md border border-dashed p-2">
              <div className="text-sm font-medium">B.Tech • BIT Mesra</div>
              <div className="text-[11px] text-muted-foreground">2019 — 2023 • Grade: 8.2 / 10</div>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="w-full md:w-64 md:flex-none space-y-3">
          <section>
            <div className="mb-1 text-sm font-medium">Summary</div>
            <p className="text-[11px] text-muted-foreground">
              Frontend dev focused on Next.js, TypeScript, and design-systems. Loves performance,
              accessibility, and crisp UI.
            </p>
          </section>
          <section>
            <div className="mb-1 text-sm font-medium">Skills</div>
            <div className="flex flex-wrap gap-1">
              {["Next.js", "TypeScript", "Shadcn", "Tailwind", "Drizzle"].map((s) => (
                <span key={s} className="rounded border px-2 py-0.5 text-[10px] text-muted-foreground">
                  {s}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

function TemplateCard({ t, onUse }: { t: TemplateInfo; onUse: (id: TemplateId) => void }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{t.name}</CardTitle>
            <CardDescription className="mt-1">{t.tagline}</CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0">
            <Star className="mr-1 h-3 w-3" />
            {t.popularity}
          </Badge>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {t.badges.map((b) => (
            <Badge key={b} variant="outline" className="text-[11px]">{b}</Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <div className="rounded-lg border bg-background p-2">
          <TemplatePreview variant={t.id} />
        </div>

        <div className="space-y-1 text-sm">
          <div className="text-xs text-muted-foreground">Best for</div>
          <div className="flex flex-wrap gap-1">
            {t.bestFor.map((b) => (
              <Badge key={b} variant="secondary">{b}</Badge>
            ))}
          </div>
        </div>

        <div className="space-y-1 text-sm">
          <div className="text-xs text-muted-foreground">Highlights</div>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            {t.highlights.map((h) => <li key={h}>{h}</li>)}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{t.name} Template Preview</DialogTitle>
              <DialogDescription>{t.tagline}</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] rounded-md border p-3">
              <TemplatePreview variant={t.id} />
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <Button size="sm" onClick={() => onUse(t.id)}>
          <Wand2 className="mr-2 h-4 w-4" />
          Use template
        </Button>
      </CardFooter>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function TemplateGalleryPage() {
  const router = useRouter();

  const [q, setQ] = React.useState("");
  const [category, setCategory] = React.useState<"all" | "ats" | "onepage" | "twocol">("all");
  const [sort, setSort] = React.useState<"popular" | "az" | "za">("popular");

  const filtered = React.useMemo(() => {
    let list = TEMPLATES.filter((t) => {
      const matchesQ =
        !q.trim() ||
        t.name.toLowerCase().includes(q.toLowerCase()) ||
        t.tagline.toLowerCase().includes(q.toLowerCase()) ||
        t.badges.some((b) => b.toLowerCase().includes(q.toLowerCase()));
      if (!matchesQ) return false;

      if (category === "ats") {
        return t.badges.map((b) => b.toLowerCase()).includes("ats-friendly");
      }
      if (category === "onepage") {
        return t.badges.map((b) => b.toLowerCase()).includes("1-page");
      }
      if (category === "twocol") {
        return t.badges.map((b) => b.toLowerCase()).includes("2-column");
      }
      return true;
    });

    if (sort === "popular") {
      list = list.sort((a, b) => b.popularity - a.popularity);
    } else if (sort === "az") {
      list = list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "za") {
      list = list.sort((a, b) => b.name.localeCompare(a.name));
    }
    return list;
  }, [q, category, sort]);

  function handleUseTemplate(id: TemplateId) {
    router.push(`/resumes/new?template=${id}`);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Resume Templates</h1>
          <p className="text-sm text-muted-foreground">
            Pick a template that fits your profile. All options are <b>ATS-friendly</b>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/resumes">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Go to Resumes
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/resumes/new">
              <Sparkles className="mr-2 h-4 w-4" />
              Start from blank
            </Link>
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        {/* Search */}
        <div className="flex w-full items-center gap-2 md:max-w-md">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search templates…"
              className="pl-9"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex w-full flex-wrap gap-2 md:w-auto md:justify-end">
          <div className="grid gap-1">
            <Label className="text-xs">Category</Label>
            <Select value={category} onValueChange={(v: any) => setCategory(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="ats">ATS-friendly</SelectItem>
                <SelectItem value="onepage">1-page</SelectItem>
                <SelectItem value="twocol">2-column</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1">
            <Label className="text-xs">Sort</Label>
            <Select value={sort} onValueChange={(v: any) => setSort(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Popular" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Popularity</SelectItem>
                <SelectItem value="az">A → Z</SelectItem>
                <SelectItem value="za">Z → A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Cards list (FLEX) */}
      <div className="mt-6 flex flex-wrap gap-4">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="basis-full sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(33.333%-0.666rem)] shrink-0"
          >
            <TemplateCard t={t} onUse={handleUseTemplate} />
          </div>
        ))}
        {filtered.length === 0 && (
          <Card className="w-full border-dashed">
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              No templates match your filters.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
