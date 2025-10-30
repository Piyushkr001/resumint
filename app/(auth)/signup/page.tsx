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
  Eye, EyeOff, Loader2, Mail, Lock, User as UserIcon, Check, X, Sparkles,
} from "lucide-react";

import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import GoogleSignIn from "../_components/GoogleSignIn";

/* ---------------- Validation schema ---------------- */
const passwordRules = z
  .string()
  .min(8, "At least 8 characters")
  .refine((v) => /[A-Za-z]/.test(v), { message: "Include at least one letter" })
  .refine((v) => /\d/.test(v), { message: "Include at least one number" });

const SignupSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: passwordRules,
  confirm: z.string(),
  accept: z.boolean(),
})
.refine((data) => data.password === data.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
})
.refine((data) => data.accept === true, {
  message: "You must accept the Terms",
  path: ["accept"],
});

type SignupValues = z.infer<typeof SignupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [showPwd, setShowPwd] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const form = useForm<SignupValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: { name: "", email: "", password: "", confirm: "", accept: true },
    mode: "onTouched",
  });

  const pwd = form.watch("password");
  const isSubmitDisabled =
    loading || !form.formState.isDirty || !form.formState.isValid;

  function strengthLabel(p: string) {
    const score = (p.length >= 8 ? 1 : 0) + (/[A-Za-z]/.test(p) ? 1 : 0) + (/\d/.test(p) ? 1 : 0);
    if (score >= 3) return { label: "Strong", className: "text-emerald-600" };
    if (score === 2) return { label: "Medium", className: "text-amber-600" };
    if (score === 1) return { label: "Weak", className: "text-red-600" };
    return { label: "", className: "" };
  }
  const strength = strengthLabel(pwd);

  async function onSubmit(values: SignupValues) {
    setLoading(true);
    try {
      const promise = axios.post(
        "/api/auth/signup",
        { name: values.name, email: values.email, password: values.password },
        { withCredentials: true }
      );

      await toast.promise(promise, {
        loading: "Creating your account…",
        success: "Account created!",
        error: (err) =>
          err?.response?.data?.error ||
          err?.message ||
          "Signup failed. Please try again.",
      });

      router.push("/dashboard");
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error as string | undefined;
      if (status === 409 || msg?.toLowerCase().includes("email")) {
        form.setError("email", { message: msg || "This email is already in use" });
      } else {
        toast.error(msg || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-svh grid-cols-1 bg-background text-foreground lg:grid-cols-2">
      {/* Left: Form */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-3">
            {/* light/dark logos */}
            <Image
              src="/Images/Logo/logo.svg"
              alt="Resumint"
              width={180}
              height={180}
              className="block dark:hidden"
              priority
            />
            <Image
              src="/Images/Logo/logo-dark.svg"
              alt="Resumint"
              width={180}
              height={180}
              className="hidden dark:block"
              priority
            />
          </div>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-2xl">Create your account</CardTitle>
              <CardDescription>Start building your ATS-ready resume in minutes.</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4" aria-busy={loading}>
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <div className="relative">
                    <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Jane Doe"
                      autoComplete="name"
                      {...form.register("name")}
                      className="pl-9"
                      aria-invalid={!!form.formState.errors.name}
                      aria-describedby="name-error"
                      disabled={loading}
                    />
                  </div>
                  {form.formState.errors.name && (
                    <p id="name-error" className="text-sm text-destructive">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoCapitalize="none"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...form.register("email")}
                      className="pl-9"
                      aria-invalid={!!form.formState.errors.email}
                      aria-describedby="email-error"
                      disabled={loading}
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p id="email-error" className="text-sm text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPwd ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      {...form.register("password")}
                      className="pl-9 pr-10"
                      aria-invalid={!!form.formState.errors.password}
                      aria-describedby="password-error"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:text-foreground"
                      aria-label={showPwd ? "Hide password" : "Show password"}
                      disabled={loading}
                    >
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {form.formState.errors.password ? (
                    <p id="password-error" className="text-sm text-destructive">
                      {form.formState.errors.password.message}
                    </p>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Password strength:{" "}
                        <span className={strength.className}>{strength.label}</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="flex items-center gap-1">
                          {pwd.length >= 8 ? <Check className="h-3 w-3 text-emerald-600" /> : <X className="h-3 w-3 text-muted-foreground" />}
                          8+
                        </span>
                        <span className="flex items-center gap-1">
                          {/[A-Za-z]/.test(pwd) ? <Check className="h-3 w-3 text-emerald-600" /> : <X className="h-3 w-3 text-muted-foreground" />}
                          letter
                        </span>
                        <span className="flex items-center gap-1">
                          {/\d/.test(pwd) ? <Check className="h-3 w-3 text-emerald-600" /> : <X className="h-3 w-3 text-muted-foreground" />}
                          number
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirm"
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      {...form.register("confirm")}
                      className="pl-9 pr-10"
                      aria-invalid={!!form.formState.errors.confirm}
                      aria-describedby="confirm-error"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:text-foreground"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                      disabled={loading}
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {form.formState.errors.confirm && (
                    <p id="confirm-error" className="text-sm text-destructive">
                      {form.formState.errors.confirm.message}
                    </p>
                  )}
                </div>

                {/* Accept Terms */}
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="accept" className="flex items-center gap-2 text-sm">
                    <Checkbox
                      id="accept"
                      checked={form.watch("accept")}
                      onCheckedChange={(v) =>
                        form.setValue("accept", Boolean(v), {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      disabled={loading}
                    />
                    <span className="text-muted-foreground">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary underline-offset-4 hover:underline">Terms</Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">Privacy Policy</Link>
                    </span>
                  </label>
                </div>
                {form.formState.errors.accept && (
                  <p className="text-sm text-destructive">{form.formState.errors.accept.message}</p>
                )}

                {/* Submit */}
                <Button className="w-full" type="submit" disabled={isSubmitDisabled}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Create account
                </Button>
              </form>

              {/* OAuth */}
              <div className="relative py-3">
                <Separator />
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                  or sign up with
                </span>
              </div>

              {/* Official Google button via @react-oauth/google */}
              <GoogleSignIn />
            </CardContent>

            <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Already have an account?{" "}
                <Link href="/login" className="text-primary underline-offset-4 hover:underline">Log in</Link>
              </span>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Right: Visual (hidden on small, shows on lg) */}
      <div className="relative hidden overflow-hidden border-l border-border bg-muted/30 lg:block">
        <div
          className="pointer-events-none absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(16,185,129,.25), transparent)" }}
        />
        <div className="absolute inset-0 grid place-items-center p-10">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border bg-background shadow-sm">
            <div className="relative aspect-[16/10] w-full">
              <Image
                src="/Images/hero-preview.jpg"
                alt="Resumint preview"
                fill
                sizes="(min-width: 1024px) 640px, 100vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute right-4 top-4 rounded-full border bg-background/80 px-3 py-1 text-sm shadow-sm backdrop-blur">
              ATS Score: <span className="font-semibold text-emerald-600">92</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
