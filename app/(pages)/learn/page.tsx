// app/(pages)/learn-more/page.tsx
import Link from "next/link";
import Image from "next/image";

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
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import {
  Sparkles,
  FileText,
  Gauge,
  Search,
  ListChecks,
  BarChart3,
  ShieldCheck,
  Download,
  ArrowRight,
  CheckCircle2,
  Clock,
  Globe2,
} from "lucide-react";

export default function LearnMorePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="flex flex-col gap-8 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-4">
          <Badge variant="secondary" className="gap-2 rounded-full px-3 py-1 text-xs">
            <Sparkles className="h-3 w-3" />
            Learn more about how Resumint works
          </Badge>

          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Understand how{" "}
            <span className="bg-linear-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
              Resumint
            </span>{" "}
            helps your resume stand out.
          </h1>

          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            Resumint combines clean templates, ATS-aware structure, and
            analytics so you can apply with confidence – whether you&apos;re
            creating your first resume or refining your tenth.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">
                Start for free
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/features">
                Explore all features
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Private by default – you choose what to share.
            </div>
            <div className="flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5 text-sky-500" />
              Works for global roles and remote positions.
            </div>
          </div>
        </div>

        {/* Hero visual */}
        <div className="mt-4 flex flex-1 items-center justify-center lg:mt-0">
          <div className="relative w-full max-w-md rounded-2xl border bg-card/70 p-4 shadow-sm backdrop-blur">
            <div className="relative h-56 w-full overflow-hidden rounded-xl border bg-muted/40">
              <Image
                src="/Images/hero-preview.jpg"
                alt="Resumint resume preview"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 400px, 100vw"
              />
            </div>
            <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-lg border bg-background/80 px-2 py-2">
                <Gauge className="h-4 w-4 text-emerald-500" />
                <div>
                  <div className="font-medium">ATS score insight</div>
                  <div className="text-[11px] text-muted-foreground">
                    See how your resume reads to a scanner.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border bg-background/80 px-2 py-2">
                <BarChart3 className="h-4 w-4 text-sky-500" />
                <div>
                  <div className="font-medium">Engagement metrics</div>
                  <div className="text-[11px] text-muted-foreground">
                    Track views & downloads over time.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              How Resumint fits into your job search
            </h2>
            <p className="text-sm text-muted-foreground">
              We designed the flow so you spend less time formatting and more time applying.
            </p>
          </div>
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
            3 simple steps
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-3 pb-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <FileText className="h-4 w-4" />
              </span>
              <div>
                <CardTitle className="text-base">1. Add your experience</CardTitle>
                <CardDescription>Start from scratch or import an existing resume.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Enter your work history, education, and key skills into structured sections.
                Resumint keeps everything tidy and consistent across templates.
              </p>
              <ul className="mt-1 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Clear sections for roles, projects, and skills
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Autosave so you don&apos;t lose progress
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-3 pb-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600">
                <Search className="h-4 w-4" />
              </span>
              <div>
                <CardTitle className="text-base">2. Compare against roles</CardTitle>
                <CardDescription>See how your resume aligns with job descriptions.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Paste a job description, and Resumint highlights matching skills, gaps, and opportunities
                to make your resume more relevant.
              </p>
              <ul className="mt-1 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Keyword and skill coverage
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Suggestions to add missing keywords
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-3 pb-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                <Download className="h-4 w-4" />
              </span>
              <div>
                <CardTitle className="text-base">3. Export & track</CardTitle>
                <CardDescription>Download and monitor how each resume performs.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Export polished PDFs and track views and downloads for shared links
                to understand what&apos;s resonating.
              </p>
              <ul className="mt-1 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  One-click export in clean formats
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Basic analytics for public resumes
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Deep dive tabs */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Go deeper into the product
            </h2>
            <p className="text-sm text-muted-foreground">
              Learn what&apos;s happening behind the scenes as you use Resumint.
            </p>
          </div>
        </div>

        <Tabs defaultValue="ats" className="w-full">
          <TabsList className="flex flex-wrap justify-start">
            <TabsTrigger value="ats">ATS-awareness</TabsTrigger>
            <TabsTrigger value="structure">Resume structure</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="ats" className="mt-4">
            <Card>
              <CardContent className="flex flex-col gap-6 py-6 md:flex-row md:items-center">
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold">Built with ATS in mind</h3>
                  <p className="text-sm text-muted-foreground">
                    Many automated systems scan for consistent formatting, clear headings, and
                    relevant keywords. Resumint helps you line up with those expectations without
                    sacrificing readability for humans.
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ListChecks className="h-4 w-4 text-emerald-500" />
                      Emphasis on standard section headers and clear hierarchy
                    </li>
                    <li className="flex items-center gap-2">
                      <ListChecks className="h-4 w-4 text-emerald-500" />
                      Avoids heavy graphics that confuse parsers
                    </li>
                    <li className="flex items-center gap-2">
                      <ListChecks className="h-4 w-4 text-emerald-500" />
                      Encourages role-specific keywords where it makes sense
                    </li>
                  </ul>
                </div>
                <div className="flex-1">
                  <div className="rounded-xl border bg-muted/40 p-4 text-xs text-muted-foreground">
                    <p className="mb-2 font-medium text-foreground">Example insight:</p>
                    <p>
                      &quot;Your resume mentions <b>Next.js</b> and <b>TypeScript</b>, but the job
                      also calls out <b>accessibility</b>. Consider adding a bullet that highlights
                      accessibility work you&apos;ve done.&quot;
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="structure" className="mt-4">
            <Card>
              <CardContent className="flex flex-col gap-6 py-6 md:flex-row md:items-center">
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold">Structured, reusable content</h3>
                  <p className="text-sm text-muted-foreground">
                    Instead of fighting a word processor, you fill in focused fields. Resumint
                    then renders those into neat, shareable resumes.
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Separate sections for experience, education, and links</li>
                    <li>• Optional bullets for each role or project</li>
                    <li>• Reuse content across multiple resume templates</li>
                  </ul>
                </div>
                <div className="flex-1">
                  <div className="rounded-xl border bg-muted/40 p-4 text-xs text-muted-foreground">
                    <p className="mb-2 font-medium text-foreground">Why this helps:</p>
                    <p>
                      It&apos;s easier to keep your history up to date in one structured place and then
                      export different versions tailored to specific roles, without rewriting from scratch.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <Card>
              <CardContent className="flex flex-col gap-6 py-6 md:flex-row md:items-center">
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold">Lightweight analytics, helpful context</h3>
                  <p className="text-sm text-muted-foreground">
                    When you share a public resume link, Resumint can show simple metrics so you have
                    a sense of engagement over time.
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Views and downloads per resume link</li>
                    <li>• Template adoption trends</li>
                    <li>• ATS score patterns across analyses</li>
                  </ul>
                </div>
                <div className="flex-1">
                  <div className="rounded-xl border bg-muted/40 p-4 text-xs text-muted-foreground">
                    <p className="mb-2 font-medium text-foreground">Example scenario:</p>
                    <p>
                      You notice that one version of your resume gets more downloads than others. That
                      might be the version to prioritize for similar roles or locations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Why people like it */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Why job seekers use Resumint
            </h2>
            <p className="text-sm text-muted-foreground">
              Small details add up to a smoother job search experience.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-start gap-3 pb-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <Clock className="h-4 w-4" />
              </span>
              <div>
                <CardTitle className="text-base">Saves time</CardTitle>
                <CardDescription>Set up once, reuse everywhere.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Edit your experience in one place, then export as many versions as you need.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start gap-3 pb-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <CardTitle className="text-base">Respects your privacy</CardTitle>
                <CardDescription>Control what&apos;s public and what stays private.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Resumes are private by default. Public links are easy to share, and just as easy to revoke.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start gap-3 pb-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
                <BarChart3 className="h-4 w-4" />
              </span>
              <div>
                <CardTitle className="text-base">Gives clarity</CardTitle>
                <CardDescription>Understand where your resume stands.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Between ATS insights and basic analytics, you get a clearer sense of what&apos;s working.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Frequently asked questions
          </h2>
          <p className="text-sm text-muted-foreground">
            A few quick answers before you dive in.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="ats">
            <AccordionTrigger>Do I need to understand ATS to use Resumint?</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              No. Resumint is built so that even if you&apos;ve never heard of ATS, you&apos;re still
              guided toward clear structure and relevant keywords. The product surface is simple;
              the ATS-awareness is baked into how templates and checks are designed.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="templates">
            <AccordionTrigger>Can I switch templates without re-entering everything?</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Yes. Your content is stored separately from the layout. You can swap templates at any
              time, and your experience, education, and skills will automatically adjust to the new design.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="privacy">
            <AccordionTrigger>Are my resumes public by default?</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              No. Your resumes are private unless you explicitly create a shareable link. You can
              revoke links whenever you like, which disables access and stops new view tracking.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="pricing">
            <AccordionTrigger>Is Resumint free?</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              You can start for free and create a solid, ATS-aware resume. If we add paid plans,
              they&apos;ll focus on power features like extended analytics or advanced export options.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* CTA */}
      <section className="mt-2 rounded-2xl border bg-muted/40 px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold sm:text-xl">
              Ready to see it in action?
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              Create a free account, add your experience, and generate a polished resume
              in just a few minutes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/signup">
                Get started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard/ats">
                Try ATS analyzer
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
