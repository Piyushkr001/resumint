// app/_components/Navbar.jsx (or wherever you keep it)
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  { title: "Home", path: "/" },
  { title: "Dashboard", path: "/dashboard" },
  { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur supports-backdrop-filter:bg-white/60 dark:bg-neutral-950/60">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-2" aria-label="Resumint Home">
          <Image
            src="/Images/Logo/logo.svg"
            alt="Resumint"
            width={180}
            height={180}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => {
            const active = pathname === item.path;
            return (
              <Button
                key={item.path}
                asChild
                variant="ghost"
                size="sm"
                className={`px-3 ${active ? "bg-muted font-medium" : ""}`}
              >
                <Link href={item.path} aria-current={active ? "page" : undefined}>
                  {item.title}
                </Link>
              </Button>
            );
          })}
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Image
                    src="/Images/Logo/logo.svg"
                    alt="Resumint"
                    width={28}
                    height={28}
                  />
                  <span>Resumint</span>
                </SheetTitle>
              </SheetHeader>

              <Separator className="my-4" />

              <nav className="grid gap-1">
                {menuItems.map((item) => {
                  const active = pathname === item.path;
                  return (
                    <Button
                      key={item.path}
                      asChild
                      variant={active ? "secondary" : "ghost"}
                      className="justify-start"
                      onClick={() => setOpen(false)}
                    >
                      <Link href={item.path} aria-current={active ? "page" : undefined}>
                        {item.title}
                      </Link>
                    </Button>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
}
