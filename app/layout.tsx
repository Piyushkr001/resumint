// app/layout.tsx
import type { Metadata } from "next";
import { Ubuntu_Sans } from "next/font/google";
import "./globals.css";

import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";

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
      <body className={`${ubuntu.className} min-h-dvh bg-background text-foreground antialiased flex flex-col`}>
        <Providers>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {/* Sticky header stays above content */}
              <div className="sticky top-0 z-40 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
                <Navbar />
              </div>

              {/* Main grows to push footer to the bottom; min-w-0 avoids chart overflow; pb-safe for any fixed bottom UI */}
              <main className="flex-1 min-w-0 pb-[env(safe-area-inset-bottom)]">
                {children}
              </main>

              {/* Footer never goes under overlays */}
              <div className="mt-auto relative z-10">
                <Footer />
              </div>

              {/* Move toasts away from footer + ensure high z-index */}
              <Toaster
                position="top-right"
                toastOptions={{ style: { zIndex: 60 } }}
                gutter={8}
              />
            </ThemeProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
