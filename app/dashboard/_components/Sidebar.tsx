"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid, FileText, Sparkles, BarChart3, Settings, HelpCircle, Menu,
  ChevronLeft, ChevronRight, LogOut, User as UserIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ModeToggle";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // ✅ add this

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const NAV: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutGrid },
  { label: "Resumes", href: "/dashboard/resumes", icon: FileText },
  { label: "ATS Insights", href: "/dashboard/ats", icon: Sparkles },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

type SidebarProps = {
  collapsedDefault?: boolean;
  user?: { name?: string | null; email?: string; imageUrl?: string | null };
  onLogout?: () => void | Promise<void>;
  brand?: React.ReactNode;
};

const STORAGE_KEY = "dashboard:sidebar:collapsed";

function useCollapsed(defaultValue = false) {
  const [collapsed, setCollapsed] = React.useState(defaultValue);

  React.useEffect(() => {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "1") setCollapsed(true);
    if (v === "0") setCollapsed(false);
  }, []);

  const toggle = React.useCallback(() => {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }, []);

  return { collapsed, toggle, setCollapsed };
}

function SidebarContent({
  collapsed,
  user,
  onLogout,
}: Pick<SidebarProps, "user" | "onLogout"> & { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full w-full flex-col">
        {/* Top: Brand */}
        <div className={cn(
          "flex items-center gap-2 px-3 py-3",
          collapsed ? "justify-center" : "justify-start"
        )}>
          <div className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          {!collapsed && (
            <div className="font-semibold tracking-tight">
              Resumint
            </div>
          )}
        </div>

        <Separator />

        {/* Nav */}
        <ScrollArea className="flex-1">
          <nav className="px-2 py-2" aria-label="Dashboard">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname?.startsWith(item.href + "/");
              const inner = (
                <Button
                  asChild
                  variant={active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    collapsed ? "px-0 w-10 h-10 mx-auto" : "px-3"
                  )}
                >
                  <Link href={item.href} aria-current={active ? "page" : undefined}>
                    <Icon className={cn("h-4 w-4", collapsed && "mx-auto")} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                </Button>
              );

              return (
                <div key={item.href} className="my-0.5">
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{inner}</TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  ) : (
                    inner
                  )}
                </div>
              );
            })}
          </nav>
        </ScrollArea>

        <Separator />

        {/* Bottom: User + Theme + Logout */}
        <div className="p-2">
          <div className={cn(
            "flex items-center gap-2 rounded-lg px-2 py-2",
            collapsed ? "justify-center" : "justify-between"
          )}>
            {user ? (
              <>
                <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.imageUrl ?? undefined} alt={user.name ?? user.email ?? "User"} />
                    <AvatarFallback>
                      <UserIcon className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="min-w-0">
                      <p className="text-sm leading-tight font-medium truncate">
                        {user.name || user.email}
                      </p>
                      {user.email && (
                        <p className="text-xs text-muted-foreground leading-tight truncate">
                          {user.email}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {!collapsed && <ModeToggle />}
              </>
            ) : (
              !collapsed && <ModeToggle />
            )}
          </div>

          {user && (
            <Button
              onClick={onLogout}
              variant="outline"
              className={cn("mt-2 w-full", collapsed && "justify-center px-0 w-10 h-9 mx-auto")}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Logout</span>}
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

export function DashboardSidebar({
  collapsedDefault = false,
  user,
  onLogout,
}: SidebarProps) {
  const { collapsed, toggle } = useCollapsed(collapsedDefault);

  return (
    <aside
      className={cn(
        "hidden md:block border-r bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="relative h-screen">
        {/* Collapse toggle (desktop) */}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={toggle}
          className="absolute -right-3 top-3 z-10 h-6 w-6 rounded-full border bg-background shadow"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </Button>

        <SidebarContent collapsed={collapsed} user={user} onLogout={onLogout} />
      </div>
    </aside>
  );
}

export function DashboardMobileSidebar({
  user,
  onLogout,
}: Pick<SidebarProps, "user" | "onLogout">) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      {/* ✅ Provide an accessible title for the dialog */}
      <SheetContent side="left" className="p-0 w-80">
        <SheetHeader>
          <VisuallyHidden>
            <SheetTitle>Dashboard navigation</SheetTitle>
          </VisuallyHidden>
        </SheetHeader>

        <SidebarContent collapsed={false} user={user} onLogout={onLogout} />
      </SheetContent>
    </Sheet>
  );
}
