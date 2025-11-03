"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Mail,
  Lock,
  KeyRound,
  ArrowRight,
  Loader2,
  ArrowLeft,
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

const passwordRules = z
  .string()
  .min(8, "At least 8 characters")
  .refine((v) => /[A-Za-z]/.test(v), {
    message: "Include at least one letter",
  })
  .refine((v) => /\d/.test(v), { message: "Include at least one number" });

const ResetSchema = z
  .object({
    email: z.string().email("Enter a valid email"),
    code: z
      .string()
      .min(4, "Enter the verification code")
      .max(10, "Too long"),
    newPassword: passwordRules,
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetValues = z.infer<typeof ResetSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";

  const [loading, setLoading] = React.useState(false);
  const [resending, setResending] = React.useState(false);

  const form = useForm<ResetValues>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: emailFromQuery,
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  async function onSubmit(values: ResetValues) {
    setLoading(true);
    try {
      await toast.promise(
        axios.post(
          "/api/auth/reset-password", // <-- your API to verify OTP + reset password
          {
            email: values.email,
            otp: values.code,
            newPassword: values.newPassword,
          },
          { withCredentials: true },
        ),
        {
          loading: "Resetting your password…",
          success: "Password updated! You can now log in.",
          error: (e) =>
            e?.response?.data?.error || "Could not reset password",
        },
      );

      router.replace("/login");
    } catch (err: any) {
      const msg: string =
        err?.response?.data?.error || "Invalid code or email";
      if (msg.toLowerCase().includes("code")) {
        form.setError("code", { message: msg });
      } else if (msg.toLowerCase().includes("email")) {
        form.setError("email", { message: msg });
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    const email = form.getValues("email");
    if (!email) {
      form.setError("email", { message: "Enter your email first" });
      return;
    }
    setResending(true);
    try {
      await toast.promise(
        axios.post(
          "/api/auth/forgot", // reuse same endpoint
          { email },
          { withCredentials: true },
        ),
        {
          loading: "Resending code…",
          success: "New code sent to your email",
          error: (e) =>
            e?.response?.data?.error || "Could not resend code",
        },
      );
    } finally {
      setResending(false);
    }
  }

  const isSubmitDisabled =
    loading || !form.formState.isDirty || !form.formState.isValid;

  return (
    <main className="grid min-h-svh grid-cols-1 bg-background text-foreground lg:grid-cols-2">
      {/* Left: form */}
      <section className="flex flex-col justify-center px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          {/* Brand header + back link */}
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
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

            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs sm:text-sm"
              type="button"
              onClick={() => router.push("/login")}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to login
            </Button>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Reset password
              </CardTitle>
              <CardDescription>
                Enter the code we sent to your email and choose a new
                password.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
                aria-busy={loading}
                className="space-y-4"
              >
                {/* Email */}
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2 rounded-md border px-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
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

                {/* Verification code */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="code">Verification code</Label>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resending || loading}
                      className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {resending ? "Resending…" : "Resend code"}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border px-3">
                    <KeyRound className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="code"
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="6-digit code"
                      {...form.register("code")}
                      className="border-0 px-0 shadow-none focus-visible:ring-0 tracking-[0.2em]"
                      aria-invalid={!!form.formState.errors.code}
                      aria-describedby="code-error"
                      disabled={loading}
                    />
                  </div>
                  {form.formState.errors.code && (
                    <p
                      id="code-error"
                      className="mt-1 text-xs text-destructive"
                    >
                      {form.formState.errors.code.message}
                    </p>
                  )}
                </div>

                {/* New password */}
                <div className="space-y-3">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <Label htmlFor="newPassword">New password</Label>
                      <div className="flex items-center gap-2 rounded-md border px-3">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="newPassword"
                          type="password"
                          autoComplete="new-password"
                          placeholder="••••••••"
                          {...form.register("newPassword")}
                          className="border-0 px-0 shadow-none focus-visible:ring-0"
                          aria-invalid={!!form.formState.errors.newPassword}
                          aria-describedby="newPassword-error"
                          disabled={loading}
                        />
                      </div>
                      {form.formState.errors.newPassword && (
                        <p
                          id="newPassword-error"
                          className="mt-1 text-xs text-destructive"
                        >
                          {form.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="confirmPassword">
                        Confirm password
                      </Label>
                      <div className="flex items-center gap-2 rounded-md border px-3">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          autoComplete="new-password"
                          placeholder="••••••••"
                          {...form.register("confirmPassword")}
                          className="border-0 px-0 shadow-none focus-visible:ring-0"
                          aria-invalid={
                            !!form.formState.errors.confirmPassword
                          }
                          aria-describedby="confirmPassword-error"
                          disabled={loading}
                        />
                      </div>
                      {form.formState.errors.confirmPassword && (
                        <p
                          id="confirmPassword-error"
                          className="mt-1 text-xs text-destructive"
                        >
                          {
                            form.formState.errors.confirmPassword
                              .message
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Use at least 8 characters including a letter and a
                    number. Avoid reusing old passwords.
                  </p>
                </div>

                <Button
                  className="w-full"
                  type="submit"
                  disabled={isSubmitDisabled}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating password…
                    </>
                  ) : (
                    <>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Reset password
                    </>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
              <span>
                Didn&apos;t receive an email? Check spam or{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || loading}
                  className="font-medium text-primary underline-offset-4 hover:underline disabled:opacity-60"
                >
                  resend code
                </button>
                .
              </span>
              <Link
                href="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Back to login
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Right: hero */}
      <section className="relative hidden items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.25),transparent_55%),radial-gradient(circle_at_bottom,rgba(56,189,248,0.22),transparent_55%)]" />
        <div className="relative z-10 mx-auto flex max-w-md flex-col gap-6 px-8 text-slate-50">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-slate-700/70 backdrop-blur">
            <KeyRound className="h-3.5 w-3.5 text-emerald-400" />
            <span>Reset your password securely</span>
          </div>

          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            A fresh start
            <br />
            <span className="text-sky-300">without losing your progress.</span>
          </h2>

          <p className="text-sm text-slate-200/80">
            Once your password is updated, you can immediately access your
            resumes, ATS scores, and analytics — no data loss, just a more
            secure account.
          </p>

          <ul className="space-y-2 text-sm text-slate-100">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              OTP-based verification for extra safety
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              Works with existing email login
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              No changes to your resume content
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
