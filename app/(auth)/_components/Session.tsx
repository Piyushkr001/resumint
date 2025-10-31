"use client";

import * as React from "react";
import useSWR, { mutate as globalMutate } from "swr";

export type Me = {
  id: string;
  name: string | null;
  email: string;
  imageUrl?: string | null;
  role?: "user" | "admin";
} | null;

const fetcher = (url: string) =>
  fetch(url, { credentials: "include", cache: "no-store" })
    .then(async (r) => (r.ok ? r.json() : { user: null }))
    .catch(() => ({ user: null }));

type Ctx = {
  user: Me;
  loading: boolean;
  setUser: (u: Me) => void;   // <- lets you flip immediately after login
  refresh: () => Promise<void>;
};
const AuthCtx = React.createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, mutate } = useSWR("/api/auth/me", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });
  const [user, setUserState] = React.useState<Me>(data?.user ?? null);

  // sync when /api/auth/me changes
  React.useEffect(() => {
    setUserState(data?.user ?? null);
  }, [data?.user]);

  const setUser = React.useCallback(
    (u: Me) => {
      setUserState(u);
      // Optimistic SWR cache update so other consumers see it too
      mutate({ user: u }, false);
      // also poke any consumers not using context but hitting SWR directly
      globalMutate("/api/auth/me", { user: u }, false);
    },
    [mutate]
  );

  const refresh = React.useCallback(async () => {
    await mutate(); // refetch /api/auth/me
  }, [mutate]);

  return (
    <AuthCtx.Provider value={{ user, loading: isLoading, setUser, refresh }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider />");
  return ctx;
}

// Optional: helper if you still want a window event
export function notifyAuthChanged() {
  globalMutate("/api/auth/me");
  window.dispatchEvent(new Event("auth:changed"));
}
