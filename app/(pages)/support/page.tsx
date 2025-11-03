"use client";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  LifeBuoy,
  MessageCircle,
  Mail,
  AlertCircle,
  BookOpen,
  Clock,
  Headset,
  CheckCircle2,
  ArrowRight,
  Gauge,
  FileText,
} from "lucide-react";

export default function SupportPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero / Intro */}
      <section className="flex flex-col gap-8 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-4">
          <Badge variant="secondary" className="gap-2 rounded-full px-3 py-1 text-xs">
            <LifeBuoy className="h-3 w-3" />
            Support
          </Badge>

          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Need help with{" "}
            <span className="bg-linear-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
              Resumint
            </span>
            ?
          </h1>

          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            Whether you&apos;re stuck in the editor, have questions about ATS scoring,
            or found a bug – we&apos;re here to help.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/docs">
                View docs
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">
                Contact support
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-emerald-500" />
              Typical response time: under 24 hours.
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-sky-500" />
              No bots – real human support.
            </div>
          </div>
        </div>

        {/* Status / Channels card */}
        <div className="mt-4 flex flex-1 items-center justify-center lg:mt-0">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="h-4 w-4 text-emerald-500" />
                Status & channels
              </CardTitle>
              <CardDescription>
                Check current status and best ways to reach us.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-center justify-between rounded-md border bg-emerald-500/5 px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="font-medium text-foreground">All systems operational</span>
                </div>
                <span className="text-[11px] text-muted-foreground">Realtime</span>
              </div>

              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 text-sky-500" />
                  <div>
                    <div className="font-medium text-foreground">Email</div>
                    <div className="text-xs text-muted-foreground">
                      Use the contact form for support requests and bug reports.
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <BookOpen className="mt-0.5 h-4 w-4 text-amber-500" />
                  <div>
                    <div className="font-medium text-foreground">Documentation</div>
                    <div className="text-xs text-muted-foreground">
                      Quick answers for setup, ATS analysis, and analytics.
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Headset className="mt-0.5 h-4 w-4 text-purple-500" />
                  <div>
                    <div className="font-medium text-foreground">Priority support</div>
                    <div className="text-xs text-muted-foreground">
                      Priority response for critical access or billing issues.
                    </div>
                  </div>
                </li>
              </ul>

              <Button asChild variant="outline" size="sm" className="mt-1 w-full">
                <Link href="/contact">
                  Open support request <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Common issues + Quick help */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
        {/* Left: common issues */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Common issues & quick fixes
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-emerald-500" />
                  Resume not updating
                </CardTitle>
                <CardDescription className="text-xs">
                  Changes not reflecting in your exported PDF or link.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <ul className="space-y-1">
                  <li>• Ensure you click &quot;Save&quot; in the editor.</li>
                  <li>• Refresh the public link page.</li>
                  <li>• Re-export the PDF after edits.</li>
                </ul>
                <Button asChild variant="outline" size="sm" className="mt-1">
                  <Link href="/docs">
                    See editor guide
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Gauge className="h-4 w-4 text-sky-500" />
                  ATS score looks low
                </CardTitle>
                <CardDescription className="text-xs">
                  Understanding why your match score is lower than expected.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <ul className="space-y-1">
                  <li>• Check the &quot;Missing keywords&quot; list.</li>
                  <li>• Make sure the job description is complete.</li>
                  <li>• Tailor bullets to the specific role.</li>
                </ul>
                <Button asChild variant="outline" size="sm" className="mt-1">
                  <Link href="/dashboard/ats">
                    Run a new analysis
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <MessageCircle className="h-4 w-4 text-amber-500" />
                  Can&apos;t sign in
                </CardTitle>
                <CardDescription className="text-xs">
                  Login errors or password issues.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <ul className="space-y-1">
                  <li>• Double-check your email spelling.</li>
                  <li>• Use the &quot;Forgot password&quot; option for resets.</li>
                  <li>• Try a different browser or incognito.</li>
                </ul>
                <Button asChild variant="outline" size="sm" className="mt-1">
                  <Link href="/forgot">
                    Reset password
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  Found a bug
                </CardTitle>
                <CardDescription className="text-xs">
                  Report anything that feels broken or off.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <ul className="space-y-1">
                  <li>• Include steps to reproduce.</li>
                  <li>• Share your browser & device.</li>
                  <li>• Attach screenshots if possible.</li>
                </ul>
                <Button asChild variant="outline" size="sm" className="mt-1">
                  <Link href="/contact">
                    Report a bug
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right: lightweight support form (optional helper) */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Send a quick support request
          </h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageCircle className="h-4 w-4 text-emerald-500" />
                Tell us what&apos;s going on
              </CardTitle>
              <CardDescription>
                Short form for non-urgent questions. For full details, use the main{" "}
                <Link href="/contact" className="text-primary underline-offset-4 hover:underline">
                  contact page
                </Link>
                .
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* This is a UI-only helper form; backend handling stays with your existing contact API */}
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  // You can either route them to /contact
                  window.location.href = "/contact";
                }}
              >
                <div className="grid gap-2">
                  <label htmlFor="support-email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="support-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="support-subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="support-subject"
                    placeholder="Short summary (e.g., ATS score seems off)"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="support-message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="support-message"
                    rows={4}
                    placeholder="Describe the issue, what you expected, and any error messages you saw."
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Submitting will redirect you to the full contact form so you can review before sending.
                </p>
                <Button type="submit" className="w-full">
                  Go to full contact form
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Other resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>
                  •{" "}
                  <Link href="/docs" className="text-primary underline-offset-4 hover:underline">
                    Documentation
                  </Link>{" "}
                  – detailed guides and explanations.
                </li>
                <li>
                  •{" "}
                  <Link href="/features" className="text-primary underline-offset-4 hover:underline">
                    Features
                  </Link>{" "}
                  – overview of what Resumint can do.
                </li>
                <li>
                  •{" "}
                  <Link href="/changelog" className="text-primary underline-offset-4 hover:underline">
                    Changelog
                  </Link>{" "}
                  – see what&apos;s new and improved.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
