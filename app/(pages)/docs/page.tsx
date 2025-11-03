import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import {
  BookOpen,
  Rocket,
  Gauge,
  FileText,
  BarChart3,
  ShieldCheck,
  Settings2,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export default function DocsPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="flex flex-col gap-8 rounded-3xl border bg-muted/40 px-5 py-7 sm:px-8 sm:py-10 lg:flex-row lg:items-center lg:gap-10 lg:px-10 lg:py-12">
        {/* Hero copy */}
        <div className="flex-1 space-y-4">
          <Badge
            variant="secondary"
            className="gap-2 rounded-full px-3 py-1 text-xs"
          >
            <BookOpen className="h-3 w-3" />
            Resumint docs
          </Badge>

          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Learn how to get the most out of{" "}
            <span className="bg-linear-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
              Resumint
            </span>
          </h1>

          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            A quick guide to creating ATS-friendly resumes, running analyses,
            and understanding your analytics – all in one place.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">Get started free</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Built for ATS-first job search.
            </div>
            <div className="flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-sky-500" />
              Track performance, not just design.
            </div>
          </div>
        </div>

        {/* Quick-start summary card */}
        <div className="flex flex-1 items-center justify-center lg:max-w-sm">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Rocket className="h-4 w-4 text-emerald-500" />
                Quick start
              </CardTitle>
              <CardDescription>
                Three steps to your first ATS-friendly resume.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ol className="space-y-2">
                <li>
                  <span className="font-medium text-foreground">
                    1. Create an account.
                  </span>{" "}
                  Sign up with email or Google.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    2. Build or import a resume.
                  </span>{" "}
                  Use a template or paste your existing content.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    3. Run an ATS analysis.
                  </span>{" "}
                  Paste a job description to see your match score.
                </li>
              </ol>
              <Button asChild variant="outline" size="sm" className="mt-2">
                <Link href="/dashboard/ats">
                  Try ATS analyzer{" "}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Docs layout: sidebar + content */}
      <section className="grid gap-6 lg:grid-cols-[260px,minmax(0,1fr)] lg:items-start">
        {/* Sidebar nav */}
        <aside className="lg:self-start">
          <Card className="border-dashed lg:sticky lg:top-24">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Documentation</CardTitle>
              <CardDescription className="text-xs">
                Browse topics to learn how each part of Resumint works.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Sections
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Getting started</li>
                <li>• ATS analyzer</li>
                <li>• Resume builder</li>
                <li>• Analytics</li>
                <li>• Account &amp; security</li>
                <li>• FAQ</li>
              </ul>
              <Separator className="my-3" />
              <p className="text-xs text-muted-foreground">
                Looking for something specific? You can also explore{" "}
                <Link
                  href="/features"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  the features overview
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </aside>

        {/* Main docs content */}
        <div className="flex-1 space-y-4">
          <Tabs defaultValue="getting-started" className="w-full">
            {/* Tabs nav */}
            <TabsList className="flex w-full justify-start gap-2 overflow-x-auto rounded-full border bg-background/60 p-1">
              <TabsTrigger
                value="getting-started"
                className="whitespace-nowrap text-xs sm:text-sm"
              >
                Getting started
              </TabsTrigger>
              <TabsTrigger
                value="ats"
                className="whitespace-nowrap text-xs sm:text-sm"
              >
                ATS analyzer
              </TabsTrigger>
              <TabsTrigger
                value="builder"
                className="whitespace-nowrap text-xs sm:text-sm"
              >
                Resume builder
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="whitespace-nowrap text-xs sm:text-sm"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="whitespace-nowrap text-xs sm:text-sm"
              >
                Account &amp; settings
              </TabsTrigger>
              <TabsTrigger
                value="faq"
                className="whitespace-nowrap text-xs sm:text-sm"
              >
                FAQ
              </TabsTrigger>
            </TabsList>

            {/* Getting started */}
            <TabsContent value="getting-started" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="h-4 w-4 text-emerald-500" />
                    Getting started
                  </CardTitle>
                  <CardDescription>
                    New to Resumint? Start here to go from zero to first resume.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      1. Create an account
                    </h3>
                    <p>
                      Click <b>Sign up</b> and create an account with your email
                      and password, or use Google sign-in. Once you&apos;re in,
                      you&apos;ll land on your dashboard.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      2. Create your first resume
                    </h3>
                    <p>
                      From the dashboard, create a new resume and choose a
                      template. You can start from scratch or paste content from
                      an existing document.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      3. Add experience, skills, and education
                    </h3>
                    <p>
                      Use the editor&apos;s sections to add your work history,
                      skills, and education. Resumint keeps the structure
                      consistent so ATS systems can parse it easily.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      4. Export or share
                    </h3>
                    <p>
                      When you&apos;re ready, export as PDF or share a public
                      link. You can manage link visibility at any time.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ATS analyzer */}
            <TabsContent value="ats" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Gauge className="h-4 w-4 text-sky-500" />
                    ATS analyzer
                  </CardTitle>
                  <CardDescription>
                    See how well your resume matches a specific job description.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      Running an analysis
                    </h3>
                    <p>
                      Open the ATS section in your dashboard, pick a resume, and
                      paste the job description text. Resumint will calculate an
                      ATS match score from 0–100.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      Reading the results
                    </h3>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      <li>
                        <b>Matched keywords:</b> skills and phrases already
                        present in your resume.
                      </li>
                      <li>
                        <b>Missing keywords:</b> relevant terms that do not
                        appear yet.
                      </li>
                      <li>
                        <b>Extras:</b> items in your resume that don&apos;t map
                        directly to the JD.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      Improving your score
                    </h3>
                    <p>
                      Use the missing keywords list as a guide. If they
                      genuinely reflect your experience, update your summary or
                      bullet points to include them.
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="mt-1">
                    <Link href="/dashboard/ats">Open ATS analyzer</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Resume builder */}
            <TabsContent value="builder" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4 text-indigo-500" />
                    Resume builder
                  </CardTitle>
                  <CardDescription>
                    Build clean, ATS-conscious resumes with reusable templates.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      Choosing a template
                    </h3>
                    <p>
                      Start with a template that matches your style (clean,
                      modern, minimal, or elegant). You can switch templates
                      without losing your content.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      Editing sections
                    </h3>
                    <p>
                      Add or reorder sections such as Summary, Experience,
                      Education, and Skills. Keep job titles, company names, and
                      dates consistent for better parsing.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      Creating variants
                    </h3>
                    <p>
                      Duplicate an existing resume to tailor it for another
                      role. This lets you keep a master version while
                      experimenting with variations.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart3 className="h-4 w-4 text-emerald-500" />
                    Analytics
                  </CardTitle>
                  <CardDescription>
                    Understand how your resumes perform once you share them.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      Views &amp; downloads
                    </h3>
                    <p>
                      Analytics shows how many people viewed or downloaded each
                      resume over time, helping you see which versions perform
                      best.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      Template performance
                    </h3>
                    <p>
                      See which templates generate more engagement so you can
                      double down on what works in your target market.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      ATS trends
                    </h3>
                    <p>
                      Track average ATS scores across your resumes and see how
                      improvements you make impact your match rates over time.
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="mt-1">
                    <Link href="/dashboard/analytics">Open analytics</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account & settings */}
            <TabsContent value="account" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Settings2 className="h-4 w-4 text-slate-500" />
                    Account &amp; settings
                  </CardTitle>
                  <CardDescription>
                    Manage your profile, preferences, and security options.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      Profile &amp; avatar
                    </h3>
                    <p>
                      Update your display name, short bio, and avatar. These
                      details can appear on public resume links.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      Theme &amp; language
                    </h3>
                    <p>
                      Choose between light, dark, or system theme and select
                      your preferred language for the interface.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      Security &amp; password
                    </h3>
                    <p>
                      Change your password for email/password accounts and
                      control how notifications and login sessions are managed.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* FAQ */}
            <TabsContent value="faq" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <HelpCircle className="h-4 w-4 text-amber-500" />
                    Frequently asked questions
                  </CardTitle>
                  <CardDescription>
                    Quick answers to common questions about Resumint.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      Is my resume data private?
                    </h3>
                    <p>
                      Yes. Resumes are private by default. Public links are only
                      created when you explicitly choose to share them, and you
                      can revoke links at any time.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      Does Resumint guarantee job offers?
                    </h3>
                    <p>
                      No tool can guarantee offers, but Resumint is designed to
                      improve your chances of passing ATS filters and presenting
                      your experience clearly to recruiters.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      Can I export my data?
                    </h3>
                    <p>
                      You can export resumes as PDFs. Additional export options
                      may be added over time based on user feedback.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                      I found a bug – how do I report it?
                    </h3>
                    <p>
                      You can reach out via the contact page. Including
                      screenshots and steps to reproduce helps us fix issues
                      faster.
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="mt-1">
                    <Link href="/contact">Contact support</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
