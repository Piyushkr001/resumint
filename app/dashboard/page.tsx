// app/dashboard/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Toast-on-redirect helper (keep your existing component)
import AlreadyToast from "./AlreadyToast";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

// icons
import {
  Plus,
  FileText,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  RefreshCcw,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type KPI = { label: string; value: number; delta: string; up: boolean };
type ResumeRow = {
  id: string;
  title: string;
  template: string;
  ats: number;
  updatedAt: string;
};
type Insight = { name: string; progress: number };

type DashboardData = {
  kpis: KPI[];
  resumes: ResumeRow[];
  insights: Insight[];
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

async function readError(res: Response) {
  try {
    const j = await res.json();
    return j?.error || j?.message || res.statusText;
  } catch {
    try {
      return await res.text();
    } catch {
      return "Something went wrong";
    }
  }
}

/* ------------------------------------------------------------------ */
/* Data hook → calls /api/dashboard (fixed: no refresh loop)           */
/* ------------------------------------------------------------------ */

function useDashboardData(onUnauthorized?: () => void) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<DashboardData>({
    kpis: [],
    resumes: [],
    insights: [],
  });

  // Keep latest unauthorized callback in a ref so `load` can be stable
  const unauthorizedRef = React.useRef(onUnauthorized);
  React.useEffect(() => {
    unauthorizedRef.current = onUnauthorized;
  }, [onUnauthorized]);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    const ctrl = new AbortController();
    try {
      const res = await fetch("/api/dashboard", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: ctrl.signal,
      });

      if (res.status === 401) {
        unauthorizedRef.current?.();
        return;
      }
      if (!res.ok) {
        const msg = await readError(res);
        throw new Error(msg);
      }

      const j = (await res.json()) as Partial<DashboardData> | undefined;

      setData({
        kpis: Array.isArray(j?.kpis) ? j!.kpis : [],
        resumes: Array.isArray(j?.resumes) ? j!.resumes : [],
        insights: Array.isArray(j?.insights) ? j!.insights : [],
      });
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        setError(e?.message ?? "Failed to load dashboard");
      }
    } finally {
      setLoading(false);
    }

    return () => ctrl.abort();
  }, []); // <- stays stable

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cancelled) await load();
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  return { loading, error, data, reload: load };
}

/* ------------------------------------------------------------------ */
/* UI Parts                                                            */
/* ------------------------------------------------------------------ */

function HeaderBar(props: { onReload: () => void; loading: boolean }) {
  const { onReload, loading } = props;
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your resumes, ATS score and activity.
        </p>
      </div>
      <div className="flex w-full gap-2 md:w-auto">
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search resumes…" className="pl-9" />
        </div>
        {/* NOTE: keep path consistent with where your new page lives.
           If it's at /dashboard/resumes/new, change the href below. */}
        <Button asChild className="whitespace-nowrap">
          <Link href="/resumes/new">
            <Plus className="mr-2 h-4 w-4" />
            New Resume
          </Link>
        </Button>
        <Button
          variant="outline"
          onClick={onReload}
          disabled={loading}
          className="whitespace-nowrap"
        >
          <RefreshCcw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>
    </div>
  );
}

function KpiSkeleton() {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-2 h-8 w-16" />
      </CardHeader>
      <CardFooter className="pt-0">
        <Skeleton className="h-6 w-16 rounded-full" />
      </CardFooter>
    </Card>
  );
}

function KpiCards({ items }: { items: KPI[] }) {
  if (!items.length) {
    return (
      <div className="mt-6 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
        KPI metrics will appear here once you start creating resumes and the
        backend is connected.
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((k) => (
        <Card key={k.label} className="border-border/60">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">{k.label}</CardDescription>
            <CardTitle className="text-3xl font-bold">{k.value}</CardTitle>
          </CardHeader>
          <CardFooter className="pt-0">
            <Badge
              variant={k.up ? "default" : "secondary"}
              className={`gap-1 ${
                k.up ? "bg-emerald-600 hover:bg-emerald-600" : ""
              }`}
            >
              {k.up ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {k.delta}
            </Badge>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function RecentResumesSkeleton() {
  return (
    <Card className="border-border/60 lg:col-span-2">
      <CardHeader className="pb-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-2 h-3 w-56" />
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-md border p-3"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-7 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RecentResumes({ rows }: { rows: ResumeRow[] }) {
  if (!rows.length) {
    return (
      <Card className="border-border/60 lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Recent Resumes</CardTitle>
          <CardDescription>You haven’t created any resume yet.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Start by creating your first resume with our templates.
            </p>
            <Button asChild>
              <Link href="/resumes/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Resume
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 lg:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle>Recent Resumes</CardTitle>
        <CardDescription>Latest updates across your workspace</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resume</TableHead>
                <TableHead className="hidden md:table-cell">Template</TableHead>
                <TableHead>ATS</TableHead>
                <TableHead className="hidden sm:table-cell">Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback>CV</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="truncate">{r.title}</span>
                        <span className="text-xs text-muted-foreground md:hidden">
                          {r.template}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {r.template}
                  </TableCell>
                  <TableCell>
                    <Badge variant={r.ats >= 85 ? "default" : "secondary"}>
                      {r.ats}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {r.updatedAt}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-8 px-3"
                      >
                        <Link href={`/resumes/${r.id}`}>
                          <FileText className="mr-1.5 h-4 w-4" />
                          Open
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button asChild variant="ghost" size="sm">
          <Link href="/resumes">View all</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function InsightsSkeleton() {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="mt-2 h-3 w-56" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function Insights({ items }: { items: Insight[] }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle>Improvement Insights</CardTitle>
        <CardDescription>Where to focus next</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No insights yet. Create a resume to see suggestions here.
          </p>
        ) : (
          items.map((it) => (
            <div key={it.name} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm">{it.name}</span>
                <span className="text-xs text-muted-foreground">
                  {it.progress}%
                </span>
              </div>
              <Progress value={it.progress} />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Jump back into work</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {/* Adjust href to /dashboard/resumes/new if that's your route */}
        <Button asChild>
          <Link href="/resumes/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Resume
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/uploads">Import from PDF</Link>
        </Button>
      </CardContent>
      <Separator />
      <CardFooter className="justify-between text-xs text-muted-foreground">
        <span>Need help?</span>
        <Link href="/docs" className="underline underline-offset-4">
          Read the docs
        </Link>
      </CardFooter>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const router = useRouter();

  // Stable unauthorized handler prevents the hook from re-running endlessly
  const handleUnauthorized = React.useCallback(() => {
    toast.error("Please log in to view your dashboard.");
    router.replace("/login?next=/dashboard");
  }, [router]);

  const { loading, error, data, reload } = useDashboardData(handleUnauthorized);

  return (
    <>
      <AlreadyToast />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <HeaderBar onReload={reload} loading={loading} />

        {error && (
          <div className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
            <b>Error:</b> {error}
          </div>
        )}

        {/* KPI row */}
        {loading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <KpiSkeleton key={i} />
            ))}
          </div>
        ) : (
          <KpiCards items={data.kpis} />
        )}

        {/* Main grid */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {loading ? (
            <>
              <RecentResumesSkeleton />
              <div className="grid gap-4">
                <InsightsSkeleton />
                <QuickActions />
              </div>
            </>
          ) : (
            <>
              <RecentResumes rows={data.resumes} />
              <div className="grid gap-4">
                <Insights items={data.insights} />
                <QuickActions />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
