// app/(pages)/features/page.tsx
import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import {
  Sparkles,
  FileText,
  Gauge,
  BarChart3,
  Settings2,
  Zap,
  ShieldCheck,
  Globe2,
  CheckCircle2,
} from "lucide-react";

export default function FeaturesPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero / Intro */}
      <section className="flex flex-col gap-8 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-4">
          <Badge variant="secondary" className="gap-2 rounded-full px-3 py-1 text-xs">
            <Sparkles className="h-3 w-3" />
            Built for ATS-first job search
          </Badge>

          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Features that help you land more{" "}
            <span className="bg-linear-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
              interviews
            </span>
          </h1>

          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            Resumint turns your experience into a polished, ATS-friendly resume –
            with smart templates and live analytics all in one place.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">
                Get started free
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">
                Go to dashboard
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              No tracking – your data stays yours.
            </div>
            <div className="flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5 text-sky-500" />
              Works for global job boards.
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-1 items-center justify-center lg:mt-0">
          <div className="relative w-full max-w-md rounded-2xl border bg-card/70 p-4 shadow-sm backdrop-blur">
            <div className="relative h-56 w-full overflow-hidden rounded-xl border bg-muted/40">
              <Image
                src="/Images/hero-preview.jpg"
                alt="Resumint preview"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 400px, 100vw"
              />
            </div>
            <div className="mt-4 grid gap-2 text-xs sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-lg border bg-background/80 px-2 py-2">
                <Gauge className="h-4 w-4 text-emerald-500" />
                <div>
                  <div className="font-medium">ATS Score</div>
                  <div className="text-[11px] text-muted-foreground">92 / 100</div>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border bg-background/80 px-2 py-2">
                <BarChart3 className="h-4 w-4 text-sky-500" />
                <div>
                  <div className="font-medium">Views</div>
                  <div className="text-[11px] text-muted-foreground">1.4k this month</div>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border bg-background/80 px-2 py-2">
                <Zap className="h-4 w-4 text-amber-500" />
                <div>
                  <div className="font-medium">Exports</div>
                  <div className="text-[11px] text-muted-foreground">One-click downloads</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core feature grid */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Everything you need to impress recruiters
            </h2>
            <p className="text-sm text-muted-foreground">
              From writing bullets to tracking engagement – Resumint keeps everything in one place.
            </p>
          </div>
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
            No design skills needed
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-3 pb-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <FileText className="h-4 w-4" />
              </span>
              <div>
                <CardTitle className="text-base">ATS-friendly templates</CardTitle>
                <CardDescription>Clean, modern layouts that pass automated screening.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Choose from multiple templates optimized for readability and ATS parsing.
                Swap templates anytime without losing content.
              </p>
              <ul className="mt-1 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Designed to avoid parsing errors
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Consistent section structure
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-3 pb-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600">
                <Gauge className="h-4 w-4" />
              </span>
              <div>
                <CardTitle className="text-base">Real-time ATS scoring</CardTitle>
                <CardDescription>See how well your resume matches each job description.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Paste a job description and get instant feedback on keyword coverage,
                missing skills, and quick wins to improve your score.
              </p>
              <ul className="mt-1 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Keyword match breakdown
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Suggestions for missing skills
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* AI bullet writer card removed */}

          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-3 pb-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
                <BarChart3 className="h-4 w-4" />
              </span>
              <div>
                <CardTitle className="text-base">Resume analytics</CardTitle>
                <CardDescription>Understand what’s working with your applications.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Track views, downloads, and ATS score trends across different versions
                of your resume to refine what you send.
              </p>
              <ul className="mt-1 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  View & download metrics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Template performance insights
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-3 pb-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
                <Settings2 className="h-4 w-4" />
              </span>
              <div>
                <CardTitle className="text-base">Versioning & variants</CardTitle>
                <CardDescription>Keep multiple tailored resumes, side by side.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Duplicate and tweak resumes for different roles or companies. Switch, compare,
                and export without losing your base structure.
              </p>
              <ul className="mt-1 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Role-specific versions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Safe autosaving in the editor
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-3 pb-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <CardTitle className="text-base">Privacy-first by design</CardTitle>
                <CardDescription>Your data, your control – no surprise sharing.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Resumint stores only what’s needed and gives you clear controls to manage
                public links, visibility, and connected data.
              </p>
              <ul className="mt-1 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Private by default
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Easy link revoke for shared resumes
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tabs / use cases */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Designed for every stage of your career
            </h2>
            <p className="text-sm text-muted-foreground">
              Whether you&apos;re early in your journey or switching careers, Resumint adapts.
            </p>
          </div>
        </div>

        <Tabs defaultValue="student" className="w-full">
          <TabsList className="flex flex-wrap justify-start">
            <TabsTrigger value="student">Students & freshers</TabsTrigger>
            <TabsTrigger value="professional">Mid-level professionals</TabsTrigger>
            <TabsTrigger value="switcher">Career switchers</TabsTrigger>
          </TabsList>

          <TabsContent value="student" className="mt-4">
            <Card>
              <CardContent className="flex flex-col gap-6 py-6 md:flex-row md:items-center">
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold">Turn academic work into impact</h3>
                  <p className="text-sm text-muted-foreground">
                    Highlight projects, internships, and coursework with guided bullet prompts and
                    templates designed for early-career candidates.
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Project-first layouts</li>
                    <li>• Easy skill tagging for ATS</li>
                    <li>• Simple export for campus portals</li>
                  </ul>
                </div>
                <div className="flex-1">
                  <div className="rounded-xl border bg-muted/40 p-4 text-xs text-muted-foreground">
                    <p className="mb-2 font-medium text-foreground">Example bullet:</p>
                    <p>
                      <span className="font-semibold text-emerald-600">Developed</span> a full-stack
                      project using <b>Next.js</b> and <b>PostgreSQL</b>,{" "}
                      <span className="font-semibold text-emerald-600">improving</span> load times by{" "}
                      <b>40%</b> compared to the baseline implementation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professional" className="mt-4">
            <Card>
              <CardContent className="flex flex-col gap-6 py-6 md:flex-row md:items-center">
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold">Showcase measurable impact</h3>
                  <p className="text-sm text-muted-foreground">
                    Focus on outcomes and metrics with guided bullet templates and ATS score
                    feedback tuned for experienced roles.
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Support for complex work histories</li>
                    <li>• Multiple tailored resume versions</li>
                    <li>• Detailed keyword coverage insights</li>
                  </ul>
                </div>
                <div className="flex-1">
                  <div className="rounded-xl border bg-muted/40 p-4 text-xs text-muted-foreground">
                    <p className="mb-2 font-medium text-foreground">Example bullet:</p>
                    <p>
                      <span className="font-semibold text-emerald-600">Led</span> a team of 4 engineers
                      to <span className="font-semibold text-emerald-600">deliver</span> a{" "}
                      <b>Next.js</b> migration that{" "}
                      <span className="font-semibold text-emerald-600">reduced</span> page load times
                      by <b>55%</b> and improved conversion by <b>18%</b>.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="switcher" className="mt-4">
            <Card>
              <CardContent className="flex flex-col gap-6 py-6 md:flex-row md:items-center">
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold">Reframe your story for a new field</h3>
                  <p className="text-sm text-muted-foreground">
                    Map your existing experience to new roles using targeted keywords and
                    suggestions that highlight transferable skills.
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Role-specific keyword suggestions</li>
                    <li>• Side-by-side resume variants</li>
                    <li>• Clear visibility into skill gaps</li>
                  </ul>
                </div>
                <div className="flex-1">
                  <div className="rounded-xl border bg-muted/40 p-4 text-xs text-muted-foreground">
                    <p className="mb-2 font-medium text-foreground">Example bullet:</p>
                    <p>
                      <span className="font-semibold text-emerald-600">Transitioned</span> from{" "}
                      <b>support</b> to <b>frontend engineering</b> by{" "}
                      <span className="font-semibold text-emerald-600">building</span> internal tools
                      in <b>React</b>, cutting manual ticket triage by <b>30%</b>.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA */}
      <section className="mt-4 rounded-2xl border bg-muted/40 px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold sm:text-xl">
              Ready to build your next resume?
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              Create a free account, pick a template, and see your ATS score in minutes.
              No credit card required.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/signup">Start for free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard/ats">Try ATS analyzer</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
