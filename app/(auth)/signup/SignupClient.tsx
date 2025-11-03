// app/(auth)/signup/SignupClient.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User as UserIcon,
  Check,
  X,
  Sparkles,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

import GoogleSignIn from "../_components/GoogleSignIn";

/* -------------------------- Validation Schema -------------------------- */

const passwordRules = z
  .string()
  .min(8, "At least 8 characters")
  .refine((v) => /[A-Za-z]/.test(v), {
    message: "Include at least one letter",
  })
  .refine((v) => /\d/.test(v), {
    message: "Include at least one number",
  });

const SignupSchema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email"),
    password: passwordRules,
    confirm: z.string(),
    accept: z.boolean(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })
  .refine((d) => d.accept === true, {
    message: "You must accept the Terms",
    path: ["accept"],
  });

type SignupValues = z.infer<typeof SignupSchema>;

/* ------------------------------- Component ------------------------------ */

export default function SignupClient() {
  const router = useRouter();
  const [showPwd, setShowPwd] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const form = useForm<SignupValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
      accept: true,
    },
    mode: "onTouched",
  });

  const pwd = form.watch("password");
  const strength = (() => {
    const score =
      (pwd.length >= 8 ? 1 : 0) +
      (/[A-Za-z]/.test(pwd) ? 1 : 0) +
      (/\d/.test(pwd) ? 1 : 0);

    if (score >= 3) return { label: "Strong", className: "text-emerald-600" };
    if (score === 2) return { label: "Medium", className: "text-amber-600" };
    if (score === 1) return { label: "Weak", className: "text-red-600" };
    return { label: "", className: "" };
  })();

  async function onSubmit(values: SignupValues) {
    setLoading(true);
    try {
      await toast.promise(
        axios.post(
          "/api/auth/signup",
          {
            name: values.name,
            email: values.email,
            password: values.password,
          },
          { withCredentials: true },
        ),
        {
          loading: "Creating your account…",
          success: "Account created!",
          error: (e: any) =>
            e?.response?.data?.error || "Signup failed, please try again",
        },
      );

      // let Navbar / AuthProvider know auth state changed
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:changed"));
      }

      router.replace("/dashboard");
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error as string | undefined;
      if (status === 409 || msg?.toLowerCase().includes("email")) {
        form.setError("email", {
          message: msg || "This email is already in use",
        });
      } else {
        toast.error(msg || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  const isSubmitDisabled =
    loading || !form.formState.isDirty || !form.formState.isValid;

  /* --------------------------------- UI --------------------------------- */

  return (
    <main className="grid min-h-svh grid-cols-1 bg-background text-foreground lg:grid-cols-2">
      {/* Left: form */}
      <section className="flex flex-col justify-center px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          {/* Logo / Brand */}
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
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Create your account
              </CardTitle>
              <CardDescription>
                Start optimizing your resume for modern ATS systems.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                {/* Name */}
                <div className="space-y-1">
                  <Label htmlFor="name">Full name</Label>
                  <div className="flex items-center gap-2 rounded-md border px-3">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Piyush Kumar"
                      {...form.register("name")}
                      className="border-0 px-0 shadow-none focus-visible:ring-0"
                    />
                  </div>
                  {form.formState.errors.name && (
                    <p className="mt-1 text-xs text-red-600">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2 rounded-md border px-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      {...form.register("email")}
                      className="border-0 px-0 shadow-none focus-visible:ring-0"
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="mt-1 text-xs text-red-600">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex items-center gap-2 rounded-md border px-3">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPwd ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      {...form.register("password")}
                      className="border-0 px-0 shadow-none focus-visible:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((p) => !p)}
                      className="rounded p-1 text-muted-foreground hover:bg-muted"
                    >
                      {showPwd ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {strength.label && (
                    <p className={`mt-1 text-xs ${strength.className}`}>
                      Password strength: {strength.label}
                    </p>
                  )}
                  {form.formState.errors.password && (
                    <p className="mt-1 text-xs text-red-600">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <Label htmlFor="confirm">Confirm password</Label>
                  <div className="flex items-center gap-2 rounded-md border px-3">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      {...form.register("confirm")}
                      className="border-0 px-0 shadow-none focus-visible:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      className="rounded p-1 text-muted-foreground hover:bg-muted"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.confirm && (
                    <p className="mt-1 text-xs text-red-600">
                      {form.formState.errors.confirm.message}
                    </p>
                  )}
                </div>

                {/* Password rules checklist */}
                <div className="space-y-1 rounded-md bg-muted/60 p-3 text-xs">
                  <p className="mb-1 font-medium text-muted-foreground">
                    Password must include:
                  </p>
                  <ul className="space-y-1">
                    <RuleItem satisfied={pwd.length >= 8}>
                      At least 8 characters
                    </RuleItem>
                    <RuleItem satisfied={/[A-Za-z]/.test(pwd)}>
                      At least one letter
                    </RuleItem>
                    <RuleItem satisfied={/\d/.test(pwd)}>
                      At least one number
                    </RuleItem>
                  </ul>
                </div>

                {/* Accept terms */}
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="accept"
                    checked={form.watch("accept")}
                    onCheckedChange={(v) =>
                      form.setValue("accept", v === true, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />
                  <div className="space-y-0.5 text-xs leading-snug">
                    <Label htmlFor="accept">
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="underline underline-offset-2"
                      >
                        Terms
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="underline underline-offset-2"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </Label>
                    {form.formState.errors.accept && (
                      <p className="text-xs text-red-600">
                        {form.formState.errors.accept.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="mt-1 w-full"
                  disabled={isSubmitDisabled}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </form>

              {/* Or with Google */}
              <Separator className="my-4" />
              <div className="flex flex-col gap-3">
                <GoogleSignIn />
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Log in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Right: illustration / marketing panel */}
      <section className="relative hidden items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.25),transparent_55%),radial-gradient(circle_at_bottom,rgba(56,189,248,0.22),transparent_55%)]" />
        <div className="relative z-10 mx-auto flex max-w-md flex-col gap-6 px-8 text-slate-50">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-slate-700/70 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>ATS-optimized templates • One-click export</span>
          </div>
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            Stand out to recruiters.
            <br />
            <span className="text-sky-300">Beat the bots.</span>
          </h2>
          <p className="text-sm text-slate-200/80">
            Resumint analyzes your resume against real job descriptions, surfaces
            missing keywords, and helps you tailor each application in minutes.
          </p>

          <ul className="space-y-2 text-sm text-slate-100">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              Real-time ATS match scoring
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              Beautiful, recruiter-friendly templates
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              Export to PDF with one click
            </li>
          </ul>

          <div className="mt-4 flex items-center gap-3 text-xs text-slate-300/80">
            <div className="flex -space-x-2">
              <div className="h-7 w-7 rounded-full border border-slate-700 bg-slate-600/70" />
              <div className="h-7 w-7 rounded-full border border-slate-700 bg-slate-500/70" />
              <div className="h-7 w-7 rounded-full border border-slate-700 bg-slate-400/70" />
            </div>
            <span>Join candidates who already upgraded their resume.</span>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------------------------- Small subcomponent ---------------------------- */

function RuleItem({
  satisfied,
  children,
}: {
  satisfied: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full border text-[10px] ${
          satisfied
            ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
            : "border-slate-400/60 bg-transparent text-slate-400"
        }`}
      >
        {satisfied ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      </span>
      <span className={satisfied ? "text-emerald-700 text-xs" : "text-xs"}>
        {children}
      </span>
    </li>
  );
}
