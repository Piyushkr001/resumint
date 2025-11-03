"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Mail,
  MessageCircle,
  Phone,
  Clock,
  MapPin,
  ArrowRight,
  Send,
} from "lucide-react";

/* ------------------------ Validation schema ------------------------ */

const ContactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  //@ts-ignore
  topic: z.enum(["general", "support", "bug", "billing", "feedback"], {
    required_error: "Select a topic",
  }),
  subject: z.string().min(3, "Subject is too short").max(255),
  message: z.string().min(10, "Message is too short").max(4000),
});

type ContactValues = z.infer<typeof ContactSchema>;

/* --------------------------- API helper ---------------------------- */

async function postContact(body: ContactValues) {
  const res = await fetch("/api/contact", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `HTTP ${res.status}`);
  }
  return data;
}

/* ------------------------------ Page ------------------------------- */

export default function ContactPage() {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<ContactValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
      topic: "general",
      subject: "",
      message: "",
    },
    mode: "onTouched",
  });

  async function onSubmit(values: ContactValues) {
    setLoading(true);
    try {
      await postContact(values);
      toast.success("Thanks! We’ve received your message.");
      form.reset({ ...values, subject: "", message: "" });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to send message");
    } finally {
      setLoading(false);
    }
  }

  const isDisabled =
    loading || !form.formState.isDirty || !form.formState.isValid;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Badge variant="outline" className="w-fit gap-2">
            <MessageCircle className="h-3.5 w-3.5 text-primary" />
            Contact
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Get in touch with <span className="text-primary">Resumint</span>
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            Have a question, found a bug, or need help tuning your resume?
            Drop us a message and we’ll get back to you as soon as we can.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 text-sm text-muted-foreground md:items-end">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-500" />
            <span>Typical response time: under 24 hours</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-sky-500" />
            <span>support@resumint.app</span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6 lg:flex-row">
        {/* Left: Contact form */}
        <div className="flex-1 min-w-0">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                Fill out the form and we’ll follow up in your inbox.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
                noValidate
                aria-busy={loading}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      {...form.register("name")}
                      disabled={loading}
                      aria-invalid={!!form.formState.errors.name}
                    />
                    {form.formState.errors.name && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      {...form.register("email")}
                      disabled={loading}
                      aria-invalid={!!form.formState.errors.email}
                    />
                    {form.formState.errors.email && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Topic + Subject */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Topic</Label>
                    <Select
                      value={form.watch("topic")}
                      onValueChange={(v) =>
                        form.setValue("topic", v as ContactValues["topic"], {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General question</SelectItem>
                        <SelectItem value="support">Account / support</SelectItem>
                        <SelectItem value="bug">Bug report</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="feedback">Feedback / idea</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.topic && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.topic.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Short summary"
                      {...form.register("subject")}
                      disabled={loading}
                      aria-invalid={!!form.formState.errors.subject}
                    />
                    {form.formState.errors.subject && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.subject.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder="Share as much detail as you can so we can help faster."
                    {...form.register("message")}
                    disabled={loading}
                    aria-invalid={!!form.formState.errors.message}
                  />
                  {form.formState.errors.message && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.message.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">
                    By submitting, you agree we can contact you about this
                    request.
                  </p>
                  <Button type="submit" disabled={isDisabled} className="min-w-[140px]">
                    {loading ? (
                      <>
                        <Send className="mr-2 h-4 w-4 animate-pulse" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right: Contact info / quick help */}
        <aside className="w-full shrink-0 space-y-4 lg:w-80">
          <Card>
            <CardHeader>
              <CardTitle>Other ways to reach us</CardTitle>
              <CardDescription>
                Prefer not to use the form? No problem.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-sky-500" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-xs text-muted-foreground">
                    support@resumint.app
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">Live support</p>
                  <p className="text-xs text-muted-foreground">
                    Coming soon: in-app chat for quick questions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-emerald-500" />
                <div>
                  <p className="font-medium">Hours</p>
                  <p className="text-xs text-muted-foreground">
                    Monday–Friday, 10:00–18:00 (IST)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-amber-500" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-xs text-muted-foreground">
                    Remote-first, serving users worldwide.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need quick answers?</CardTitle>
              <CardDescription>
                These links solve most common questions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <ul className="space-y-2">
                <li className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    Help with ATS score
                  </span>
                  <Button variant="ghost" size="sm" asChild className="px-2">
                    <Link href="/dashboard/ats">
                      Open ATS tool
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    Manage your account
                  </span>
                  <Button variant="ghost" size="sm" asChild className="px-2">
                    <Link href="/dashboard/settings">
                      Open settings
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </li>
              </ul>

              <Separator className="my-2" />

              <p className="text-xs text-muted-foreground">
                For security issues, please mention “Security” in your subject
                line so we can prioritize your request.
              </p>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}
