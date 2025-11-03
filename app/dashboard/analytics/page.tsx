// app/dashboard/analytics/page.tsx
"use client";

import * as React from "react";
import { toast } from "react-hot-toast";

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts";

import {
  RefreshCcw, Download, BarChart3, TrendingUp, FileText, Eye, Star, LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

type TimeKey = "7d" | "30d" | "90d";

type SeriesResp = {
  metric: "views" | "downloads";
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
  resumeId: string | null;
  series: { date: string; value: number }[]; // YYYY-MM-DD
};

type SummaryResp = {
  range: { from: string; to: string };
  totals: { views: number; downloads: number };
  templateShare: { template: "clean" | "modern" | "minimal" | "elegant"; value: number }[];
  ats: { avgScore: number; lastAnalysisAt: string | null; count: number };
};

type KeywordsResp = {
  range: { from: string; to: string };
  matched: { keyword: string; count: number }[];
  missing: { keyword: string; count: number }[];
  extras: { keyword: string; count: number }[];
};

type ResumeMetric = {
  date: string;         // label shown on chart, e.g. "Oct 01"
  downloads: number;
  views: number;
  avgATS: number;       // flat line from summary.avgScore
};

type TemplateShare = { name: string; value: number }; // percent 0..100
type KeywordStat = { keyword: string; count: number };

/* ------------------------------------------------------------------ */
/* Hooks                                                              */
/* ------------------------------------------------------------------ */

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);
  React.useEffect(() => {
    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);
    onChange();
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/* ------------------------------------------------------------------ */
/* UI helpers                                                         */
/* ------------------------------------------------------------------ */

function KpiCard({
  icon: Icon, label, value, delta, good = true,
}: { icon: LucideIcon; label: string; value: string; delta?: string; good?: boolean }) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-semibold">{value}</div>
        {!!delta && (
          <div className={`text-xs ${good ? "text-emerald-600" : "text-destructive"}`}>{delta}</div>
        )}
      </CardContent>
    </Card>
  );
}

function SimpleLegend({ items }: { items: { label: string; className?: string }[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className={`inline-block h-2.5 w-2.5 rounded-sm ${it.className}`} />
          {it.label}
        </div>
      ))}
    </div>
  );
}

function ChartCard({
  title, description, children, toolbar,
}: React.PropsWithChildren<{ title: string; description?: string; toolbar?: React.ReactNode }>) {
  return (
    <Card className="h-full min-w-0 overflow-hidden"> {/* overflow-hidden to avoid tiny scrollbars on mobile */}
      <CardHeader className="space-y-1">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base">{title}</CardTitle>
            {description ? (<CardDescription>{description}</CardDescription>) : null}
          </div>
          {toolbar}
        </div>
      </CardHeader>
      <CardContent className="pt-2 min-w-0">{children}</CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Data fetching + mapping                                             */
/* ------------------------------------------------------------------ */

function getRangeDates(range: TimeKey) {
  const today = new Date();
  const to = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const days = range === "7d" ? 6 : range === "30d" ? 29 : 89;
  const from = new Date(to);
  from.setUTCDate(to.getUTCDate() - days);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { from: iso(from), to: iso(to) };
}

function fmtMMMdd(yyyy_mm_dd: string) {
  const [y, m, d] = yyyy_mm_dd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  return dt.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store", credentials: "include" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function AnalyticsPage() {
  const [range, setRange] = React.useState<TimeKey>("30d");
  const [template, setTemplate] = React.useState<string>("all");

  const [loading, setLoading] = React.useState(false);
  const [series, setSeries] = React.useState<ResumeMetric[]>([]);
  const [templateShare, setTemplateShare] = React.useState<TemplateShare[]>([]);
  const [keywords, setKeywords] = React.useState<KeywordStat[]>([]);
  const [avgATS, setAvgATS] = React.useState<number>(0);
  const [totals, setTotals] = React.useState<{ views: number; downloads: number; resumes: number; avgATS: number }>({
    views: 0, downloads: 0, resumes: 0, avgATS: 0,
  });

  // responsive flags
  const isXS = useMediaQuery("(max-width: 360px)");
  const isSM = useMediaQuery("(max-width: 640px)");

  const abortRef = React.useRef<AbortController | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    const { from, to } = getRangeDates(range);
    const tParam = template && template !== "all" ? `&template=${encodeURIComponent(template)}` : "";

    try {
      const [views, downloads, summary, kw] = await Promise.all([
        fetchJSON<SeriesResp>(`/api/analytics/series?metric=views&from=${from}&to=${to}${tParam}`),
        fetchJSON<SeriesResp>(`/api/analytics/series?metric=downloads&from=${from}&to=${to}${tParam}`),
        fetchJSON<SummaryResp>(`/api/analytics/summary?from=${from}&to=${to}${tParam}`),
        fetchJSON<KeywordsResp>(`/api/analytics/keywords?from=${from}&to=${to}&limit=16${tParam}`),
      ]);

      const vMap = new Map(views.series.map((r) => [r.date, r.value]));
      const dMap = new Map(downloads.series.map((r) => [r.date, r.value]));
      const avg = Math.round(summary.ats?.avgScore ?? 0);

      const merged: ResumeMetric[] = [];
      {
        const start = new Date(from + "T00:00:00Z");
        const end = new Date(to + "T00:00:00Z");
        for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
          const key = d.toISOString().slice(0, 10);
          merged.push({
            date: fmtMMMdd(key),
            views: Number(vMap.get(key) ?? 0),
            downloads: Number(dMap.get(key) ?? 0),
            avgATS: avg,
          });
        }
      }

      const totalValue = summary.templateShare.reduce((a, b) => a + Number(b.value || 0), 0) || 0;
      const share: TemplateShare[] = summary.templateShare.map((row) => ({
        name: row.template[0].toUpperCase() + row.template.slice(1),
        value: totalValue ? Math.round((Number(row.value) / totalValue) * 100) : 0,
      }));

      const kwBars = (kw.matched ?? []).slice(0, 16);

      let resumesTotal = 0;
      try {
        const resList: any = await fetchJSON<any>("/api/resumes?perPage=1&page=1");
        resumesTotal = Number(resList?.total ?? 0);
      } catch {
        resumesTotal = Math.max(share.length, 1) * 2;
      }

      setSeries(merged);
      setTemplateShare(share);
      setKeywords(kwBars);
      setAvgATS(avg);
      setTotals({
        views: Number(summary.totals?.views ?? 0),
        downloads: Number(summary.totals?.downloads ?? 0),
        resumes: resumesTotal,
        avgATS: avg,
      });
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? "Failed to load analytics");
      setSeries([]);
      setTemplateShare([]);
      setKeywords([]);
      setAvgATS(0);
      setTotals({ views: 0, downloads: 0, resumes: 0, avgATS: 0 });
    } finally {
      setLoading(false);
    }
  }, [range, template]);

  React.useEffect(() => { load(); }, [load]);

  function exportCSV() {
    const headers = ["index", "label", "downloads", "views", "avgATS"];
    const rows = series.map((d, i) => [i + 1, d.date, d.downloads, d.views, d.avgATS]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `analytics_${range}${template !== "all" ? `_${template}` : ""}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  const COLORS = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#22c55e"];

  const xTickSize = isSM ? 10 : 12;
  const yTickSize = isSM ? 10 : 12;
  const labelAngle = isXS ? -35 : 0;
  const axisInterval = (isSM ? "preserveStartEnd" : 0) as number | "preserveStartEnd";

  return (
    <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Track resume performance, template adoption, and ATS trends.
          </p>
        </div>
        <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={load} disabled={loading} className="w-full sm:w-auto">
            <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={exportCSV} disabled={!series.length} className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="grid w-full md:w-[220px] gap-1">
          <Label>Time range</Label>
          <Select value={range} onValueChange={(v: TimeKey) => setRange(v)}>
            <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-full md:w-[220px] gap-1">
          <Label>Template</Label>
          <Select value={template} onValueChange={setTemplate}>
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
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="h-9 rounded-sm px-3">{loading ? "Loading…" : "Data: Live"}</Badge>
          <Badge className="h-9 rounded-sm px-3 hidden xs:inline-flex">Realtime</Badge>
        </div>
      </div>

      {/* KPIs: auto-fit grid -> better on narrow screens */}
      <div className="mt-6 grid gap-3 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
        <KpiCard icon={FileText} label="Resumes Created" value={String(totals.resumes)} delta="" />
        <KpiCard icon={Eye} label="Total Views" value={String(totals.views)} delta="" />
        <KpiCard icon={BarChart3} label="Downloads" value={String(totals.downloads)} delta="" />
        <KpiCard icon={Star} label="Avg ATS Score" value={`${totals.avgATS}`} delta="" />
      </div>

      {/* Charts */}
      <div className="mt-6 flex flex-col gap-4 lg:flex-row">
        {/* Left column */}
        <div className="flex-1 min-w-0 space-y-4">
          <ChartCard
            title="ATS Score Trend"
            description="Average ATS score across your resumes over time."
            toolbar={<SimpleLegend items={[
              { label: "Avg ATS", className: "bg-primary" },
              { label: "Downloads", className: "bg-sky-500" },
            ]} />}
          >
            <div className="min-w-0 min-h-[220px] sm:min-h-[260px] lg:min-h-[300px] w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={220}
                minHeight={200}
                key={`ats-${range}-${series.length}`}
              >
                <AreaChart data={series} margin={{ left: 6, right: 6, top: 10 }}>
                  <defs>
                    <linearGradient id="fillPrimary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.28}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.04}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: xTickSize }}
                    tickMargin={8}
                    interval={axisInterval}
                    angle={labelAngle}
                    dx={labelAngle ? -6 : 0}
                  />
                  <YAxis yAxisId="left" tick={{ fontSize: yTickSize }} allowDecimals={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: yTickSize }} allowDecimals={false} />
                  <Tooltip />
                  <Area yAxisId="left" type="monotone" dataKey="avgATS" stroke="#6366f1" fill="url(#fillPrimary)" />
                  <Line yAxisId="right" type="monotone" dataKey="downloads" stroke="#06b6d4" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Top Keywords Matched" description="Most frequent matched skills across ATS analyses.">
            <div className="min-w-0 min-h-[220px] sm:min-h-[260px] lg:min-h-[300px] w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={220}
                minHeight={200}
                key={`kw-${range}-${keywords.length}`}
              >
                <BarChart data={keywords} margin={{ left: 6, right: 6, top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="keyword"
                    tick={{ fontSize: xTickSize }}
                    interval={axisInterval}
                    tickMargin={8}
                    angle={labelAngle}
                    dx={labelAngle ? -6 : 0}
                  />
                  <YAxis tick={{ fontSize: yTickSize }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Right column */}
        <div className="w-full lg:w-[420px] lg:flex-none space-y-4 min-w-0">
          <ChartCard title="Template Share" description="Distribution of templates across your resumes (by views).">
            <div className="min-w-0 min-h-[220px] sm:min-h-[260px] lg:min-h-[300px] w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={220}
                minHeight={200}
                key={`share-${range}-${templateShare.length}`}
              >
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={templateShare}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={isSM ? 48 : 60}
                    outerRadius={isSM ? 76 : 90}
                    paddingAngle={4}
                    stroke="#fff"
                  >
                    {templateShare.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {templateShare.length ? templateShare.map((t, i) => (
                <div key={t.name} className="flex items-center justify-between rounded-md border p-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-sm"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    <span className="truncate">{t.name}</span>
                  </div>
                  <span className="font-medium">{t.value}%</span>
                </div>
              )) : (
                <div className="text-sm text-muted-foreground col-span-2">No data</div>
              )}
            </div>
          </ChartCard>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Quality Meter</CardTitle>
              <CardDescription>Overall health based on ATS & engagement.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Composite Score</span>
                <span className="font-medium">
                  {Math.min(100, Math.round((avgATS * 0.6) + (totals.downloads / 3) * 0.4))}
                </span>
              </div>
              <Progress value={Math.min(100, Math.round((avgATS * 0.6) + (totals.downloads / 3) * 0.4))} />
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Readable</Badge>
                <Badge variant="secondary">ATS-friendly</Badge>
                <Badge variant="secondary">Popular Templates</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Secondary row */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <ChartCard title="Views vs Downloads" description="Conversion from views into downloads.">
          <div className="min-w-0 min-h-[220px] sm:min-h-[260px] lg:min-h-[300px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={220}
              minHeight={200}
              key={`vd-${range}-${series.length}`}
            >
              <LineChart data={series} margin={{ left: 6, right: 6, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: xTickSize }}
                  interval={axisInterval}
                  tickMargin={8}
                  angle={labelAngle}
                  dx={labelAngle ? -6 : 0}
                />
                <YAxis tick={{ fontSize: yTickSize }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#0ea5e9" dot={false} />
                <Line type="monotone" dataKey="downloads" stroke="#22c55e" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Insights</CardTitle>
            <CardDescription>Quick highlights from the current range.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <TrendingUp className="mt-0.5 h-4 w-4 text-emerald-600" />
              <p>
                <b>ATS average:</b> <b>{avgATS}</b>. Tailor bullets to frequent matches like{" "}
                {keywords.slice(0, 2).map((k, i) => (
                  <b key={k.keyword}>{i ? ", " : ""}{k.keyword}</b>
                ))}{keywords.length ? "" : "—"}.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <BarChart3 className="mt-0.5 h-4 w-4 text-indigo-600" />
              <p>
                <b>Template adoption:</b>{" "}
                {templateShare.length ? <b>{templateShare[0].name}</b> : "—"} leads by views.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <FileText className="mt-0.5 h-4 w-4 text-sky-600" />
              <p>
                <b>Content tip:</b> Strong verbs in bullets improve match rates (e.g., “Optimized”, “Delivered”, “Reduced”).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
