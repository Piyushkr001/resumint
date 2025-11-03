// app/about/page.tsx
'use client';
import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Sparkles,
  Target,
  BarChart3,
  Wand2,
  ShieldCheck,
  Clock,
  Users,
  FileText,
  LineChart,
  ArrowRight,
} from "lucide-react";
import { Globe } from "@phosphor-icons/react";

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero */}
      <section className="flex flex-col gap-8 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-4">
          <Badge variant="outline" className="gap-2 w-fit">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            About Resumint
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Resumes that actually <span className="text-primary">pass ATS</span>.
          </h1>
          <p className="max-w-xl text-sm sm:text-base text-muted-foreground">
            Resumint is built for the modern job hunt – where recruiters skim,
            ATS bots filter, and you only get a few seconds to stand out. We
            help you craft clean, focused resumes that speak both human and
            machine.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              ATS-aware templates
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LineChart className="h-4 w-4 text-sky-500" />
              Smart analytics
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-amber-500" />
              Ship in minutes
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild>
              <Link href="/login">
                Start building <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/ats">Try ATS analyzer</Link>
            </Button>
          </div>
        </div>

        {/* Side metrics card */}
        <div className="flex-1 min-w-[260px]">
          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Why we exist</CardTitle>
              <CardDescription>
                Turning messy CVs into sharp, focused applications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-md border bg-muted/40 p-3 space-y-1">
                  <p className="text-xs text-muted-foreground">Job seekers helped</p>
                  <p className="text-xl font-semibold">1,200+</p>
                </div>
                <div className="rounded-md border bg-muted/40 p-3 space-y-1">
                  <p className="text-xs text-muted-foreground">Avg. ATS score</p>
                  <p className="text-xl font-semibold text-emerald-600">85+</p>
                </div>
              </div>
              <Separator />
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  Designed for real ATS behavior, not myths.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  Focus on clarity, relevance and keyword alignment.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  Works for students, career switchers & seniors alike.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mission & how it works */}
      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Our mission</CardTitle>
            <CardDescription>
              Make high-quality, ATS-friendly resumes accessible to everyone.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Most people aren&apos;t resume nerds – they just need something
              that doesn&apos;t get lost in a recruiter&apos;s inbox or rejected
              by an automated filter. Resumint was created to bridge that gap.
            </p>
            <p>
              We combine structured templates, keyword-aware suggestions and
              simple analytics so you can focus on telling your story instead of
              fighting formatting, guessing what ATS wants, or juggling
              different versions of your resume.
            </p>
            <p>
              Whether you&apos;re applying to your first internship or your next
              leadership role, Resumint keeps your resume sharp, consistent and
              tuned to the roles you actually want.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How Resumint helps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex gap-3">
              <Target className="mt-1 h-4 w-4 text-primary" />
              <div>
                <p className="font-medium text-sm">Targeted for each role</p>
                <p className="text-xs text-muted-foreground">
                  Save different versions and quickly tailor for new job descriptions.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <BarChart3 className="mt-1 h-4 w-4 text-sky-500" />
              <div>
                <p className="font-medium text-sm">ATS insights</p>
                <p className="text-xs text-muted-foreground">
                  See keyword coverage, gaps and quick fixes before you hit apply.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Wand2 className="mt-1 h-4 w-4 text-emerald-500" />
              <div>
                <p className="font-medium text-sm">Less busy-work</p>
                <p className="text-xs text-muted-foreground">
                  Reusable sections, smart defaults and clean templates save hours.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Built for / who we serve */}
      <section className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Built for real-world job searches
            </h2>
            <p className="text-sm text-muted-foreground">
              Resumint works well if your career path is linear, messy or somewhere in between.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Students</Badge>
            <Badge variant="outline">Career switchers</Badge>
            <Badge variant="outline">Experienced hires</Badge>
            <Badge variant="outline">Remote roles</Badge>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Early-career
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1.5">
              <p>Turn projects, internships and coursework into credible experience.</p>
              <p>Focus on impact, not just tools and buzzwords.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-sky-500" />
                Career switchers
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1.5">
              <p>Reframe your previous experience for a new industry or role.</p>
              <p>Highlight transferable skills that hiring managers actually care about.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <LineChart className="h-4 w-4 text-emerald-500" />
                Experienced talent
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1.5">
              <p>Keep a clean, updated base resume and spin out focused variants fast.</p>
              <p>Show progression and measurable wins clearly.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Globe className="h-4 w-4 text-amber-500" />
                Global applications
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1.5">
              <p>Templates tuned for modern, global-style resumes.</p>
              <p>Avoid common pitfalls that confuse international recruiters.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values / principles */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">What we care about</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Clarity over clutter
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Recruiters spend seconds, not minutes, on a first pass. We favor
                clear structure, consistent typography and concise bullets.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4 text-primary" />
                Role-first design
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Every resume should be tailored to a target role, not a generic
                “one-size-fits-all” template. Resumint makes that practical.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-sky-500" />
                Respecting your time
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                You shouldn&apos;t need to fight Word formatting or design in Figma
                just to apply for a job. We keep the tooling out of your way.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border bg-muted/40 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
              Ready to ship a better resume?
            </p>
            <h3 className="text-lg sm:text-xl font-semibold">
              Create your first ATS-aware resume in under 10 minutes.
            </h3>
            <p className="max-w-xl text-sm text-muted-foreground">
              No design skills required. Just answer a few prompts, paste your
              experience, and let Resumint handle the structure.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/signup">
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard/analytics">View analytics demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
