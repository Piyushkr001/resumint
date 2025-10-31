"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AlreadyToast() {
  const sp = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (sp.get("already") === "1") {
      toast.success("Already logged in");
      const url = new URL(window.location.href);
      url.searchParams.delete("already");
      router.replace(url.pathname + (url.search ? "?" + url.search : ""));
    }
  }, [sp, router]);

  return null;
}
