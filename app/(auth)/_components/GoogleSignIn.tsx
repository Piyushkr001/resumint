"use client";

import { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function GoogleSignIn() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleSuccess(cred: CredentialResponse) {
    if (!cred.credential) return toast.error("Missing Google credential");
    if (busy) return;
    setBusy(true);
    try {
      await toast.promise(
        axios.post("/api/auth/google-credential", { credential: cred.credential }, { withCredentials: true }),
        { loading: "Signing you in…", success: "Signed in with Google", error: (e) => e?.response?.data?.error || "Google sign-in failed" }
      );
      // 🔔 update Navbar immediately
      window.dispatchEvent(new Event("auth:changed"));
      router.replace("/dashboard");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative w-full">
      {busy && <div className="absolute inset-0 z-10 cursor-wait rounded-md bg-background/40 backdrop-blur-sm" />}
      <div className="flex w-full justify-center">
        <GoogleLogin onSuccess={handleSuccess} onError={() => toast.error("Google auth cancelled or failed")} text="continue_with" shape="pill" theme="outline" width="320" />
      </div>
    </div>
  );
}
