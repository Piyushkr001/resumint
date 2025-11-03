// app/(auth)/login/LoginClient.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import useSWR from "swr";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  ArrowRight,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

import GoogleSignIn from "../_components/GoogleSignIn";

/* --------------------------- Validation Schema --------------------------- */

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
  remember: z.boolean().optional(),
});
type LoginValues = z.infer<typeof LoginSchema>;

/* ------------------------------- Fetch /me ------------------------------- */

const fetchMe = async () => {
  try {
    const r = await axios.get("/api/auth/me", { withCredentials: true });
    return r.data?.user ?? null;
  } catch {
    return null;
  }
};

/* -------------------------------- Component ------------------------------ */

export default function LoginClient() {
  const router = useRouter();
  const { data: me } = useSWR("me", fetchMe, { shouldRetryOnError: false });

  const [showPwd, setShowPwd] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "", remember: true },
    mode: "onTouched",
  });

  // If already logged in, redirect
  React.useEffect(() => {
    if (me) {
      toast.success("Already logged in");
      router.replace("/dashboard");
    }
  }, [me, router]);

  // Restore remembered email
  React.useEffect(() => {
    const remembered = typeof window !== "undefined"
      ? localStorage.getItem("resumint:rememberEmail")
      : null;
    if (remembered) form.setValue("email", remembered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------------ Submit logic ----------------------------- */
  // 🔥 This is unchanged – same API call & behavior as your original code
  async function onSubmit(values: LoginValues) {
    setLoading(true);
    try {
      if (values.remember) {
        localStorage.setItem("resumint:rememberEmail", values.email);
      } else {
        localStorage.removeItem("resumint:rememberEmail");
      }

      await toast.promise(
        axios.post(
          "/api/auth/login",
          { email: values.email, password: values.password },
          { withCredentials: true },
        ),
        {
          loading: "Signing you in…",
          success: "Welcome back!",
          error: (e) => e?.response?.data?.error || "Login failed",
        },
      );

      // 🔔 tell Navbar to re-fetch immediately
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:changed"));
      }
      router.replace("/dashboard");
    } catch (err: any) {
      form.setError("password", {
        message: err?.response?.data?.error || "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  }

  const isSubmitDisabled =
    loading || !form.formState.isDirty || !form.formState.isValid;

  /* --------------------------------- UI --------------------------------- */

  return (
    <main className="grid min-h-svh grid-cols-1 bg-background text-foreground lg:grid-cols-2">
      {/* Left: form section (similar style to signup) */}
      <section className="flex flex-col justify-center px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          {/* Brand header (matches signup vibe) */}
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
                Welcome back
              </CardTitle>
              <CardDescription>
                Sign in to continue optimizing your ATS-ready resumes.
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

                {/* Password */}
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex items-center gap-2 rounded-md border px-3">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPwd ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...form.register("password")}
                      className="border-0 px-0 shadow-none focus-visible:ring-0"
                      aria-invalid={!!form.formState.errors.password}
                      aria-describedby="password-error"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      className="rounded p-1 text-muted-foreground hover:bg-muted"
                      aria-label={showPwd ? "Hide password" : "Show password"}
                      disabled={loading}
                    >
                      {showPwd ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p
                      id="password-error"
                      className="mt-1 text-xs text-destructive"
                    >
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember + Forgot */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <label
                    htmlFor="remember"
                    className="flex items-center gap-2 text-xs sm:text-sm"
                  >
                    <Checkbox
                      id="remember"
                      checked={form.watch("remember")}
                      onCheckedChange={(v) =>
                        form.setValue("remember", Boolean(v), {
                          shouldDirty: true,
                        })
                      }
                      disabled={loading}
                    />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <Link
                    href="/forgot"
                    className="text-xs font-medium text-primary underline-offset-4 hover:underline sm:text-sm"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <Button
                  className="mt-1 w-full"
                  type="submit"
                  disabled={isSubmitDisabled}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing you in…
                    </>
                  ) : (
                    <>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Sign in
                    </>
                  )}
                </Button>
              </form>

              {/* OR Google */}
              <div className="relative py-3">
                <Separator />
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                  or continue with
                </span>
              </div>
              <GoogleSignIn />
            </CardContent>

            <CardFooter className="flex items-center justify-center text-sm text-muted-foreground">
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

      {/* Right: gradient hero (styled like signup) */}
      <section className="relative hidden items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.25),transparent_55%),radial-gradient(circle_at_bottom,rgba(56,189,248,0.22),transparent_55%)]" />
        <div className="relative z-10 mx-auto flex max-w-md flex-col gap-6 px-8 text-slate-50">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-slate-700/70 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Secure login • Session-based auth</span>
          </div>

          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            Pick up where you left off.
            <br />
            <span className="text-sky-300">Your resumes, always in sync.</span>
          </h2>

          <p className="text-sm text-slate-200/80">
            Log in to access your ATS scores, tailored suggestions, and saved
            templates. Keep iterating on your resume without losing your work.
          </p>

          <ul className="space-y-2 text-sm text-slate-100">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              Resume drafts synced to your account
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              Instant access to ATS analysis history
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              Continue applications across devices
            </li>
          </ul>

          <div className="mt-4 flex items-center gap-3 text-xs text-slate-300/80">
            <div className="flex -space-x-2">
              <div className="h-7 w-7 rounded-full border border-slate-700 bg-slate-600/70" />
              <div className="h-7 w-7 rounded-full border border-slate-700 bg-slate-500/70" />
              <div className="h-7 w-7 rounded-full border border-slate-700 bg-slate-400/70" />
            </div>
            <span>Join candidates improving their resumes every week.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
