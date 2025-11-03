// app/(pages)/changelog/page.tsx
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
  Sparkles,
  Rocket,
  Wrench,
  Bug,
  Gauge,
  BarChart3,
  FileText,
  ShieldCheck,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

const releases = [
  {
    version: "v1.3.0",
    date: "Nov 03, 2025",
    label: "Latest",
    highlight: "Analytics & ATS improvements",
    items: [
      {
        type: "New",
        icon: BarChart3,
        title: "Analytics dashboard",
        body: "Track views, downloads, and ATS score trends for your resumes with new charts and KPIs.",
      },
      {
        type: "New",
        icon: Gauge,
        title: "Template performance",
        body: "See which resume templates get the most engagement across your shared links.",
      },
      {
        type: "Improved",
        icon: Wrench,
        title: "ATS analysis accuracy",
        body: "Better keyword detection and clearer grouping of matched vs missing skills.",
      },
    ],
  },
  {
    version: "v1.2.0",
    date: "Oct 20, 2025",
    label: "Update",
    highlight: "Settings, security & notifications",
    items: [
      {
        type: "New",
        icon: ShieldCheck,
        title: "Security settings",
        body: "Change your password, manage sessions, and delete your account from the dashboard.",
      },
      {
        type: "New",
        icon: CalendarDays,
        title: "Notification controls",
        body: "Choose which product updates and digests you want to receive.",
      },
      {
        type: "Improved",
        icon: Wrench,
        title: "Profile & preferences",
        body: "More consistent layout for profile, theme, and language settings.",
      },
    ],
  },
  {
    version: "v1.1.0",
    date: "Sep 12, 2025",
    label: "Update",
    highlight: "Resume editor enhancements",
    items: [
      {
        type: "New",
        icon: FileText,
        title: "Resume variants",
        body: "Duplicate resumes to create tailored versions for different roles or companies.",
      },
      {
        type: "Improved",
        icon: Wrench,
        title: "Template rendering",
        body: "Cleaner typography and spacing for exported PDFs across all templates.",
      },
      {
        type: "Fixed",
        icon: Bug,
        title: "Bullet formatting issues",
        body: "Resolved a bug where bullet lists would occasionally render misaligned in exports.",
      },
    ],
  },
  {
    version: "v1.0.0",
    date: "Aug 01, 2025",
    label: "Launch",
    highlight: "Public launch of Resumint",
    items: [
      {
        type: "New",
        icon: Rocket,
        title: "Core resume builder",
        body: "Create structured, ATS-aware resumes with clean, modern templates.",
      },
      {
        type: "New",
        icon: Gauge,
        title: "ATS scoring",
        body: "Paste a job description and see how your resume stacks up instantly.",
      },
      {
        type: "New",
        icon: ShieldCheck,
        title: "Privacy-first sharing",
        body: "Share public links when needed and revoke them in a click.",
      },
    ],
  },
];

function typeBadgeVariant(type: string): "default" | "secondary" | "outline" | "destructive" {
  if (type === "New") return "default";
  if (type === "Improved") return "secondary";
  if (type === "Fixed") return "outline";
  return "secondary";
}

export default function ChangelogPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="flex flex-col gap-8 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-4">
          <Badge variant="secondary" className="gap-2 rounded-full px-3 py-1 text-xs">
            <Sparkles className="h-3 w-3" />
            Product updates & improvements
          </Badge>

          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Changelog – see what&apos;s{" "}
            <span className="bg-linear-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
              new in Resumint
            </span>
          </h1>

          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            We ship improvements regularly to make your resume building and job search smoother.
            Here’s a running log of what&apos;s changed.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">
                Start for free
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/features">
                View features
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Backwards compatible – your existing resumes keep working.
            </div>
            <div className="flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-sky-500" />
              Focused on real job search outcomes.
            </div>
          </div>
        </div>

        {/* Side highlight card */}
        <div className="mt-4 flex flex-1 items-center justify-center lg:mt-0">
          <Card className="w-full max-w-md border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Rocket className="h-4 w-4 text-emerald-500" />
                Latest release: {releases[0].version}
              </CardTitle>
              <CardDescription>{releases[0].highlight}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                This release focuses on analytics and ATS insights so you can better understand
                how your resumes perform once they&apos;re out in the world.
              </p>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-emerald-500" />
                  ATS trend visualizations
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-sky-500" />
                  Template usage breakdowns
                </li>
                <li className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-indigo-500" />
                  Views vs downloads tracking
                </li>
              </ul>
              <Button asChild variant="outline" size="sm" className="mt-2">
                <Link href="/dashboard/analytics">
                  Open analytics <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Timeline / Releases */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Release history
            </h2>
            <p className="text-sm text-muted-foreground">
              A quick overview of notable updates, fixes, and improvements.
            </p>
          </div>
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
            We&apos;ll keep this page up to date
          </Badge>
        </div>

        <div className="relative space-y-6">
          {/* Vertical line for larger screens */}
          <div className="pointer-events-none absolute left-4 top-0 hidden h-full w-px bg-border sm:left-1/2 sm:block" />

          <div className="space-y-6">
            {releases.map((release, idx) => (
              <div
                key={release.version}
                className="relative flex flex-col gap-4 sm:flex-row sm:items-stretch"
              >
                {/* Timeline dot */}
                <div className="absolute left-4 top-2 h-3 w-3 rounded-full border-2 border-background bg-emerald-500 sm:left-1/2 sm:-translate-x-1/2" />

                {/* Left side: meta (for large screens) */}
                <div className="hidden w-1/2 pr-6 sm:block sm:text-right">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {release.date}
                  </p>
                  <p className="text-sm font-semibold">{release.version}</p>
                  {release.label && (
                    <Badge variant="secondary" className="mt-2 inline-flex items-center gap-1 text-[11px]">
                      {release.label === "Latest" ? <Sparkles className="h-3 w-3" /> : null}
                      {release.label}
                    </Badge>
                  )}
                </div>

                {/* Right side: card */}
                <div className="sm:w-1/2 sm:pl-6">
                  <Card className="h-full">
                    <CardHeader className="pb-3">
                      {/* Meta for mobile */}
                      <div className="flex flex-wrap items-center justify-between gap-2 sm:hidden">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {release.date}
                          </p>
                          <p className="text-sm font-semibold">{release.version}</p>
                        </div>
                        {release.label && (
                          <Badge variant="secondary" className="inline-flex items-center gap-1 text-[11px]">
                            {release.label === "Latest" ? <Sparkles className="h-3 w-3" /> : null}
                            {release.label}
                          </Badge>
                        )}
                      </div>

                      <CardTitle className="text-base">
                        {release.highlight}
                      </CardTitle>
                      <CardDescription>
                        What&apos;s new in this release:
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                      <div className="space-y-3">
                        {release.items.map((item, i) => {
                          const Icon = item.icon;
                          return (
                            <div key={i} className="flex items-start gap-3">
                              <span className="mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-muted">
                                <Icon className="h-3.5 w-3.5 text-emerald-600" />
                              </span>
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-medium text-foreground">
                                    {item.title}
                                  </span>
                                  <Badge
                                    variant={typeBadgeVariant(item.type)}
                                    className="px-2 py-0 text-[11px]"
                                  >
                                    {item.type}
                                  </Badge>
                                </div>
                                <p>{item.body}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="mt-2 rounded-2xl border bg-muted/40 px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold sm:text-xl">
              Stay tuned for what&apos;s next
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              We&apos;re actively improving Resumint. Check back here for updates, or
              sign in to see the latest changes reflected in your dashboard.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Go to dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/features">
                See what&apos;s included
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
