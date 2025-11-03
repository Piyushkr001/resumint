// app/dashboard/analytics/page.tsx
"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var React = require("react");
var react_hot_toast_1 = require("react-hot-toast");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var separator_1 = require("@/components/ui/separator");
var label_1 = require("@/components/ui/label");
var select_1 = require("@/components/ui/select");
var badge_1 = require("@/components/ui/badge");
var progress_1 = require("@/components/ui/progress");
var recharts_1 = require("recharts");
var lucide_react_1 = require("lucide-react");
/* ------------------------------------------------------------------ */
/* Hooks                                                              */
/* ------------------------------------------------------------------ */
function useMediaQuery(query) {
    var _a = React.useState(false), matches = _a[0], setMatches = _a[1];
    React.useEffect(function () {
        var m = window.matchMedia(query);
        var onChange = function () { return setMatches(m.matches); };
        onChange();
        m.addEventListener("change", onChange);
        return function () { return m.removeEventListener("change", onChange); };
    }, [query]);
    return matches;
}
/* ------------------------------------------------------------------ */
/* UI helpers                                                         */
/* ------------------------------------------------------------------ */
function KpiCard(_a) {
    var Icon = _a.icon, label = _a.label, value = _a.value, delta = _a.delta, _b = _a.good, good = _b === void 0 ? true : _b;
    return (React.createElement(card_1.Card, { className: "h-full" },
        React.createElement(card_1.CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2" },
            React.createElement(card_1.CardTitle, { className: "text-sm font-medium" }, label),
            React.createElement(Icon, { className: "h-4 w-4 text-muted-foreground" })),
        React.createElement(card_1.CardContent, { className: "space-y-2" },
            React.createElement("div", { className: "text-2xl font-semibold" }, value),
            !!delta && (React.createElement("div", { className: "text-xs " + (good ? "text-emerald-600" : "text-destructive") }, delta)))));
}
function SimpleLegend(_a) {
    var items = _a.items;
    return (React.createElement("div", { className: "flex flex-wrap gap-3" }, items.map(function (it) { return (React.createElement("div", { key: it.label, className: "flex items-center gap-2 text-xs text-muted-foreground" },
        React.createElement("span", { className: "inline-block h-2.5 w-2.5 rounded-sm " + it.className }),
        it.label)); })));
}
function ChartCard(_a) {
    var title = _a.title, description = _a.description, children = _a.children, toolbar = _a.toolbar;
    return (React.createElement(card_1.Card, { className: "h-full min-w-0 overflow-hidden" },
        " ",
        React.createElement(card_1.CardHeader, { className: "space-y-1" },
            React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3" },
                React.createElement("div", { className: "min-w-0" },
                    React.createElement(card_1.CardTitle, { className: "text-base" }, title),
                    description ? (React.createElement(card_1.CardDescription, null, description)) : null),
                toolbar)),
        React.createElement(card_1.CardContent, { className: "pt-2 min-w-0" }, children)));
}
/* ------------------------------------------------------------------ */
/* Data fetching + mapping                                             */
/* ------------------------------------------------------------------ */
function getRangeDates(range) {
    var today = new Date();
    var to = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    var days = range === "7d" ? 6 : range === "30d" ? 29 : 89;
    var from = new Date(to);
    from.setUTCDate(to.getUTCDate() - days);
    var iso = function (d) { return d.toISOString().slice(0, 10); };
    return { from: iso(from), to: iso(to) };
}
function fmtMMMdd(yyyy_mm_dd) {
    var _a = yyyy_mm_dd.split("-").map(Number), y = _a[0], m = _a[1], d = _a[2];
    var dt = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
    return dt.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
}
function fetchJSON(url) {
    return __awaiter(this, void 0, Promise, function () {
        var res, text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url, { cache: "no-store", credentials: "include" })];
                case 1:
                    res = _a.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.text()["catch"](function () { return ""; })];
                case 2:
                    text = _a.sent();
                    throw new Error(text || "HTTP " + res.status);
                case 3: return [2 /*return*/, res.json()];
            }
        });
    });
}
/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */
function AnalyticsPage() {
    var _this = this;
    var _a = React.useState("30d"), range = _a[0], setRange = _a[1];
    var _b = React.useState("all"), template = _b[0], setTemplate = _b[1];
    var _c = React.useState(false), loading = _c[0], setLoading = _c[1];
    var _d = React.useState([]), series = _d[0], setSeries = _d[1];
    var _e = React.useState([]), templateShare = _e[0], setTemplateShare = _e[1];
    var _f = React.useState([]), keywords = _f[0], setKeywords = _f[1];
    var _g = React.useState(0), avgATS = _g[0], setAvgATS = _g[1];
    var _h = React.useState({
        views: 0, downloads: 0, resumes: 0, avgATS: 0
    }), totals = _h[0], setTotals = _h[1];
    // responsive flags
    var isXS = useMediaQuery("(max-width: 360px)");
    var isSM = useMediaQuery("(max-width: 640px)");
    var abortRef = React.useRef(null);
    var load = React.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var ac, _a, from, to, tParam, _b, views, downloads, summary, kw, vMap, dMap, avg, merged, start, end, d, key, totalValue_1, share, kwBars, resumesTotal, resList, _c, e_1;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    setLoading(true);
                    (_d = abortRef.current) === null || _d === void 0 ? void 0 : _d.abort();
                    ac = new AbortController();
                    abortRef.current = ac;
                    _a = getRangeDates(range), from = _a.from, to = _a.to;
                    tParam = template && template !== "all" ? "&template=" + encodeURIComponent(template) : "";
                    _r.label = 1;
                case 1:
                    _r.trys.push([1, 7, 8, 9]);
                    return [4 /*yield*/, Promise.all([
                            fetchJSON("/api/analytics/series?metric=views&from=" + from + "&to=" + to + tParam),
                            fetchJSON("/api/analytics/series?metric=downloads&from=" + from + "&to=" + to + tParam),
                            fetchJSON("/api/analytics/summary?from=" + from + "&to=" + to + tParam),
                            fetchJSON("/api/analytics/keywords?from=" + from + "&to=" + to + "&limit=16" + tParam),
                        ])];
                case 2:
                    _b = _r.sent(), views = _b[0], downloads = _b[1], summary = _b[2], kw = _b[3];
                    vMap = new Map(views.series.map(function (r) { return [r.date, r.value]; }));
                    dMap = new Map(downloads.series.map(function (r) { return [r.date, r.value]; }));
                    avg = Math.round((_f = (_e = summary.ats) === null || _e === void 0 ? void 0 : _e.avgScore) !== null && _f !== void 0 ? _f : 0);
                    merged = [];
                    {
                        start = new Date(from + "T00:00:00Z");
                        end = new Date(to + "T00:00:00Z");
                        for (d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
                            key = d.toISOString().slice(0, 10);
                            merged.push({
                                date: fmtMMMdd(key),
                                views: Number((_g = vMap.get(key)) !== null && _g !== void 0 ? _g : 0),
                                downloads: Number((_h = dMap.get(key)) !== null && _h !== void 0 ? _h : 0),
                                avgATS: avg
                            });
                        }
                    }
                    totalValue_1 = summary.templateShare.reduce(function (a, b) { return a + Number(b.value || 0); }, 0) || 0;
                    share = summary.templateShare.map(function (row) { return ({
                        name: row.template[0].toUpperCase() + row.template.slice(1),
                        value: totalValue_1 ? Math.round((Number(row.value) / totalValue_1) * 100) : 0
                    }); });
                    kwBars = ((_j = kw.matched) !== null && _j !== void 0 ? _j : []).slice(0, 16);
                    resumesTotal = 0;
                    _r.label = 3;
                case 3:
                    _r.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, fetchJSON("/api/resumes?perPage=1&page=1")];
                case 4:
                    resList = _r.sent();
                    resumesTotal = Number((_k = resList === null || resList === void 0 ? void 0 : resList.total) !== null && _k !== void 0 ? _k : 0);
                    return [3 /*break*/, 6];
                case 5:
                    _c = _r.sent();
                    resumesTotal = Math.max(share.length, 1) * 2;
                    return [3 /*break*/, 6];
                case 6:
                    setSeries(merged);
                    setTemplateShare(share);
                    setKeywords(kwBars);
                    setAvgATS(avg);
                    setTotals({
                        views: Number((_m = (_l = summary.totals) === null || _l === void 0 ? void 0 : _l.views) !== null && _m !== void 0 ? _m : 0),
                        downloads: Number((_p = (_o = summary.totals) === null || _o === void 0 ? void 0 : _o.downloads) !== null && _p !== void 0 ? _p : 0),
                        resumes: resumesTotal,
                        avgATS: avg
                    });
                    return [3 /*break*/, 9];
                case 7:
                    e_1 = _r.sent();
                    console.error(e_1);
                    react_hot_toast_1.toast.error((_q = e_1 === null || e_1 === void 0 ? void 0 : e_1.message) !== null && _q !== void 0 ? _q : "Failed to load analytics");
                    setSeries([]);
                    setTemplateShare([]);
                    setKeywords([]);
                    setAvgATS(0);
                    setTotals({ views: 0, downloads: 0, resumes: 0, avgATS: 0 });
                    return [3 /*break*/, 9];
                case 8:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); }, [range, template]);
    React.useEffect(function () { load(); }, [load]);
    function exportCSV() {
        var headers = ["index", "label", "downloads", "views", "avgATS"];
        var rows = series.map(function (d, i) { return [i + 1, d.date, d.downloads, d.views, d.avgATS]; });
        var csv = __spreadArrays([headers.join(",")], rows.map(function (r) { return r.join(","); })).join("\n");
        var blob = new Blob([csv], { type: "text/csv" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "analytics_" + range + (template !== "all" ? "_" + template : "") + ".csv";
        a.click();
        URL.revokeObjectURL(url);
    }
    var COLORS = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#22c55e"];
    var xTickSize = isSM ? 10 : 12;
    var yTickSize = isSM ? 10 : 12;
    var labelAngle = isXS ? -35 : 0;
    var axisInterval = (isSM ? "preserveStartEnd" : 0);
    return (React.createElement("div", { className: "mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-6" },
        React.createElement("div", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between" },
            React.createElement("div", null,
                React.createElement("h1", { className: "text-xl sm:text-2xl font-semibold tracking-tight" }, "Analytics"),
                React.createElement("p", { className: "text-sm text-muted-foreground" }, "Track resume performance, template adoption, and ATS trends.")),
            React.createElement("div", { className: "flex w-full sm:w-auto flex-col sm:flex-row gap-2" },
                React.createElement(button_1.Button, { variant: "outline", onClick: load, disabled: loading, className: "w-full sm:w-auto" },
                    React.createElement(lucide_react_1.RefreshCcw, { className: "mr-2 h-4 w-4 " + (loading ? "animate-spin" : "") }),
                    "Refresh"),
                React.createElement(button_1.Button, { onClick: exportCSV, disabled: !series.length, className: "w-full sm:w-auto" },
                    React.createElement(lucide_react_1.Download, { className: "mr-2 h-4 w-4" }),
                    "Export CSV"))),
        React.createElement(separator_1.Separator, { className: "my-4" }),
        React.createElement("div", { className: "flex flex-col gap-3 md:flex-row md:items-end" },
            React.createElement("div", { className: "grid w-full md:w-[220px] gap-1" },
                React.createElement(label_1.Label, null, "Time range"),
                React.createElement(select_1.Select, { value: range, onValueChange: function (v) { return setRange(v); } },
                    React.createElement(select_1.SelectTrigger, null,
                        React.createElement(select_1.SelectValue, { placeholder: "Select range" })),
                    React.createElement(select_1.SelectContent, null,
                        React.createElement(select_1.SelectItem, { value: "7d" }, "Last 7 days"),
                        React.createElement(select_1.SelectItem, { value: "30d" }, "Last 30 days"),
                        React.createElement(select_1.SelectItem, { value: "90d" }, "Last 90 days")))),
            React.createElement("div", { className: "grid w-full md:w-[220px] gap-1" },
                React.createElement(label_1.Label, null, "Template"),
                React.createElement(select_1.Select, { value: template, onValueChange: setTemplate },
                    React.createElement(select_1.SelectTrigger, null,
                        React.createElement(select_1.SelectValue, { placeholder: "All templates" })),
                    React.createElement(select_1.SelectContent, null,
                        React.createElement(select_1.SelectItem, { value: "all" }, "All"),
                        React.createElement(select_1.SelectItem, { value: "clean" }, "Clean"),
                        React.createElement(select_1.SelectItem, { value: "modern" }, "Modern"),
                        React.createElement(select_1.SelectItem, { value: "minimal" }, "Minimal"),
                        React.createElement(select_1.SelectItem, { value: "elegant" }, "Elegant")))),
            React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement(badge_1.Badge, { variant: "secondary", className: "h-9 rounded-sm px-3" }, loading ? "Loading…" : "Data: Live"),
                React.createElement(badge_1.Badge, { className: "h-9 rounded-sm px-3 hidden xs:inline-flex" }, "Realtime"))),
        React.createElement("div", { className: "mt-6 grid gap-3 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]" },
            React.createElement(KpiCard, { icon: lucide_react_1.FileText, label: "Resumes Created", value: String(totals.resumes), delta: "" }),
            React.createElement(KpiCard, { icon: lucide_react_1.Eye, label: "Total Views", value: String(totals.views), delta: "" }),
            React.createElement(KpiCard, { icon: lucide_react_1.BarChart3, label: "Downloads", value: String(totals.downloads), delta: "" }),
            React.createElement(KpiCard, { icon: lucide_react_1.Star, label: "Avg ATS Score", value: "" + totals.avgATS, delta: "" })),
        React.createElement("div", { className: "mt-6 flex flex-col gap-4 lg:flex-row" },
            React.createElement("div", { className: "flex-1 min-w-0 space-y-4" },
                React.createElement(ChartCard, { title: "ATS Score Trend", description: "Average ATS score across your resumes over time.", toolbar: React.createElement(SimpleLegend, { items: [
                            { label: "Avg ATS", className: "bg-primary" },
                            { label: "Downloads", className: "bg-sky-500" },
                        ] }) },
                    React.createElement("div", { className: "min-w-0 min-h-[220px] sm:min-h-[260px] lg:min-h-[300px] w-full" },
                        React.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", minWidth: 220, minHeight: 200, key: "ats-" + range + "-" + series.length },
                            React.createElement(recharts_1.AreaChart, { data: series, margin: { left: 6, right: 6, top: 10 } },
                                React.createElement("defs", null,
                                    React.createElement("linearGradient", { id: "fillPrimary", x1: "0", y1: "0", x2: "0", y2: "1" },
                                        React.createElement("stop", { offset: "5%", stopColor: "#6366f1", stopOpacity: 0.28 }),
                                        React.createElement("stop", { offset: "95%", stopColor: "#6366f1", stopOpacity: 0.04 }))),
                                React.createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb" }),
                                React.createElement(recharts_1.XAxis, { dataKey: "date", tick: { fontSize: xTickSize }, tickMargin: 8, interval: axisInterval, angle: labelAngle, dx: labelAngle ? -6 : 0 }),
                                React.createElement(recharts_1.YAxis, { yAxisId: "left", tick: { fontSize: yTickSize }, allowDecimals: false }),
                                React.createElement(recharts_1.YAxis, { yAxisId: "right", orientation: "right", tick: { fontSize: yTickSize }, allowDecimals: false }),
                                React.createElement(recharts_1.Tooltip, null),
                                React.createElement(recharts_1.Area, { yAxisId: "left", type: "monotone", dataKey: "avgATS", stroke: "#6366f1", fill: "url(#fillPrimary)" }),
                                React.createElement(recharts_1.Line, { yAxisId: "right", type: "monotone", dataKey: "downloads", stroke: "#06b6d4", dot: false }))))),
                React.createElement(ChartCard, { title: "Top Keywords Matched", description: "Most frequent matched skills across ATS analyses." },
                    React.createElement("div", { className: "min-w-0 min-h-[220px] sm:min-h-[260px] lg:min-h-[300px] w-full" },
                        React.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", minWidth: 220, minHeight: 200, key: "kw-" + range + "-" + keywords.length },
                            React.createElement(recharts_1.BarChart, { data: keywords, margin: { left: 6, right: 6, top: 10 } },
                                React.createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb" }),
                                React.createElement(recharts_1.XAxis, { dataKey: "keyword", tick: { fontSize: xTickSize }, interval: axisInterval, tickMargin: 8, angle: labelAngle, dx: labelAngle ? -6 : 0 }),
                                React.createElement(recharts_1.YAxis, { tick: { fontSize: yTickSize }, allowDecimals: false }),
                                React.createElement(recharts_1.Tooltip, null),
                                React.createElement(recharts_1.Bar, { dataKey: "count", radius: [6, 6, 0, 0], fill: "#10b981" })))))),
            React.createElement("div", { className: "w-full lg:w-[420px] lg:flex-none space-y-4 min-w-0" },
                React.createElement(ChartCard, { title: "Template Share", description: "Distribution of templates across your resumes (by views)." },
                    React.createElement("div", { className: "min-w-0 min-h-[220px] sm:min-h-[260px] lg:min-h-[300px] w-full" },
                        React.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", minWidth: 220, minHeight: 200, key: "share-" + range + "-" + templateShare.length },
                            React.createElement(recharts_1.PieChart, null,
                                React.createElement(recharts_1.Tooltip, null),
                                React.createElement(recharts_1.Pie, { data: templateShare, dataKey: "value", nameKey: "name", innerRadius: isSM ? 48 : 60, outerRadius: isSM ? 76 : 90, paddingAngle: 4, stroke: "#fff" }, templateShare.map(function (_, idx) { return (React.createElement(recharts_1.Cell, { key: idx, fill: COLORS[idx % COLORS.length] })); }))))),
                    React.createElement("div", { className: "mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2" }, templateShare.length ? templateShare.map(function (t, i) { return (React.createElement("div", { key: t.name, className: "flex items-center justify-between rounded-md border p-2 text-sm" },
                        React.createElement("div", { className: "flex items-center gap-2" },
                            React.createElement("span", { className: "inline-block h-2.5 w-2.5 rounded-sm", style: { background: COLORS[i % COLORS.length] } }),
                            React.createElement("span", { className: "truncate" }, t.name)),
                        React.createElement("span", { className: "font-medium" },
                            t.value,
                            "%"))); }) : (React.createElement("div", { className: "text-sm text-muted-foreground col-span-2" }, "No data")))),
                React.createElement(card_1.Card, null,
                    React.createElement(card_1.CardHeader, { className: "pb-2" },
                        React.createElement(card_1.CardTitle, { className: "text-base" }, "Quality Meter"),
                        React.createElement(card_1.CardDescription, null, "Overall health based on ATS & engagement.")),
                    React.createElement(card_1.CardContent, { className: "space-y-3" },
                        React.createElement("div", { className: "flex items-center justify-between text-sm" },
                            React.createElement("span", null, "Composite Score"),
                            React.createElement("span", { className: "font-medium" }, Math.min(100, Math.round((avgATS * 0.6) + (totals.downloads / 3) * 0.4)))),
                        React.createElement(progress_1.Progress, { value: Math.min(100, Math.round((avgATS * 0.6) + (totals.downloads / 3) * 0.4)) }),
                        React.createElement("div", { className: "flex flex-wrap gap-2" },
                            React.createElement(badge_1.Badge, { variant: "secondary" }, "Readable"),
                            React.createElement(badge_1.Badge, { variant: "secondary" }, "ATS-friendly"),
                            React.createElement(badge_1.Badge, { variant: "secondary" }, "Popular Templates")))))),
        React.createElement("div", { className: "mt-6 grid gap-4 md:grid-cols-2" },
            React.createElement(ChartCard, { title: "Views vs Downloads", description: "Conversion from views into downloads." },
                React.createElement("div", { className: "min-w-0 min-h-[220px] sm:min-h-[260px] lg:min-h-[300px] w-full" },
                    React.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", minWidth: 220, minHeight: 200, key: "vd-" + range + "-" + series.length },
                        React.createElement(recharts_1.LineChart, { data: series, margin: { left: 6, right: 6, top: 10 } },
                            React.createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb" }),
                            React.createElement(recharts_1.XAxis, { dataKey: "date", tick: { fontSize: xTickSize }, interval: axisInterval, tickMargin: 8, angle: labelAngle, dx: labelAngle ? -6 : 0 }),
                            React.createElement(recharts_1.YAxis, { tick: { fontSize: yTickSize }, allowDecimals: false }),
                            React.createElement(recharts_1.Tooltip, null),
                            React.createElement(recharts_1.Line, { type: "monotone", dataKey: "views", stroke: "#0ea5e9", dot: false }),
                            React.createElement(recharts_1.Line, { type: "monotone", dataKey: "downloads", stroke: "#22c55e", dot: false }))))),
            React.createElement(card_1.Card, null,
                React.createElement(card_1.CardHeader, { className: "pb-2" },
                    React.createElement(card_1.CardTitle, { className: "text-base" }, "Insights"),
                    React.createElement(card_1.CardDescription, null, "Quick highlights from the current range.")),
                React.createElement(card_1.CardContent, { className: "space-y-3 text-sm" },
                    React.createElement("div", { className: "flex items-start gap-2" },
                        React.createElement(lucide_react_1.TrendingUp, { className: "mt-0.5 h-4 w-4 text-emerald-600" }),
                        React.createElement("p", null,
                            React.createElement("b", null, "ATS average:"),
                            " ",
                            React.createElement("b", null, avgATS),
                            ". Tailor bullets to frequent matches like",
                            " ",
                            keywords.slice(0, 2).map(function (k, i) { return (React.createElement("b", { key: k.keyword },
                                i ? ", " : "",
                                k.keyword)); }),
                            keywords.length ? "" : "—",
                            ".")),
                    React.createElement("div", { className: "flex items-start gap-2" },
                        React.createElement(lucide_react_1.BarChart3, { className: "mt-0.5 h-4 w-4 text-indigo-600" }),
                        React.createElement("p", null,
                            React.createElement("b", null, "Template adoption:"),
                            " ",
                            templateShare.length ? React.createElement("b", null, templateShare[0].name) : "—",
                            " leads by views.")),
                    React.createElement("div", { className: "flex items-start gap-2" },
                        React.createElement(lucide_react_1.FileText, { className: "mt-0.5 h-4 w-4 text-sky-600" }),
                        React.createElement("p", null,
                            React.createElement("b", null, "Content tip:"),
                            " Strong verbs in bullets improve match rates (e.g., \u201COptimized\u201D, \u201CDelivered\u201D, \u201CReduced\u201D).")))))));
}
exports["default"] = AnalyticsPage;
