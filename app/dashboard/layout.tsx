// app/dashboard/layout.tsx
import type { Metadata } from "next";
import { DashboardSidebar, DashboardMobileSidebar } from "./_components/Sidebar";
// If you keep auth in Navbar only, pass user/onLogout down here if you want them in sidebar too.

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Top bar (mobile) */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background/70 px-3 backdrop-blur md:hidden">
        <DashboardMobileSidebar />
        <div className="font-semibold">Dashboard</div>
      </header>

      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
