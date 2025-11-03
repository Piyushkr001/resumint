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
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import {
  Sparkles,
  BookOpen,
  Rocket,
  Gauge,
  FileText,
  BarChart3,
  CheckCircle2,
  Compass,
  Target,
  ArrowRight,
  LifeBuoy,
} from "lucide-react";

export default function GuidesPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero / Intro */}
      <section className="flex flex-col gap-8 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-4">
          <Badge variant="secondary" className="gap-2 rounded-full px-3 py-1 text-xs">
            <Sparkles className="h-3 w-3" />
            Guides
          </Badge>

          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Learn how to get the most out of{" "}
            <span className="bg-linear-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
              Resumint
            </span>
          </h1>

          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            Step-by-step guides to help you build ATS-friendly resumes, tailor them
            to jobs, and understand your analytics – at your own pace.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/docs">
                Open docs
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/learn-more">
                Learn how it works
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-emerald-500" />
              Start-to-finish job-ready flow.
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-sky-500" />
              Focused on real hiring signals.
            </div>
          </div>
        </div>

        {/* Quick start checklist */}
        <div className="mt-4 flex flex-1 items-center justify-center lg:mt-0">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Rocket className="h-4 w-4 text-emerald-500" />
                Quick start checklist
              </CardTitle>
              <CardDescription>
                Follow these steps to go from blank page to ATS-optimized resume.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ol className="space-y-2 text-xs">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-[11px] font-semibold text-emerald-600">
                    1
                  </span>
                  <div>
                    <span className="font-medium text-foreground">Create your first resume</span>
                    <p>Go to the dashboard and add your experience, education, and skills.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-[11px] font-semibold text-emerald-600">
                    2
                  </span>
                  <div>
                    <span className="font-medium text-foreground">Pick a template</span>
                    <p>Switch between layouts until everything is clean and readable.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-[11px] font-semibold text-emerald-600">
                    3
                  </span>
                  <div>
                    <span className="font-medium text-foreground">Run an ATS analysis</span>
                    <p>Paste a job description and see missing keywords & alignment.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-[11px] font-semibold text-emerald-600">
                    4
                  </span>
                  <div>
                    <span className="font-medium text-foreground">Refine & export</span>
                    <p>Adjust bullets, re-run the score, then download or share a link.</p>
                  </div>
                </li>
              </ol>

              <Button asChild size="sm" className="mt-2 w-full">
                <Link href="/dashboard">
                  Go to dashboard <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Popular guides */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              Popular guides
            </h2>
            <p className="text-sm text-muted-foreground">
              Start with these walkthroughs to master the essentials.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-3 pb-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <BookOpen className="h-4 w-4" />
              </span>
              <div>
                <CardTitle className="text-base">Getting started with Resumint</CardTitle>
                <CardDescription>From sign-up to your first exported resume.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Learn how to create an account, set up your profile, and build your
                first resume with sections that recruiters expect.
              </p>
              <ul className="mt-1 space-y-1 text-xs">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Editor basics & navigation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Saving & versioning
                </li>
              </ul>
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link href="/docs">
                  Open guide
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-3 pb-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600">
                <Gauge className="h-4 w-4" />
              </span>
              <div>
                <CardTitle className="text-base">Optimizing your ATS score</CardTitle>
                <CardDescription>Turn job descriptions into targeted resumes.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Learn how ATS scoring works, how to read the match breakdown, and
                how to adjust your content without keyword stuffing.
              </p>
              <ul className="mt-1 space-y-1 text-xs">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Matching role titles & skills
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Handling missing & extra keywords
                </li>
              </ul>
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link href="/dashboard/ats">
                  Try ATS analyzer
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-3 pb-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                <FileText className="h-4 w-4" />
              </span>
              <div>
                <CardTitle className="text-base">Writing effective resume bullets</CardTitle>
                <CardDescription>Show impact instead of just listing tasks.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Learn a simple pattern to convert responsibilities into strong,
                quantified bullet points that stand out in screens.
              </p>
              <ul className="mt-1 space-y-1 text-xs">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Situation → Action → Outcome structure
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Choosing the right metrics
                </li>
              </ul>
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link href="/learn-more">
                  Read tips
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-3 pb-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
                <BarChart3 className="h-4 w-4" />
              </span>
              <div>
                <CardTitle className="text-base">Using analytics to iterate</CardTitle>
                <CardDescription>Make data-driven improvements over time.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Understand views, downloads, and score trends so you can decide
                which version to send for each opportunity.
              </p>
              <ul className="mt-1 space-y-1 text-xs">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Comparing variants by performance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  When to create new versions
                </li>
              </ul>
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link href="/dashboard/analytics">
                  Open analytics
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-3 pb-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
                <LifeBuoy className="h-4 w-4" />
              </span>
              <div>
                <CardTitle className="text-base">Troubleshooting & FAQ</CardTitle>
                <CardDescription>Fix common issues quickly.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Find answers to the most frequent questions about exporting, sign-in,
                ATS scoring, and account management.
              </p>
              <ul className="mt-1 space-y-1 text-xs">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Resume export issues
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Sign-in & password problems
                </li>
              </ul>
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link href="/support">
                  Go to support
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tabbed learning paths */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              Learning paths
            </h2>
            <p className="text-sm text-muted-foreground">
              Follow a curated path based on where you are in your job search.
            </p>
          </div>
        </div>

        <Tabs defaultValue="starter" className="w-full">
          <TabsList className="flex flex-wrap justify-start">
            <TabsTrigger value="starter">Just getting started</TabsTrigger>
            <TabsTrigger value="targeting">Targeting specific roles</TabsTrigger>
            <TabsTrigger value="optimizing">Optimizing & iterating</TabsTrigger>
          </TabsList>

          <TabsContent value="starter" className="mt-4">
            <Card>
              <CardContent className="flex flex-col gap-6 py-6 md:flex-row md:items-start">
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold">From zero to first resume</h3>
                  <p className="text-sm text-muted-foreground">
                    Ideal if you&apos;re new to resumes or building in Resumint for the first time.
                    This path focuses on structure and clarity.
                  </p>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li>1. Read the getting started guide.</li>
                    <li>2. Fill in your profile, experience, and education.</li>
                    <li>3. Choose a template and export a first draft.</li>
                  </ol>
                </div>
                <div className="flex-1 space-y-3 text-sm text-muted-foreground">
                  <p className="text-xs font-medium uppercase tracking-wide text-foreground">
                    Recommended guides
                  </p>
                  <ul className="space-y-1 text-xs">
                    <li>• Getting started with Resumint</li>
                    <li>• Structuring your experience</li>
                    <li>• Picking the right template</li>
                  </ul>
                  <Button asChild size="sm" className="mt-1">
                    <Link href="/docs">
                      Start path
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="targeting" className="mt-4">
            <Card>
              <CardContent className="flex flex-col gap-6 py-6 md:flex-row md:items-start">
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold">Tailoring to each opportunity</h3>
                  <p className="text-sm text-muted-foreground">
                    Best when you already have a resume and want to customize it for
                    different companies or roles.
                  </p>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li>1. Duplicate your base resume for each role.</li>
                    <li>2. Run an ATS analysis with the job description.</li>
                    <li>3. Adjust bullets and skills to better align.</li>
                  </ol>
                </div>
                <div className="flex-1 space-y-3 text-sm text-muted-foreground">
                  <p className="text-xs font-medium uppercase tracking-wide text-foreground">
                    Recommended guides
                  </p>
                  <ul className="space-y-1 text-xs">
                    <li>• Optimizing your ATS score</li>
                    <li>• Writing effective resume bullets</li>
                    <li>• Managing multiple resume versions</li>
                  </ul>
                  <Button asChild size="sm" className="mt-1">
                    <Link href="/dashboard/ats">
                      Open ATS analyzer
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimizing" className="mt-4">
            <Card>
              <CardContent className="flex flex-col gap-6 py-6 md:flex-row md:items-start">
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold">Using data to improve over time</h3>
                  <p className="text-sm text-muted-foreground">
                    Perfect when you&apos;ve sent applications and want to refine your
                    approach based on performance.
                  </p>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li>1. Review views, downloads, and ATS trends.</li>
                    <li>2. Identify which template/variant performs better.</li>
                    <li>3. Lean into what works and retire what doesn&apos;t.</li>
                  </ol>
                </div>
                <div className="flex-1 space-y-3 text-sm text-muted-foreground">
                  <p className="text-xs font-medium uppercase tracking-wide text-foreground">
                    Recommended guides
                  </p>
                  <ul className="space-y-1 text-xs">
                    <li>• Using analytics to iterate</li>
                    <li>• When to create a new variant</li>
                    <li>• Maintaining a clean resume library</li>
                  </ul>
                  <Button asChild size="sm" className="mt-1">
                    <Link href="/dashboard/analytics">
                      View analytics
                    </Link>
                  </Button>
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
              Ready to follow your first guide?
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              Pick a path, open the corresponding guide, and start improving your
              resume with clear, practical steps.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/docs">Open docs</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/support">Get help</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
