"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Menu, LogOut, User as UserIcon } from "lucide-react";
import { http } from "@/lib/http";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/ModeToggle";

type Me = { id: string; name: string | null; email: string; imageUrl?: string | null; role?: "user" | "admin" };

const menuItems = [
  { title: "Home", path: "/" },
  { title: "Dashboard", path: "/dashboard" },
  { title: "Create Resume", path: "/resumes/new" },
  { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
];

const fetchMe = async (): Promise<Me | null> => {
  try { const r = await http.get("/api/auth/me"); return r.data?.user ?? null; }
  catch { return null; }
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { data: me, isLoading, mutate } = useSWR("me", fetchMe, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    shouldRetryOnError: false
  });

  const isActive = (p: string) => pathname === p;

  // If user is not logged in, clicking "Dashboard" should go to login with redirect
  const getHref = (path: string) => {
    if (path === "/dashboard" && !me) return "/login?next=/dashboard";
    return path;
  };

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => { if (e.matches) setOpen(false); };
    mql.addEventListener?.("change", handler);
    mql.addListener?.(handler);
    return () => {
      mql.removeEventListener?.("change", handler);
      mql.removeListener?.(handler);
    };
  }, []);

  useEffect(() => {
    const onAuthChanged = () => mutate();
    window.addEventListener("auth:changed", onAuthChanged);
    return () => window.removeEventListener("auth:changed", onAuthChanged);
  }, [mutate]);

  async function onLogout() {
    try { await http.post("/api/auth/logout"); }
    finally {
      await mutate(null, { revalidate: false });
      router.push("/");
      window.dispatchEvent(new Event("auth:changed"));
    }
  }

  return (
    <div className="sticky top-0 z-50 rounded-full border-b border-border bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 text-foreground">
        <Link href="/" className="flex items-center gap-2" aria-label="Resumint Home">
          <Image className="block dark:hidden" src="/Images/Logo/logo.svg" alt="Resumint" width={180} height={180} priority />
          <Image className="hidden dark:block" src="/Images/Logo/logo-dark.svg" alt="Resumint" width={180} height={180} priority />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              asChild
              variant="ghost"
              size="sm"
              className={`px-3 ${isActive(item.path) ? "bg-muted font-medium" : ""}`}
            >
              <Link
                href={getHref(item.path)}
                aria-current={isActive(item.path) ? "page" : undefined}
              >
                {item.title}
              </Link>
            </Button>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-2">
          <ModeToggle />
          {isLoading ? (
            <Button variant="ghost" size="sm" disabled className="px-3">…</Button>
          ) : me ? (
            <>
              <Button asChild variant="ghost" size="sm" className="px-2">
                <Link href="/dashboard" aria-label="Account">
                  {me.imageUrl
                    ? <img src={me.imageUrl} alt={me.name ?? me.email} className="h-5 w-5 rounded-full" />
                    : <UserIcon className="h-4 w-4" />}
                  <span className="ml-2 hidden sm:inline max-w-40 truncate">{me.name ?? me.email}</span>
                </Link>
              </Button>
              <Button size="sm" variant="outline" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant={isActive("/login") ? "secondary" : "ghost"} size="sm">
                <Link href="/login" aria-current={isActive("/login") ? "page" : undefined}>Login</Link>
              </Button>
              <Button asChild size="sm" className="px-4">
                <Link href="/signup" aria-current={isActive("/signup") ? "page" : undefined}>Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-80 bg-background/95 text-foreground backdrop-blur supports-backdrop-filter:bg-background/85">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Image className="block dark:hidden" src="/Images/Logo/logo.svg" alt="Resumint" width={120} height={120} />
                  <Image className="hidden dark:block" src="/Images/Logo/logo-dark.svg" alt="Resumint" width={120} height={120} />
                </SheetTitle>
              </SheetHeader>

              <Separator className="my-4" />

              <nav className="grid gap-1">
                {menuItems.map((item) => (
                  <SheetClose asChild key={item.path}>
                    <Button
                      asChild
                      variant={isActive(item.path) ? "secondary" : "ghost"}
                      className="justify-start"
                    >
                      <Link
                        href={getHref(item.path)}
                        aria-current={isActive(item.path) ? "page" : undefined}
                      >
                        {item.title}
                      </Link>
                    </Button>
                  </SheetClose>
                ))}
              </nav>

              <Separator className="my-4" />

              <div className="grid gap-2">
                {isLoading ? (
                  <Button variant="ghost" disabled>…</Button>
                ) : me ? (
                  <Button variant="outline" onClick={async () => { await onLogout(); setOpen(false); }}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Button asChild variant={isActive("/login") ? "secondary" : "outline"}>
                        <Link href="/login" aria-current={isActive("/login") ? "page" : undefined}>Login</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button asChild>
                        <Link href="/signup" aria-current={isActive("/signup") ? "page" : undefined}>Sign Up</Link>
                      </Button>
                    </SheetClose>
                  </>
                )}
                <div className="flex items-center justify-center pt-2"><ModeToggle /></div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
}
