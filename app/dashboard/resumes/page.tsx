// app/dashboard/resumes/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from "@/components/ui/card";
import {
  Table, TableHeader, TableHead, TableRow, TableBody, TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// icons
import {
  Plus, Search, RefreshCcw, MoreHorizontal, FileText, Download, Pencil, Copy, Trash2, ArrowUpDown,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Resume = {
  id: string;
  title: string;
  template: string;
  ats?: number | null;
  updatedAtISO: string;
};

type ResList = {
  items: Resume[];
  total: number;
  page: number;
  perPage: number;
};

/* ------------------------------------------------------------------ */
/* Data hook - now calling your API                                    */
/* ------------------------------------------------------------------ */

function useResumes() {
  const router = useRouter();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const [search, setSearch] = React.useState<string>("");
  const [template, setTemplate] = React.useState<string>("all");
  const [sort, setSort] = React.useState<string>("updated_desc");
  const [page, setPage] = React.useState<number>(1);
  const perPage = 10;

  const [data, setData] = React.useState<ResList>({
    items: [],
    total: 0,
    page,
    perPage,
  });

  // optional: abort older fetches
  const abortRef = React.useRef<AbortController | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const qs = new URLSearchParams();
      if (search.trim()) qs.set("search", search.trim());
      if (template !== "all") qs.set("template", template);
      qs.set("sort", sort);
      qs.set("page", String(page));
      qs.set("perPage", String(perPage));

      const res = await fetch(`/api/resumes?${qs.toString()}`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        signal: ac.signal,
      });

      if (res.status === 401) {
        toast.error("Please log in to view your resumes.");
        router.push("/login?next=/dashboard/resumes");
        setData((d) => ({ ...d, items: [], total: 0 }));
        return;
      }

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const json = (await res.json()) as ResList | any;

      // normalize possible field names from API
      const items = (json.items ?? []).map((r: any) => ({
        id: r.id,
        title: r.title,
        template: r.template,
        ats: r.ats ?? r.atsScore ?? null,
        updatedAtISO: r.updatedAtISO ?? r.updatedAt ?? r.updated_at ?? new Date().toISOString(),
      })) as Resume[];

      setData({
        items,
        total: Number(json.total ?? items.length ?? 0),
        page: Number(json.page ?? page),
        perPage: Number(json.perPage ?? perPage),
      });
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setError(e?.message ?? "Failed to load resumes");
    } finally {
      setLoading(false);
    }
  }, [router, search, template, sort, page, perPage]);

  React.useEffect(() => { load(); }, [load]);

  return {
    loading, error, data,
    search, setSearch,
    template, setTemplate,
    sort, setSort,
    page, setPage,
    reload: load,
  };
}

/* ------------------------------------------------------------------ */
/* Helpers & skeletons                                                 */
/* ------------------------------------------------------------------ */

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function RowSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-md border p-3">
      <div className="flex items-center gap-3 w-[60%]">
        <Skeleton className="h-5 w-5 rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <div className="hidden md:flex items-center gap-3">
        <Skeleton className="h-6 w-10" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Row actions (now wired to API)                                      */
/* ------------------------------------------------------------------ */

function RowActions({ resume, onChanged }: { resume: Resume; onChanged: () => void }) {
  const [renameOpen, setRenameOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState(resume.title);

  async function handleRename() {
    try {
      const p = fetch(`/api/resumes/${resume.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: newTitle }),
      });
      await toast.promise(p, {
        loading: "Renaming…",
        success: "Renamed",
        error: "Rename failed",
      });
      setRenameOpen(false);
      onChanged();
    } catch { /* toast handles */ }
  }

  async function handleDuplicate() {
    try {
      const p = fetch(`/api/resumes/${resume.id}/duplicate`, {
        method: "POST",
        credentials: "include",
      });
      await toast.promise(p, {
        loading: "Duplicating…",
        success: "Duplicated",
        error: "Duplicate failed",
      });
      onChanged();
    } catch { /* toast handles */ }
  }

  async function handleDelete() {
    try {
      const p = fetch(`/api/resumes/${resume.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      await toast.promise(p, {
        loading: "Deleting…",
        success: "Deleted",
        error: "Delete failed",
      });
      setDeleteOpen(false);
      onChanged();
    } catch { /* toast handles */ }
  }

  function handleDownload() {
    // adjust if your API path differs
    window.open(`/api/resumes/${resume.id}/export?format=pdf`, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8"
        aria-label="Download"
        onClick={handleDownload}
        title="Download PDF"
      >
        <Download className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" aria-label="More actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/resumes/${resume.id}`}>
              <FileText className="mr-2 h-4 w-4" /> Open
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRenameOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" /> Rename
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rename Dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename resume</DialogTitle>
            <DialogDescription>Give your resume a clear, recognizable title.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="newTitle">Title</Label>
            <Input
              id="newTitle"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && newTitle.trim() && handleRename()}
            />
          </div>
          <DialogFooter className="gap-2 sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleRename} disabled={!newTitle.trim()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this resume?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The resume “{resume.title}” will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Table (desktop) + Cards (mobile)                                    */
/* ------------------------------------------------------------------ */

function ResumesTable({
  items, onChanged,
}: { items: Resume[]; onChanged: () => void }) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">Title</TableHead>
            <TableHead>Template</TableHead>
            <TableHead>ATS</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{r.title}</span>
                </div>
              </TableCell>
              <TableCell>{r.template}</TableCell>
              <TableCell>
                {typeof r.ats === "number"
                  ? <Badge variant={r.ats >= 85 ? "default" : "secondary"}>{r.ats}</Badge>
                  : <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell>{formatDate(r.updatedAtISO)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button asChild size="sm" variant="outline" className="h-8 px-3">
                    <Link href={`/resumes/${r.id}`}>Open</Link>
                  </Button>
                  <RowActions resume={r} onChanged={onChanged} />
                </div>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No resumes found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function ResumesCards({
  items, onChanged,
}: { items: Resume[]; onChanged: () => void }) {
  if (!items.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          No resumes yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((r) => (
        <Card key={r.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{r.title}</CardTitle>
            <CardDescription>{r.template} • {formatDate(r.updatedAtISO)}</CardDescription>
          </CardHeader>
          <CardFooter className="flex items-center justify-between">
            <div>
              {typeof r.ats === "number" ? (
                <Badge variant={r.ats >= 85 ? "default" : "secondary"}>ATS {r.ats}</Badge>
              ) : (
                <span className="text-xs text-muted-foreground">ATS —</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button asChild size="sm" variant="outline">
                <Link href={`/resumes/${r.id}`}>Open</Link>
              </Button>
              <RowActions resume={r} onChanged={onChanged} />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ResumesPage() {
  const {
    loading, error, data, reload,
    search, setSearch,
    template, setTemplate,
    sort, setSort,
    page, setPage,
  } = useResumes();

  const totalPages = Math.max(1, Math.ceil(data.total / data.perPage));

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Resumes</h1>
          <p className="text-sm text-muted-foreground">
            Manage all your resumes in one place.
          </p>
        </div>
        <div className="flex w-full gap-2 md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resumes…"
              className="pl-9"
              onKeyDown={(e) => e.key === "Enter" && reload()}
            />
          </div>
          <Button asChild>
            <Link href="/resumes/new">
              <Plus className="mr-2 h-4 w-4" />
              Create New Resume
            </Link>
          </Button>
          <Button variant="outline" onClick={reload} disabled={loading}>
            <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="grid gap-1">
          <Label>Template</Label>
          <Select value={template} onValueChange={(v) => { setTemplate(v); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="All templates" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="clean">Clean</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="elegant">Elegant</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1">
          <Label>Sort</Label>
          <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1); }}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <SelectValue placeholder="Updated (desc)" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated_desc">Updated (newest)</SelectItem>
              <SelectItem value="updated_asc">Updated (oldest)</SelectItem>
              <SelectItem value="ats_desc">ATS (high → low)</SelectItem>
              <SelectItem value="ats_asc">ATS (low → high)</SelectItem>
              <SelectItem value="title_asc">Title (A → Z)</SelectItem>
              <SelectItem value="title_desc">Title (Z → A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1">
          <Label>Status</Label>
          <Select defaultValue="any" onValueChange={() => toast("Status filter not wired to API yet")}>
            <SelectTrigger><SelectValue placeholder="Any status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="final">Final</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 space-y-4">
        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
            <b>Error:</b> {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <RowSkeleton key={i} />)}
          </div>
        ) : data.items.length === 0 ? (
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>No resumes yet</CardTitle>
              <CardDescription>Create your first resume to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Use professional templates and get ATS-friendly suggestions as you write.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild>
                    <Link href="/resumes/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Resume
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/templates">Browse Templates</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <ResumesTable items={data.items} onChanged={reload} />
            </div>
            {/* Mobile cards */}
            <div className="md:hidden">
              <ResumesCards items={data.items} onChanged={reload} />
            </div>

            {/* Pagination */}
            <div className="flex justify-end">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      aria-disabled={page <= 1}
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) setPage(page - 1);
                      }}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-3 py-2 text-sm text-muted-foreground">
                      Page {page} of {Math.max(1, Math.ceil(data.total / data.perPage))}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      aria-disabled={page >= Math.max(1, Math.ceil(data.total / data.perPage))}
                      onClick={(e) => {
                        e.preventDefault();
                        const totalPages = Math.max(1, Math.ceil(data.total / data.perPage));
                        if (page < totalPages) setPage(page + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
