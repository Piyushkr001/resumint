"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/ModeToggle";

const menuItems = [
  { title: "Home", path: "/" },
  { title: "Dashboard", path: "/dashboard" },
  { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (p: string) => pathname === p;

  // Close Sheet on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close Sheet when viewport crosses md (>=768px)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    if (mql.addEventListener) mql.addEventListener("change", handler);
    else mql.addListener(handler);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handler);
      else mql.removeListener(handler);
    };
  }, []);

  return (
    <div className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 text-foreground">
        {/* Brand (swap logo for dark mode if you have two variants) */}
        <Link href="/" className="flex items-center gap-2" aria-label="Resumint Home">
          {/* Light-mode logo */}
          <Image
            className="block dark:hidden"
            src="/Images/Logo/logo.svg"   // <- replace with your light logo (or /Images/Logo/logo.svg)
            alt="Resumint"
            width={180}
            height={180}
            priority
          />
          {/* Dark-mode logo */}
          <Image
            className="hidden dark:block"
            src="/Images/Logo/logo-dark.svg"    // <- replace with your dark logo (inverted/white)
            alt="Resumint"
            width={180}
            height={180}
            priority
          />
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
              <Link href={item.path} aria-current={isActive(item.path) ? "page" : undefined}>
                {item.title}
              </Link>
            </Button>
          ))}
        </nav>

        {/* Desktop Right: Theme + Auth */}
        <div className="hidden md:flex items-center gap-2">
          <ModeToggle />
          <Button asChild variant={isActive("/login") ? "secondary" : "ghost"} size="sm">
            <Link href="/login" aria-current={isActive("/login") ? "page" : undefined}>
              Login
            </Link>
          </Button>
          <Button asChild size="sm" className="px-4">
            <Link href="/signup" aria-current={isActive("/signup") ? "page" : undefined}>
              Sign Up
            </Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-80 bg-background/95 text-foreground backdrop-blur supports-backdrop-filter:bg-background/85"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {/* Light-mode logo */}
                  <Image
                    className="block dark:hidden"
                    src="/Images/Logo/logo-light.svg"
                    alt="Resumint"
                    width={28}
                    height={28}
                  />
                  {/* Dark-mode logo */}
                  <Image
                    className="hidden dark:block"
                    src="/Images/Logo/logo-dark.svg"
                    alt="Resumint"
                    width={28}
                    height={28}
                  />
                  <span>Resumint</span>
                </SheetTitle>
              </SheetHeader>

              <Separator className="my-4" />

              {/* Nav links */}
              <nav className="grid gap-1">
                {menuItems.map((item) => (
                  <SheetClose asChild key={item.path}>
                    <Button
                      asChild
                      variant={isActive(item.path) ? "secondary" : "ghost"}
                      className="justify-start"
                    >
                      <Link href={item.path} aria-current={isActive(item.path) ? "page" : undefined}>
                        {item.title}
                      </Link>
                    </Button>
                  </SheetClose>
                ))}
              </nav>

              <Separator className="my-4" />

              {/* Auth + Theme */}
              <div className="grid gap-2">
                <SheetClose asChild>
                  <Button asChild variant={isActive("/login") ? "secondary" : "outline"}>
                    <Link href="/login" aria-current={isActive("/login") ? "page" : undefined}>
                      Login
                    </Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild>
                    <Link href="/signup" aria-current={isActive("/signup") ? "page" : undefined}>
                      Sign Up
                    </Link>
                  </Button>
                </SheetClose>
                <div className="flex items-center justify-center pt-2">
                  <ModeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
}
