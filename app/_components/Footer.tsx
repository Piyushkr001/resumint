"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { XLogoIcon } from "@phosphor-icons/react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();

  async function onSubscribe(e: React.FormEvent) {
    e.preventDefault();
    // TODO: POST to your newsletter endpoint
    // await fetch("/api/subscribe", { method: "POST", body: JSON.stringify({ email }) })
    console.log("Subscribed:", email);
    setEmail("");
  }

  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="grid grid-cols-1 gap-10 py-12 md:grid-cols-4">
          {/* Brand + Newsletter */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              {/* Swap with your light/dark logo assets as needed */}
              <Image
                src="/Images/Logo/logo.svg"
                alt="Resumint"
                width={180}
                height={180}
                className="block dark:hidden"
              />
              <Image
                src="/Images/Logo/logo-dark.svg"
                alt="Resumint"
                width={180}
                height={180}
                className="hidden dark:block"
              />
            </div>

            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Build, score, and tailor ATS-ready resumes. Share a beautiful link and get hired faster.
            </p>

            <form onSubmit={onSubscribe} className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Join our newsletter"
                className="h-11 sm:max-w-xs"
                aria-label="Email address"
              />
              <Button type="submit" className="h-11 px-5">Subscribe</Button>
            </form>

            <div className="mt-4 flex items-center gap-3 text-muted-foreground">
              <Link href="#" aria-label="Email">
                <Mail className="h-5 w-5 hover:text-foreground" />
              </Link>
              <Link href="https://github.com" target="_blank" aria-label="GitHub">
                <Github className="h-5 w-5 hover:text-foreground" />
              </Link>
              <Link href="https://twitter.com" target="_blank" aria-label="Twitter">
                <XLogoIcon className="h-5 w-5 hover:text-foreground" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 hover:text-foreground" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <FooterColumn
            title="Product"
            links={[
              { label: "Features", href: "/#features" },
              { label: "Templates", href: "/templates" },
              { label: "Changelog", href: "/changelog" },
            ]}
          />

          {/* Resources */}
          <FooterColumn
            title="Resources"
            links={[
              { label: "Docs", href: "/docs" },
              { label: "Guides", href: "/guides" },
              { label: "Support", href: "/support" },
            ]}
          />
        </div>

        <Separator className="mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-col items-start justify-between gap-4 pb-10 text-sm text-muted-foreground md:flex-row md:items-center">
          <p>© {year} Resumint. All rights reserved.</p>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

/* --- small helper component for link columns --- */
function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold tracking-wide text-foreground">{title}</h3>
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
