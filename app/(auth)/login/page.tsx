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
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight } from "lucide-react";

import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import GoogleSignIn from "../_components/GoogleSignIn";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
  remember: z.boolean().optional(),
});
type LoginValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPwd, setShowPwd] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "", remember: true },
    mode: "onTouched",
  });

  // Prefill remembered email (optional)
  React.useEffect(() => {
    const remembered = localStorage.getItem("resumint:rememberEmail");
    if (remembered) form.setValue("email", remembered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(values: LoginValues) {
    setLoading(true);
    try {
      if (values.remember) localStorage.setItem("resumint:rememberEmail", values.email);
      else localStorage.removeItem("resumint:rememberEmail");

      const promise = axios.post(
        "/api/auth/login",
        { email: values.email, password: values.password },
        { withCredentials: true }
      );

      await toast.promise(promise, {
        loading: "Signing you in…",
        success: "Welcome back!",
        error: (err) =>
          err?.response?.data?.error || err?.message || "Login failed. Please try again.",
      });

      router.push("/dashboard");
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

  return (
    <main className="grid min-h-svh grid-cols-1 bg-background text-foreground lg:grid-cols-2">
      {/* Left: Form */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-3">
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
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in to continue building your ATS-ready resume.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
                className="space-y-4"
                aria-busy={loading}
              >
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
                      autoComplete="current-password"
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
                  {form.formState.errors.password && (
                    <p id="password-error" className="text-sm text-destructive">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember / Forgot */}
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="remember" className="flex items-center gap-2 text-sm">
                    <Checkbox
                      id="remember"
                      checked={form.watch("remember")}
                      onCheckedChange={(v) =>
                        form.setValue("remember", Boolean(v), { shouldDirty: true })
                      }
                      disabled={loading}
                    />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <Link
                    href="/forgot"
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <Button className="w-full" type="submit" disabled={isSubmitDisabled}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="mr-2 h-4 w-4" />
                  )}
                  Sign in
                </Button>
              </form>

              {/* OAuth */}
              <div className="relative py-3">
                <Separator />
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                  or continue with
                </span>
              </div>

              {/* Official Google button via @react-oauth/google */}
              <GoogleSignIn />
            </CardContent>

            <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="block">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
                  Sign up
                </Link>
              </span>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Right: Visual (hidden on small, shows on lg) */}
      <div className="relative hidden overflow-hidden border-l border-border bg-muted/30 lg:block">
        <div
          className="pointer-events-none absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(16,185,129,.25), transparent)",
          }}
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
