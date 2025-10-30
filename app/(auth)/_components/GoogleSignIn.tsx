"use client";

import { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {
  text?: "continue_with" | "signin_with" | "signup_with" | "signin";
  width?: number; // px
  debug?: boolean; // logs aud/iss in dev for quick 401 diagnosis
};

function parseJwtPayload(jwt: string) {
  try {
    const base64 = jwt.split(".")[1]?.replace(/-/g, "+").replace(/_/g, "/") ?? "";
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json) as { aud?: string | string[]; iss?: string; email?: string };
  } catch {
    return {};
  }
}

export default function GoogleSignIn({ text = "continue_with", width = 320, debug = false }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleSuccess(cred: CredentialResponse) {
    if (!cred.credential) {
      toast.error("Missing Google credential");
      return;
    }

    // Optional: debug token claims to quickly spot audience mismatches
    if (process.env.NODE_ENV !== "production" && debug) {
      const meta = parseJwtPayload(cred.credential);
      // eslint-disable-next-line no-console
      console.log("[GoogleSignIn] jwt meta:", meta);
    }

    if (busy) return;
    setBusy(true);
    try {
      const req = axios.post(
        "/api/auth/google-credential",
        { credential: cred.credential },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
          timeout: 15000,
        }
      );

      await toast.promise(req, {
        loading: "Signing you in…",
        success: "Signed in with Google",
        error: (err) => err?.response?.data?.error || "Google sign-in failed",
      });

      router.push("/dashboard");
    } catch {
      // error surfaced by toast
    } finally {
      setBusy(false);
    }
  }

  function handleError() {
    if (!busy) toast.error("Google auth cancelled or failed");
  }

  return (
    <div className="relative w-full">
      {/* Optional overlay while busy (can’t truly disable the iframe, but we can block clicks) */}
      {busy && (
        <div className="absolute inset-0 z-10 cursor-wait rounded-md bg-background/40 backdrop-blur-sm" />
      )}
      <div className="flex w-full justify-center">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          text={text}
          theme="outline"
          shape="pill"
          width={String(width)}
          // useOneTap // enable if you want One Tap
          // logo_alignment="left"
          // size="large"
        />
      </div>
    </div>
  );
}
