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
import { Eye, EyeOff, Loader2, Mail, Lock, User as UserIcon, Check, X, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import GoogleSignIn from "../_components/GoogleSignIn";

const passwordRules = z.string().min(8, "At least 8 characters")
  .refine(v => /[A-Za-z]/.test(v), { message: "Include at least one letter" })
  .refine(v => /\d/.test(v), { message: "Include at least one number" });

const SignupSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: passwordRules,
  confirm: z.string(),
  accept: z.boolean(),
}).refine(d => d.password === d.confirm, { message: "Passwords do not match", path: ["confirm"] })
  .refine(d => d.accept === true, { message: "You must accept the Terms", path: ["accept"] });

type SignupValues = z.infer<typeof SignupSchema>;

export default function SignupClient() {
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
  const strength = (() => {
    const score = (pwd.length >= 8 ? 1 : 0) + (/[A-Za-z]/.test(pwd) ? 1 : 0) + (/\d/.test(pwd) ? 1 : 0);
    if (score >= 3) return { label: "Strong", className: "text-emerald-600" };
    if (score === 2) return { label: "Medium", className: "text-amber-600" };
    if (score === 1) return { label: "Weak", className: "text-red-600" };
    return { label: "", className: "" };
  })();

  async function onSubmit(values: SignupValues) {
    setLoading(true);
    try {
      await toast.promise(
        axios.post("/api/auth/signup", { name: values.name, email: values.email, password: values.password }, { withCredentials: true }),
        { loading: "Creating your account…", success: "Account created!", error: (e) => e?.response?.data?.error || "Signup failed" }
      );
      // 🔔 tell Navbar to re-fetch immediately
      window.dispatchEvent(new Event("auth:changed"));
      router.replace("/dashboard");
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

  const isSubmitDisabled = loading || !form.formState.isDirty || !form.formState.isValid;

  return (
    <main className="grid min-h-svh grid-cols-1 bg-background text-foreground lg:grid-cols-2">
      {/* left form… keep your JSX; identical to what you had, just using onSubmit above */}
      {/* right visual… keep as-is */}
      {/* (Use your existing markup from your last message; omitted here for brevity) */}
    </main>
  );
}
