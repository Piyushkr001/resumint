// app/dashboard/page.tsx
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
var react_1 = require("react");
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var react_hot_toast_1 = require("react-hot-toast");
// Toast-on-redirect helper (keep your existing component)
var AlreadyToast_1 = require("./AlreadyToast");
// shadcn/ui
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var table_1 = require("@/components/ui/table");
var progress_1 = require("@/components/ui/progress");
var separator_1 = require("@/components/ui/separator");
var avatar_1 = require("@/components/ui/avatar");
var skeleton_1 = require("@/components/ui/skeleton");
// icons
var lucide_react_1 = require("lucide-react");
/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
function readError(res) {
    return __awaiter(this, void 0, void 0, function () {
        var j, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 7]);
                    return [4 /*yield*/, res.json()];
                case 1:
                    j = _c.sent();
                    return [2 /*return*/, (j === null || j === void 0 ? void 0 : j.error) || (j === null || j === void 0 ? void 0 : j.message) || res.statusText];
                case 2:
                    _a = _c.sent();
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, res.text()];
                case 4: return [2 /*return*/, _c.sent()];
                case 5:
                    _b = _c.sent();
                    return [2 /*return*/, "Something went wrong"];
                case 6: return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
/* ------------------------------------------------------------------ */
/* Data hook → calls /api/dashboard (fixed: no refresh loop)           */
/* ------------------------------------------------------------------ */
function useDashboardData(onUnauthorized) {
    var _this = this;
    var _a = react_1["default"].useState(false), loading = _a[0], setLoading = _a[1];
    var _b = react_1["default"].useState(null), error = _b[0], setError = _b[1];
    var _c = react_1["default"].useState({
        kpis: [],
        resumes: [],
        insights: []
    }), data = _c[0], setData = _c[1];
    // Keep latest unauthorized callback in a ref so `load` can be stable
    var unauthorizedRef = react_1["default"].useRef(onUnauthorized);
    react_1["default"].useEffect(function () {
        unauthorizedRef.current = onUnauthorized;
    }, [onUnauthorized]);
    var load = react_1["default"].useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var ctrl, res, msg, j, e_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    ctrl = new AbortController();
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, fetch("/api/dashboard", {
                            method: "GET",
                            credentials: "include",
                            cache: "no-store",
                            headers: { Accept: "application/json" },
                            signal: ctrl.signal
                        })];
                case 2:
                    res = _c.sent();
                    if (res.status === 401) {
                        (_a = unauthorizedRef.current) === null || _a === void 0 ? void 0 : _a.call(unauthorizedRef);
                        return [2 /*return*/];
                    }
                    if (!!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, readError(res)];
                case 3:
                    msg = _c.sent();
                    throw new Error(msg);
                case 4: return [4 /*yield*/, res.json()];
                case 5:
                    j = (_c.sent());
                    setData({
                        kpis: Array.isArray(j === null || j === void 0 ? void 0 : j.kpis) ? j.kpis : [],
                        resumes: Array.isArray(j === null || j === void 0 ? void 0 : j.resumes) ? j.resumes : [],
                        insights: Array.isArray(j === null || j === void 0 ? void 0 : j.insights) ? j.insights : []
                    });
                    return [3 /*break*/, 8];
                case 6:
                    e_1 = _c.sent();
                    if ((e_1 === null || e_1 === void 0 ? void 0 : e_1.name) !== "AbortError") {
                        setError((_b = e_1 === null || e_1 === void 0 ? void 0 : e_1.message) !== null && _b !== void 0 ? _b : "Failed to load dashboard");
                    }
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/, function () { return ctrl.abort(); }];
            }
        });
    }); }, []); // <- stays stable
    react_1["default"].useEffect(function () {
        var cancelled = false;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!cancelled) return [3 /*break*/, 2];
                        return [4 /*yield*/, load()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); })();
        return function () {
            cancelled = true;
        };
    }, [load]);
    return { loading: loading, error: error, data: data, reload: load };
}
/* ------------------------------------------------------------------ */
/* UI Parts                                                            */
/* ------------------------------------------------------------------ */
function HeaderBar(props) {
    var onReload = props.onReload, loading = props.loading;
    return (react_1["default"].createElement("div", { className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between" },
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("h1", { className: "text-2xl font-semibold tracking-tight" }, "Dashboard"),
            react_1["default"].createElement("p", { className: "text-sm text-muted-foreground" }, "Overview of your resumes, ATS score and activity.")),
        react_1["default"].createElement("div", { className: "flex w-full gap-2 md:w-auto" },
            react_1["default"].createElement("div", { className: "relative w-full md:w-80" },
                react_1["default"].createElement(lucide_react_1.Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
                react_1["default"].createElement(input_1.Input, { placeholder: "Search resumes\u2026", className: "pl-9" })),
            react_1["default"].createElement(button_1.Button, { asChild: true, className: "whitespace-nowrap" },
                react_1["default"].createElement(link_1["default"], { href: "/resumes/new" },
                    react_1["default"].createElement(lucide_react_1.Plus, { className: "mr-2 h-4 w-4" }),
                    "New Resume")),
            react_1["default"].createElement(button_1.Button, { variant: "outline", onClick: onReload, disabled: loading, className: "whitespace-nowrap" },
                react_1["default"].createElement(lucide_react_1.RefreshCcw, { className: "mr-2 h-4 w-4 " + (loading ? "animate-spin" : "") }),
                "Refresh"))));
}
function KpiSkeleton() {
    return (react_1["default"].createElement(card_1.Card, { className: "border-border/60" },
        react_1["default"].createElement(card_1.CardHeader, { className: "pb-2" },
            react_1["default"].createElement(skeleton_1.Skeleton, { className: "h-3 w-24" }),
            react_1["default"].createElement(skeleton_1.Skeleton, { className: "mt-2 h-8 w-16" })),
        react_1["default"].createElement(card_1.CardFooter, { className: "pt-0" },
            react_1["default"].createElement(skeleton_1.Skeleton, { className: "h-6 w-16 rounded-full" }))));
}
function KpiCards(_a) {
    var items = _a.items;
    if (!items.length) {
        return (react_1["default"].createElement("div", { className: "mt-6 rounded-md border border-dashed p-4 text-sm text-muted-foreground" }, "KPI metrics will appear here once you start creating resumes and the backend is connected."));
    }
    return (react_1["default"].createElement("div", { className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" }, items.map(function (k) { return (react_1["default"].createElement(card_1.Card, { key: k.label, className: "border-border/60" },
        react_1["default"].createElement(card_1.CardHeader, { className: "pb-2" },
            react_1["default"].createElement(card_1.CardDescription, { className: "text-xs" }, k.label),
            react_1["default"].createElement(card_1.CardTitle, { className: "text-3xl font-bold" }, k.value)),
        react_1["default"].createElement(card_1.CardFooter, { className: "pt-0" },
            react_1["default"].createElement(badge_1.Badge, { variant: k.up ? "default" : "secondary", className: "gap-1 " + (k.up ? "bg-emerald-600 hover:bg-emerald-600" : "") },
                k.up ? (react_1["default"].createElement(lucide_react_1.ArrowUpRight, { className: "h-3.5 w-3.5" })) : (react_1["default"].createElement(lucide_react_1.ArrowDownRight, { className: "h-3.5 w-3.5" })),
                k.delta)))); })));
}
function RecentResumesSkeleton() {
    return (react_1["default"].createElement(card_1.Card, { className: "border-border/60 lg:col-span-2" },
        react_1["default"].createElement(card_1.CardHeader, { className: "pb-3" },
            react_1["default"].createElement(skeleton_1.Skeleton, { className: "h-4 w-32" }),
            react_1["default"].createElement(skeleton_1.Skeleton, { className: "mt-2 h-3 w-56" })),
        react_1["default"].createElement(card_1.CardContent, { className: "space-y-3 pt-0" }, __spreadArrays(Array(4)).map(function (_, i) { return (react_1["default"].createElement("div", { key: i, className: "flex items-center justify-between rounded-md border p-3" },
            react_1["default"].createElement("div", { className: "flex items-center gap-3" },
                react_1["default"].createElement(skeleton_1.Skeleton, { className: "h-7 w-7 rounded-full" }),
                react_1["default"].createElement("div", { className: "space-y-2" },
                    react_1["default"].createElement(skeleton_1.Skeleton, { className: "h-4 w-48" }),
                    react_1["default"].createElement(skeleton_1.Skeleton, { className: "h-3 w-24" }))),
            react_1["default"].createElement("div", { className: "flex gap-2" },
                react_1["default"].createElement(skeleton_1.Skeleton, { className: "h-8 w-16" }),
                react_1["default"].createElement(skeleton_1.Skeleton, { className: "h-8 w-8" })))); }))));
}
function RecentResumes(_a) {
    var rows = _a.rows;
    if (!rows.length) {
        return (react_1["default"].createElement(card_1.Card, { className: "border-border/60 lg:col-span-2" },
            react_1["default"].createElement(card_1.CardHeader, { className: "pb-3" },
                react_1["default"].createElement(card_1.CardTitle, null, "Recent Resumes"),
                react_1["default"].createElement(card_1.CardDescription, null, "You haven\u2019t created any resume yet.")),
            react_1["default"].createElement(card_1.CardContent, { className: "pt-0" },
                react_1["default"].createElement("div", { className: "flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center" },
                    react_1["default"].createElement("p", { className: "text-sm text-muted-foreground mb-4" }, "Start by creating your first resume with our templates."),
                    react_1["default"].createElement(button_1.Button, { asChild: true },
                        react_1["default"].createElement(link_1["default"], { href: "/resumes/new" },
                            react_1["default"].createElement(lucide_react_1.Plus, { className: "mr-2 h-4 w-4" }),
                            "Create Resume"))))));
    }
    return (react_1["default"].createElement(card_1.Card, { className: "border-border/60 lg:col-span-2" },
        react_1["default"].createElement(card_1.CardHeader, { className: "pb-3" },
            react_1["default"].createElement(card_1.CardTitle, null, "Recent Resumes"),
            react_1["default"].createElement(card_1.CardDescription, null, "Latest updates across your workspace")),
        react_1["default"].createElement(card_1.CardContent, { className: "pt-0" },
            react_1["default"].createElement("div", { className: "rounded-lg border" },
                react_1["default"].createElement(table_1.Table, null,
                    react_1["default"].createElement(table_1.TableHeader, null,
                        react_1["default"].createElement(table_1.TableRow, null,
                            react_1["default"].createElement(table_1.TableHead, null, "Resume"),
                            react_1["default"].createElement(table_1.TableHead, { className: "hidden md:table-cell" }, "Template"),
                            react_1["default"].createElement(table_1.TableHead, null, "ATS"),
                            react_1["default"].createElement(table_1.TableHead, { className: "hidden sm:table-cell" }, "Updated"),
                            react_1["default"].createElement(table_1.TableHead, { className: "text-right" }, "Actions"))),
                    react_1["default"].createElement(table_1.TableBody, null, rows.map(function (r) { return (react_1["default"].createElement(table_1.TableRow, { key: r.id },
                        react_1["default"].createElement(table_1.TableCell, { className: "font-medium" },
                            react_1["default"].createElement("div", { className: "flex items-center gap-2" },
                                react_1["default"].createElement(avatar_1.Avatar, { className: "h-7 w-7" },
                                    react_1["default"].createElement(avatar_1.AvatarFallback, null, "CV")),
                                react_1["default"].createElement("div", { className: "flex flex-col" },
                                    react_1["default"].createElement("span", { className: "truncate" }, r.title),
                                    react_1["default"].createElement("span", { className: "text-xs text-muted-foreground md:hidden" }, r.template)))),
                        react_1["default"].createElement(table_1.TableCell, { className: "hidden md:table-cell" }, r.template),
                        react_1["default"].createElement(table_1.TableCell, null,
                            react_1["default"].createElement(badge_1.Badge, { variant: r.ats >= 85 ? "default" : "secondary" }, r.ats)),
                        react_1["default"].createElement(table_1.TableCell, { className: "hidden sm:table-cell" }, r.updatedAt),
                        react_1["default"].createElement(table_1.TableCell, { className: "text-right" },
                            react_1["default"].createElement("div", { className: "flex justify-end gap-2" },
                                react_1["default"].createElement(button_1.Button, { asChild: true, size: "sm", variant: "outline", className: "h-8 px-3" },
                                    react_1["default"].createElement(link_1["default"], { href: "/resumes/" + r.id },
                                        react_1["default"].createElement(lucide_react_1.FileText, { className: "mr-1.5 h-4 w-4" }),
                                        "Open")))))); }))))),
        react_1["default"].createElement(card_1.CardFooter, { className: "justify-end" },
            react_1["default"].createElement(button_1.Button, { asChild: true, variant: "ghost", size: "sm" },
                react_1["default"].createElement(link_1["default"], { href: "/resumes" }, "View all")))));
}
function InsightsSkeleton() {
    return (react_1["default"].createElement(card_1.Card, { className: "border-border/60" },
        react_1["default"].createElement(card_1.CardHeader, { className: "pb-3" },
            react_1["default"].createElement(skeleton_1.Skeleton, { className: "h-4 w-36" }),
            react_1["default"].createElement(skeleton_1.Skeleton, { className: "mt-2 h-3 w-56" })),
        react_1["default"].createElement(card_1.CardContent, { className: "space-y-4" }, __spreadArrays(Array(4)).map(function (_, i) { return (react_1["default"].createElement("div", { key: i, className: "space-y-2" },
            react_1["default"].createElement(skeleton_1.Skeleton, { className: "h-3 w-48" }),
            react_1["default"].createElement(skeleton_1.Skeleton, { className: "h-2 w-full" }))); }))));
}
function Insights(_a) {
    var items = _a.items;
    return (react_1["default"].createElement(card_1.Card, { className: "border-border/60" },
        react_1["default"].createElement(card_1.CardHeader, { className: "pb-3" },
            react_1["default"].createElement(card_1.CardTitle, null, "Improvement Insights"),
            react_1["default"].createElement(card_1.CardDescription, null, "Where to focus next")),
        react_1["default"].createElement(card_1.CardContent, { className: "space-y-4" }, items.length === 0 ? (react_1["default"].createElement("p", { className: "text-sm text-muted-foreground" }, "No insights yet. Create a resume to see suggestions here.")) : (items.map(function (it) { return (react_1["default"].createElement("div", { key: it.name, className: "space-y-1.5" },
            react_1["default"].createElement("div", { className: "flex items-center justify-between" },
                react_1["default"].createElement("span", { className: "text-sm" }, it.name),
                react_1["default"].createElement("span", { className: "text-xs text-muted-foreground" },
                    it.progress,
                    "%")),
            react_1["default"].createElement(progress_1.Progress, { value: it.progress }))); })))));
}
function QuickActions() {
    return (react_1["default"].createElement(card_1.Card, { className: "border-border/60" },
        react_1["default"].createElement(card_1.CardHeader, { className: "pb-3" },
            react_1["default"].createElement(card_1.CardTitle, null, "Quick Actions"),
            react_1["default"].createElement(card_1.CardDescription, null, "Jump back into work")),
        react_1["default"].createElement(card_1.CardContent, { className: "grid gap-2" },
            react_1["default"].createElement(button_1.Button, { asChild: true },
                react_1["default"].createElement(link_1["default"], { href: "/resumes/new" },
                    react_1["default"].createElement(lucide_react_1.Plus, { className: "mr-2 h-4 w-4" }),
                    "Create New Resume")),
            react_1["default"].createElement(button_1.Button, { asChild: true, variant: "ghost" },
                react_1["default"].createElement(link_1["default"], { href: "/uploads" }, "Import from PDF"))),
        react_1["default"].createElement(separator_1.Separator, null),
        react_1["default"].createElement(card_1.CardFooter, { className: "justify-between text-xs text-muted-foreground" },
            react_1["default"].createElement("span", null, "Need help?"),
            react_1["default"].createElement(link_1["default"], { href: "/docs", className: "underline underline-offset-4" }, "Read the docs"))));
}
/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
function DashboardPage() {
    var router = navigation_1.useRouter();
    // Stable unauthorized handler prevents the hook from re-running endlessly
    var handleUnauthorized = react_1["default"].useCallback(function () {
        react_hot_toast_1["default"].error("Please log in to view your dashboard.");
        router.replace("/login?next=/dashboard");
    }, [router]);
    var _a = useDashboardData(handleUnauthorized), loading = _a.loading, error = _a.error, data = _a.data, reload = _a.reload;
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(AlreadyToast_1["default"], null),
        react_1["default"].createElement("div", { className: "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6" },
            react_1["default"].createElement(HeaderBar, { onReload: reload, loading: loading }),
            error && (react_1["default"].createElement("div", { className: "mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm" },
                react_1["default"].createElement("b", null, "Error:"),
                " ",
                error)),
            loading ? (react_1["default"].createElement("div", { className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" }, __spreadArrays(Array(4)).map(function (_, i) { return (react_1["default"].createElement(KpiSkeleton, { key: i })); }))) : (react_1["default"].createElement(KpiCards, { items: data.kpis })),
            react_1["default"].createElement("div", { className: "mt-6 grid gap-4 lg:grid-cols-3" }, loading ? (react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement(RecentResumesSkeleton, null),
                react_1["default"].createElement("div", { className: "grid gap-4" },
                    react_1["default"].createElement(InsightsSkeleton, null),
                    react_1["default"].createElement(QuickActions, null)))) : (react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement(RecentResumes, { rows: data.resumes }),
                react_1["default"].createElement("div", { className: "grid gap-4" },
                    react_1["default"].createElement(Insights, { items: data.insights }),
                    react_1["default"].createElement(QuickActions, null))))))));
}
exports["default"] = DashboardPage;
