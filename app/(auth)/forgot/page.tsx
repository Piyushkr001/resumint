"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Mail,
  ArrowRight,
  Loader2,
  Sparkles,
  Check,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const ForgotSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type ForgotValues = z.infer<typeof ForgotSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<ForgotValues>({
    resolver: zodResolver(ForgotSchema),
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  async function onSubmit(values: ForgotValues) {
    setLoading(true);
    try {
      await toast.promise(
        axios.post(
          "/api/auth/forgot", // <-- your API to send OTP
          { email: values.email },
          { withCredentials: true },
        ),
        {
          loading: "Sending verification code…",
          success: "Code sent! Check your email.",
          error: (e) =>
            e?.response?.data?.error || "Could not send reset code",
        },
      );

      router.push(`/reset?email=${encodeURIComponent(values.email)}`);
    } catch (err: any) {
      form.setError("email", {
        message:
          err?.response?.data?.error ||
          "We couldn't find an account with that email",
      });
    } finally {
      setLoading(false);
    }
  }

  const isSubmitDisabled =
    loading || !form.formState.isDirty || !form.formState.isValid;

  return (
    <main className="grid min-h-svh grid-cols-1 bg-background text-foreground lg:grid-cols-2">
      {/* Left: form */}
      <section className="flex flex-col justify-center px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          {/* Brand header */}
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-base font-semibold leading-tight">
                Resumint
              </p>
              <p className="text-xs text-muted-foreground">
                ATS-ready resumes in minutes
              </p>
            </div>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Forgot password?
              </CardTitle>
              <CardDescription>
                Enter your account email and we&apos;ll send you a one-time
                verification code to reset your password.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
                aria-busy={loading}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2 rounded-md border px-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoCapitalize="none"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...form.register("email")}
                      className="border-0 px-0 shadow-none focus-visible:ring-0"
                      aria-invalid={!!form.formState.errors.email}
                      aria-describedby="email-error"
                      disabled={loading}
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p
                      id="email-error"
                      className="mt-1 text-xs text-destructive"
                    >
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  className="w-full"
                  type="submit"
                  disabled={isSubmitDisabled}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending code…
                    </>
                  ) : (
                    <>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Send reset code
                    </>
                  )}
                </Button>
              </form>

              <div className="rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <p>
                    We&apos;ll never share your email. The code is valid only
                    for a short time.
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
              <span>
                Remembered your password?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Back to login
                </Link>
              </span>
              <span>
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Sign up
                </Link>
              </span>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Right: hero */}
      <section className="relative hidden items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.25),transparent_55%),radial-gradient(circle_at_bottom,rgba(56,189,248,0.22),transparent_55%)]" />
        <div className="relative z-10 mx-auto flex max-w-md flex-col gap-6 px-8 text-slate-50">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-slate-700/70 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Secure account recovery</span>
          </div>

          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            Lost access to your resume?
            <br />
            <span className="text-sky-300">We&apos;ll get you back in.</span>
          </h2>

          <p className="text-sm text-slate-200/80">
            Use your email to verify that it&apos;s really you. We&apos;ll send
            a one-time code so you can safely reset your password and continue
            optimizing your ATS scores.
          </p>

          <ul className="space-y-2 text-sm text-slate-100">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              One-time verification code via email
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              No changes to your resumes or ATS history
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              Fully encrypted authentication
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
