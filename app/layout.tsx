// app/layout.tsx
import type { Metadata } from "next";
import { Ubuntu_Sans } from "next/font/google";
import "./globals.css";

import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";

// ⬇️ If you followed my earlier step, this provides { user, setUser, ... }


// If you already wrap GoogleOAuthProvider / QueryClient / etc. in ./providers,
// keep it — we’ll nest AuthProvider inside it so Navbar can read auth state.
import Providers from "./providers";
import { AuthProvider } from "./(auth)/_components/Session";

const ubuntu = Ubuntu_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Resumint",
  description: "Build ATS-ready resumes in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={[
          ubuntu.className,
          "min-h-dvh bg-background text-foreground antialiased",
        ].join(" ")}
      >
        {/* App-wide providers (e.g., Google OAuth, QueryClient, etc.) */}
        <Providers>
          {/* Auth store so Navbar can react instantly after login/signup */}
          <AuthProvider>
            {/* ThemeProvider should wrap UI to keep light/dark consistent */}
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {/* Global chrome */}
              <Navbar />
              <main className="min-h-[70dvh]">{children}</main>
              <Footer />

              {/* Toasts (theme-aware because inside ThemeProvider) */}
              <Toaster position="top-center" />
            </ThemeProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
