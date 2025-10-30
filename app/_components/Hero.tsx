"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-background">
      {/* soft vignette */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-background via-background/40 to-background" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-20 lg:px-8">
        {/* LEFT: copy + ctas */}
        <div className="flex flex-col gap-6">
          <Badge
            variant="secondary"
            className="w-fit gap-2 border border-border/60 bg-background/70 backdrop-blur"
          >
            <Sparkles className="h-4 w-4" />
            New: AI suggestions & ATS scoring
          </Badge>

          <h1 className="text-pretty text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Build an{" "}
            <span className="bg-linear-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              ATS-ready resume
            </span>{" "}
            in minutes.
          </h1>

          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Resumint helps you craft, score, and tailor resumes with one click.
            Optimize for job descriptions and share a beautiful public link.
          </p>

          {/* quick capture row */}
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Paste a job description URL…"
              className="h-11 sm:max-w-md"
              aria-label="Job description URL"
            />
            <div className="flex gap-3">
              <Button className="h-11 px-5" asChild>
                <Link href="/signup">Create your resume</Link>
              </Button>
              <Button variant="outline" className="h-11 px-5" asChild>
                <Link href="/learn
                \">Lear More</Link>
              </Button>
            </div>
          </div>

          {/* feature bullets */}
          <ul className="mt-2 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {[
              "AI section rewrites",
              "Real-time ATS score",
              "Job match insights",
              "One-click public link",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT: visual */}
        <div className="relative">
          {/* glow */}
          <div
            className="pointer-events-none absolute -inset-x-10 -top-10 -z-10 h-64 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(120px 120px at 30% 40%, rgba(16,185,129,.2), transparent 60%), radial-gradient(160px 160px at 70% 30%, rgba(52,211,153,.18), transparent 60%)",
            }}
          />
          <Card className="overflow-hidden border border-border/60 shadow-sm">
            <CardContent className="p-0">
              {/* Screenshot / mockup */}
              <div className="relative aspect-16/10 w-full bg-muted">
                <Image
                  src="/Images/hero-preview.jpg"
                  alt="Resumint preview"
                  fill
                  priority
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="object-cover"
                />
              </div>

              {/* overlay label */}
              <div className="absolute right-4 top-4 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-sm text-foreground shadow-sm backdrop-blur">
                ATS Score: <span className="font-semibold text-emerald-600">92</span>
              </div>
            </CardContent>
          </Card>

          {/* small stat strip */}
          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-md border border-border/60 bg-background/60 p-3">
              <p className="font-semibold text-foreground">25k+</p>
              <p className="text-muted-foreground">Resumes</p>
            </div>
            <div className="rounded-md border border-border/60 bg-background/60 p-3">
              <p className="font-semibold text-foreground">4.9/5</p>
              <p className="text-muted-foreground">User rating</p>
            </div>
            <div className="rounded-md border border-border/60 bg-background/60 p-3">
              <p className="font-semibold text-foreground">200+</p>
              <p className="text-muted-foreground">Templates</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
