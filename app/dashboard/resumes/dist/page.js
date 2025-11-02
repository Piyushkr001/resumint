// app/dashboard/resumes/page.tsx
"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var react_hot_toast_1 = require("react-hot-toast");
// shadcn/ui
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var card_1 = require("@/components/ui/card");
var table_1 = require("@/components/ui/table");
var badge_1 = require("@/components/ui/badge");
var separator_1 = require("@/components/ui/separator");
var skeleton_1 = require("@/components/ui/skeleton");
var label_1 = require("@/components/ui/label");
var dialog_1 = require("@/components/ui/dialog");
var alert_dialog_1 = require("@/components/ui/alert-dialog");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var select_1 = require("@/components/ui/select");
var pagination_1 = require("@/components/ui/pagination");
// icons
var lucide_react_1 = require("lucide-react");
/* ------------------------------------------------------------------ */
/* Data hook - calls your API                                          */
/* ------------------------------------------------------------------ */
function useResumes() {
    var _this = this;
    var router = navigation_1.useRouter();
    var _a = React.useState(true), loading = _a[0], setLoading = _a[1];
    var _b = React.useState(null), error = _b[0], setError = _b[1];
    var _c = React.useState(""), search = _c[0], setSearch = _c[1];
    var _d = React.useState("all"), template = _d[0], setTemplate = _d[1];
    var _e = React.useState("updated_desc"), sort = _e[0], setSort = _e[1];
    var _f = React.useState("any"), status = _f[0], setStatus = _f[1];
    var _g = React.useState(1), page = _g[0], setPage = _g[1];
    var _h = React.useState(10), perPage = _h[0], setPerPage = _h[1];
    var _j = React.useState({
        items: [],
        total: 0,
        page: page,
        perPage: perPage
    }), data = _j[0], setData = _j[1];
    // optional: abort older fetches
    var abortRef = React.useRef(null);
    var load = React.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var ac, qs, res, _a, json, items, e_1;
        var _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    (_b = abortRef.current) === null || _b === void 0 ? void 0 : _b.abort();
                    ac = new AbortController();
                    abortRef.current = ac;
                    _j.label = 1;
                case 1:
                    _j.trys.push([1, 6, 7, 8]);
                    qs = new URLSearchParams();
                    if (search.trim())
                        qs.set("search", search.trim());
                    if (template !== "all")
                        qs.set("template", template);
                    if (status !== "any")
                        qs.set("status", status);
                    qs.set("sort", sort);
                    qs.set("page", String(page));
                    qs.set("perPage", String(perPage));
                    return [4 /*yield*/, fetch("/api/resumes?" + qs.toString(), {
                            method: "GET",
                            credentials: "include",
                            cache: "no-store",
                            signal: ac.signal
                        })];
                case 2:
                    res = _j.sent();
                    if (res.status === 401) {
                        react_hot_toast_1["default"].error("Please log in to view your resumes.");
                        router.push("/login?next=/dashboard/resumes");
                        setData(function (d) { return (__assign(__assign({}, d), { items: [], total: 0 })); });
                        return [2 /*return*/];
                    }
                    if (!!res.ok) return [3 /*break*/, 4];
                    _a = Error.bind;
                    return [4 /*yield*/, res.text()];
                case 3: throw new (_a.apply(Error, [void 0, _j.sent()]))();
                case 4: return [4 /*yield*/, res.json()];
                case 5:
                    json = (_j.sent());
                    items = ((_c = json.items) !== null && _c !== void 0 ? _c : []).map(function (r) {
                        var _a, _b, _c, _d, _e;
                        return ({
                            id: r.id,
                            title: r.title,
                            template: r.template,
                            ats: (_b = (_a = r.ats) !== null && _a !== void 0 ? _a : r.atsScore) !== null && _b !== void 0 ? _b : null,
                            updatedAtISO: (_e = (_d = (_c = r.updatedAtISO) !== null && _c !== void 0 ? _c : r.updatedAt) !== null && _d !== void 0 ? _d : r.updated_at) !== null && _e !== void 0 ? _e : new Date().toISOString()
                        });
                    });
                    setData({
                        items: items,
                        total: Number((_e = (_d = json.total) !== null && _d !== void 0 ? _d : items.length) !== null && _e !== void 0 ? _e : 0),
                        page: Number((_f = json.page) !== null && _f !== void 0 ? _f : page),
                        perPage: Number((_g = json.perPage) !== null && _g !== void 0 ? _g : perPage)
                    });
                    return [3 /*break*/, 8];
                case 6:
                    e_1 = _j.sent();
                    if ((e_1 === null || e_1 === void 0 ? void 0 : e_1.name) === "AbortError")
                        return [2 /*return*/];
                    setError((_h = e_1 === null || e_1 === void 0 ? void 0 : e_1.message) !== null && _h !== void 0 ? _h : "Failed to load resumes");
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); }, [router, search, template, status, sort, page, perPage]);
    React.useEffect(function () { load(); }, [load]);
    return {
        loading: loading, error: error, data: data,
        search: search, setSearch: setSearch,
        template: template, setTemplate: setTemplate,
        status: status, setStatus: setStatus,
        sort: sort, setSort: setSort,
        page: page, setPage: setPage,
        perPage: perPage, setPerPage: setPerPage,
        reload: load
    };
}
/* ------------------------------------------------------------------ */
/* Helpers & skeletons                                                 */
/* ------------------------------------------------------------------ */
function formatDate(iso) {
    var d = new Date(iso);
    return d.toLocaleString(undefined, { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}
function RowSkeleton() {
    return (React.createElement("div", { className: "flex items-center justify-between rounded-md border p-3" },
        React.createElement("div", { className: "flex items-center gap-3 w-[60%]" },
            React.createElement(skeleton_1.Skeleton, { className: "h-5 w-5 rounded" }),
            React.createElement("div", { className: "flex-1 space-y-2" },
                React.createElement(skeleton_1.Skeleton, { className: "h-4 w-1/2" }),
                React.createElement(skeleton_1.Skeleton, { className: "h-3 w-1/3" }))),
        React.createElement("div", { className: "hidden md:flex items-center gap-3" },
            React.createElement(skeleton_1.Skeleton, { className: "h-6 w-10" }),
            React.createElement(skeleton_1.Skeleton, { className: "h-8 w-24" }),
            React.createElement(skeleton_1.Skeleton, { className: "h-8 w-8" }))));
}
/* ------------------------------------------------------------------ */
/* Row actions                                                         */
/* ------------------------------------------------------------------ */
function RowActions(_a) {
    var resume = _a.resume, onChanged = _a.onChanged;
    var _b = React.useState(false), renameOpen = _b[0], setRenameOpen = _b[1];
    var _c = React.useState(false), deleteOpen = _c[0], setDeleteOpen = _c[1];
    var _d = React.useState(resume.title), newTitle = _d[0], setNewTitle = _d[1];
    function handleRename() {
        return __awaiter(this, void 0, void 0, function () {
            var p, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        p = fetch("/api/resumes/" + resume.id, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({ title: newTitle })
                        });
                        return [4 /*yield*/, react_hot_toast_1["default"].promise(p, {
                                loading: "Renaming…",
                                success: "Renamed",
                                error: "Rename failed"
                            })];
                    case 1:
                        _b.sent();
                        setRenameOpen(false);
                        onChanged();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function handleDuplicate() {
        return __awaiter(this, void 0, void 0, function () {
            var p, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        p = fetch("/api/resumes/" + resume.id + "/duplicate", {
                            method: "POST",
                            credentials: "include"
                        });
                        return [4 /*yield*/, react_hot_toast_1["default"].promise(p, {
                                loading: "Duplicating…",
                                success: "Duplicated",
                                error: "Duplicate failed"
                            })];
                    case 1:
                        _b.sent();
                        onChanged();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function handleDelete() {
        return __awaiter(this, void 0, void 0, function () {
            var p, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        p = fetch("/api/resumes/" + resume.id, {
                            method: "DELETE",
                            credentials: "include"
                        });
                        return [4 /*yield*/, react_hot_toast_1["default"].promise(p, {
                                loading: "Deleting…",
                                success: "Deleted",
                                error: "Delete failed"
                            })];
                    case 1:
                        _b.sent();
                        setDeleteOpen(false);
                        onChanged();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    var viewPdfUrl = "/api/resumes/" + resume.id + "/export?format=pdf";
    var downloadPdfUrl = "/api/resumes/" + resume.id + "/export?format=pdf&download=1";
    var pageUrl = "/resumes/" + resume.id;
    function handleViewPdf() {
        window.open(viewPdfUrl, "_blank", "noopener,noreferrer");
    }
    function handleDownloadPdf() {
        window.open(downloadPdfUrl, "_blank", "noopener,noreferrer");
    }
    function copy(text, label) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, navigator.clipboard.writeText(text)];
                    case 1:
                        _b.sent();
                        react_hot_toast_1["default"].success(label + " copied");
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        react_hot_toast_1["default"].error("Copy failed");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(button_1.Button, { size: "icon", variant: "ghost", className: "h-8 w-8", "aria-label": "Export PDF", onClick: handleViewPdf, title: "View PDF" },
            React.createElement(lucide_react_1.Download, { className: "h-4 w-4" })),
        React.createElement(dropdown_menu_1.DropdownMenu, null,
            React.createElement(dropdown_menu_1.DropdownMenuTrigger, { asChild: true },
                React.createElement(button_1.Button, { size: "icon", variant: "ghost", "aria-label": "More actions" },
                    React.createElement(lucide_react_1.MoreHorizontal, { className: "h-4 w-4" }))),
            React.createElement(dropdown_menu_1.DropdownMenuContent, { align: "end", className: "w-56" },
                React.createElement(dropdown_menu_1.DropdownMenuLabel, null, "Actions"),
                React.createElement(dropdown_menu_1.DropdownMenuSeparator, null),
                React.createElement(dropdown_menu_1.DropdownMenuItem, { asChild: true },
                    React.createElement(link_1["default"], { href: pageUrl },
                        React.createElement(lucide_react_1.FileText, { className: "mr-2 h-4 w-4" }),
                        " Open")),
                React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: handleViewPdf },
                    React.createElement(lucide_react_1.ExternalLink, { className: "mr-2 h-4 w-4" }),
                    " View PDF"),
                React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: handleDownloadPdf },
                    React.createElement(lucide_react_1.Download, { className: "mr-2 h-4 w-4" }),
                    " Download PDF"),
                React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return copy(location.origin + pageUrl, "Page URL"); } },
                    React.createElement(lucide_react_1.Share2, { className: "mr-2 h-4 w-4" }),
                    " Copy page URL"),
                React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return copy(location.origin + downloadPdfUrl, "Export URL"); } },
                    React.createElement(lucide_react_1.Copy, { className: "mr-2 h-4 w-4" }),
                    " Copy export URL"),
                React.createElement(dropdown_menu_1.DropdownMenuSeparator, null),
                React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: handleDuplicate },
                    React.createElement(lucide_react_1.Copy, { className: "mr-2 h-4 w-4" }),
                    " Duplicate"),
                React.createElement(dropdown_menu_1.DropdownMenuItem, { onClick: function () { return setRenameOpen(true); } },
                    React.createElement(lucide_react_1.Pencil, { className: "mr-2 h-4 w-4" }),
                    " Rename"),
                React.createElement(dropdown_menu_1.DropdownMenuSeparator, null),
                React.createElement(dropdown_menu_1.DropdownMenuItem, { className: "text-destructive focus:text-destructive", onClick: function () { return setDeleteOpen(true); } },
                    React.createElement(lucide_react_1.Trash2, { className: "mr-2 h-4 w-4" }),
                    " Delete"))),
        React.createElement(dialog_1.Dialog, { open: renameOpen, onOpenChange: setRenameOpen },
            React.createElement(dialog_1.DialogContent, null,
                React.createElement(dialog_1.DialogHeader, null,
                    React.createElement(dialog_1.DialogTitle, null, "Rename resume"),
                    React.createElement(dialog_1.DialogDescription, null, "Give your resume a clear, recognizable title.")),
                React.createElement("div", { className: "grid gap-2" },
                    React.createElement(label_1.Label, { htmlFor: "newTitle" }, "Title"),
                    React.createElement(input_1.Input, { id: "newTitle", value: newTitle, onChange: function (e) { return setNewTitle(e.target.value); }, onKeyDown: function (e) { return e.key === "Enter" && newTitle.trim() && handleRename(); } })),
                React.createElement(dialog_1.DialogFooter, { className: "gap-2 sm:justify-end" },
                    React.createElement(dialog_1.DialogClose, { asChild: true },
                        React.createElement(button_1.Button, { variant: "outline" }, "Cancel")),
                    React.createElement(button_1.Button, { onClick: handleRename, disabled: !newTitle.trim() }, "Save")))),
        React.createElement(alert_dialog_1.AlertDialog, { open: deleteOpen, onOpenChange: setDeleteOpen },
            React.createElement(alert_dialog_1.AlertDialogContent, null,
                React.createElement(alert_dialog_1.AlertDialogHeader, null,
                    React.createElement(alert_dialog_1.AlertDialogTitle, null, "Delete this resume?"),
                    React.createElement(alert_dialog_1.AlertDialogDescription, null,
                        "This action cannot be undone. The resume \u201C",
                        resume.title,
                        "\u201D will be permanently deleted.")),
                React.createElement("div", { className: "flex justify-end gap-2" },
                    React.createElement(alert_dialog_1.AlertDialogCancel, null, "Cancel"),
                    React.createElement(alert_dialog_1.AlertDialogAction, { className: "bg-destructive hover:bg-destructive/90", onClick: handleDelete }, "Delete"))))));
}
/* ------------------------------------------------------------------ */
/* Sortable head cell                                                  */
/* ------------------------------------------------------------------ */
function SortHead(_a) {
    var children = _a.children, activeKey = _a.activeKey, thisKey = _a.thisKey, sort = _a.sort, setSort = _a.setSort, _b = _a.className, className = _b === void 0 ? "" : _b;
    var isThis = activeKey === thisKey;
    var dir = isThis && sort.endsWith("_asc") ? "asc" : isThis && sort.endsWith("_desc") ? "desc" : null;
    function toggle() {
        if (!isThis) {
            setSort(thisKey + "_desc"); // default to desc on first click
            return;
        }
        setSort(dir === "desc" ? thisKey + "_asc" : thisKey + "_desc");
    }
    return (React.createElement(table_1.TableHead, { onClick: toggle, className: "cursor-pointer select-none " + className },
        React.createElement("div", { className: "inline-flex items-center gap-1" },
            children,
            " ",
            React.createElement(lucide_react_1.ArrowUpDown, { className: "h-4 w-4 " + (isThis ? "opacity-100" : "opacity-40") }))));
}
/* ------------------------------------------------------------------ */
/* Table (desktop) + Cards (mobile)                                    */
/* ------------------------------------------------------------------ */
function ResumesTable(_a) {
    var items = _a.items, onChanged = _a.onChanged, sort = _a.sort, setSort = _a.setSort;
    var activeKey = sort.split("_")[0];
    return (React.createElement("div", { className: "rounded-lg border" },
        React.createElement(table_1.Table, null,
            React.createElement(table_1.TableHeader, null,
                React.createElement(table_1.TableRow, null,
                    React.createElement(SortHead, { activeKey: activeKey, thisKey: "title", sort: sort, setSort: setSort, className: "w-[50%]" }, "Title"),
                    React.createElement(table_1.TableHead, null, "Template"),
                    React.createElement(SortHead, { activeKey: activeKey, thisKey: "ats", sort: sort, setSort: setSort }, "ATS"),
                    React.createElement(SortHead, { activeKey: activeKey, thisKey: "updated", sort: sort, setSort: setSort }, "Updated"),
                    React.createElement(table_1.TableHead, { className: "text-right" }, "Actions"))),
            React.createElement(table_1.TableBody, null,
                items.map(function (r) { return (React.createElement(table_1.TableRow, { key: r.id },
                    React.createElement(table_1.TableCell, { className: "font-medium" },
                        React.createElement("div", { className: "flex items-center gap-2" },
                            React.createElement(lucide_react_1.FileText, { className: "h-4 w-4 text-muted-foreground" }),
                            React.createElement("span", { className: "truncate" }, r.title))),
                    React.createElement(table_1.TableCell, null, r.template),
                    React.createElement(table_1.TableCell, null, typeof r.ats === "number"
                        ? React.createElement(badge_1.Badge, { variant: r.ats >= 85 ? "default" : "secondary" }, r.ats)
                        : React.createElement("span", { className: "text-muted-foreground" }, "\u2014")),
                    React.createElement(table_1.TableCell, null, formatDate(r.updatedAtISO)),
                    React.createElement(table_1.TableCell, { className: "text-right" },
                        React.createElement("div", { className: "flex justify-end gap-1" },
                            React.createElement(button_1.Button, { asChild: true, size: "sm", variant: "outline", className: "h-8 px-3" },
                                React.createElement(link_1["default"], { href: "/resumes/" + r.id }, "Open")),
                            React.createElement(RowActions, { resume: r, onChanged: onChanged }))))); }),
                items.length === 0 && (React.createElement(table_1.TableRow, null,
                    React.createElement(table_1.TableCell, { colSpan: 5, className: "text-center text-muted-foreground" }, "No resumes found.")))))));
}
function ResumesCards(_a) {
    var items = _a.items, onChanged = _a.onChanged;
    if (!items.length) {
        return (React.createElement(card_1.Card, { className: "border-dashed" },
            React.createElement(card_1.CardContent, { className: "p-6 text-center text-sm text-muted-foreground" }, "No resumes yet.")));
    }
    return (React.createElement("div", { className: "grid gap-3 sm:grid-cols-2" }, items.map(function (r) { return (React.createElement(card_1.Card, { key: r.id },
        React.createElement(card_1.CardHeader, { className: "pb-2" },
            React.createElement(card_1.CardTitle, { className: "text-base" }, r.title),
            React.createElement(card_1.CardDescription, null,
                r.template,
                " \u2022 ",
                formatDate(r.updatedAtISO))),
        React.createElement(card_1.CardFooter, { className: "flex items-center justify-between" },
            React.createElement("div", null, typeof r.ats === "number" ? (React.createElement(badge_1.Badge, { variant: r.ats >= 85 ? "default" : "secondary" },
                "ATS ",
                r.ats)) : (React.createElement("span", { className: "text-xs text-muted-foreground" }, "ATS \u2014"))),
            React.createElement("div", { className: "flex items-center gap-1" },
                React.createElement(button_1.Button, { asChild: true, size: "sm", variant: "outline" },
                    React.createElement(link_1["default"], { href: "/resumes/" + r.id }, "Open")),
                React.createElement(RowActions, { resume: r, onChanged: onChanged }))))); })));
}
/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
function ResumesPage() {
    var _a = useResumes(), loading = _a.loading, error = _a.error, data = _a.data, reload = _a.reload, search = _a.search, setSearch = _a.setSearch, template = _a.template, setTemplate = _a.setTemplate, status = _a.status, setStatus = _a.setStatus, sort = _a.sort, setSort = _a.setSort, page = _a.page, setPage = _a.setPage, perPage = _a.perPage, setPerPage = _a.setPerPage;
    var totalPages = Math.max(1, Math.ceil(data.total / data.perPage));
    return (React.createElement("div", { className: "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6" },
        React.createElement("div", { className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between" },
            React.createElement("div", null,
                React.createElement("h1", { className: "text-2xl font-semibold tracking-tight" }, "Resumes"),
                React.createElement("p", { className: "text-sm text-muted-foreground" }, "Manage all your resumes in one place.")),
            React.createElement("div", { className: "flex w-full gap-2 md:w-auto" },
                React.createElement("div", { className: "relative w-full md:w-80" },
                    React.createElement(lucide_react_1.Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
                    React.createElement(input_1.Input, { value: search, onChange: function (e) { return setSearch(e.target.value); }, placeholder: "Search resumes\u2026", className: "pl-9", onKeyDown: function (e) { return e.key === "Enter" && reload(); } })),
                React.createElement(button_1.Button, { asChild: true },
                    React.createElement(link_1["default"], { href: "/resumes/new" },
                        React.createElement(lucide_react_1.Plus, { className: "mr-2 h-4 w-4" }),
                        "Create New Resume")),
                React.createElement(button_1.Button, { variant: "outline", onClick: reload, disabled: loading },
                    React.createElement(lucide_react_1.RefreshCcw, { className: "mr-2 h-4 w-4 " + (loading ? "animate-spin" : "") }),
                    "Refresh"))),
        React.createElement(separator_1.Separator, { className: "my-4" }),
        React.createElement("div", { className: "grid gap-3 sm:grid-cols-4" },
            React.createElement("div", { className: "grid gap-1" },
                React.createElement(label_1.Label, null, "Template"),
                React.createElement(select_1.Select, { value: template, onValueChange: function (v) { setTemplate(v); setPage(1); } },
                    React.createElement(select_1.SelectTrigger, null,
                        React.createElement(select_1.SelectValue, { placeholder: "All templates" })),
                    React.createElement(select_1.SelectContent, null,
                        React.createElement(select_1.SelectItem, { value: "all" }, "All"),
                        React.createElement(select_1.SelectItem, { value: "clean" }, "Clean"),
                        React.createElement(select_1.SelectItem, { value: "modern" }, "Modern"),
                        React.createElement(select_1.SelectItem, { value: "minimal" }, "Minimal"),
                        React.createElement(select_1.SelectItem, { value: "elegant" }, "Elegant")))),
            React.createElement("div", { className: "grid gap-1" },
                React.createElement(label_1.Label, null, "Sort"),
                React.createElement(select_1.Select, { value: sort, onValueChange: function (v) { setSort(v); setPage(1); } },
                    React.createElement(select_1.SelectTrigger, null,
                        React.createElement("div", { className: "flex items-center gap-2" },
                            React.createElement(lucide_react_1.ArrowUpDown, { className: "h-4 w-4" }),
                            React.createElement(select_1.SelectValue, { placeholder: "Updated (desc)" }))),
                    React.createElement(select_1.SelectContent, null,
                        React.createElement(select_1.SelectItem, { value: "updated_desc" }, "Updated (newest)"),
                        React.createElement(select_1.SelectItem, { value: "updated_asc" }, "Updated (oldest)"),
                        React.createElement(select_1.SelectItem, { value: "ats_desc" }, "ATS (high \u2192 low)"),
                        React.createElement(select_1.SelectItem, { value: "ats_asc" }, "ATS (low \u2192 high)"),
                        React.createElement(select_1.SelectItem, { value: "title_asc" }, "Title (A \u2192 Z)"),
                        React.createElement(select_1.SelectItem, { value: "title_desc" }, "Title (Z \u2192 A)")))),
            React.createElement("div", { className: "grid gap-1" },
                React.createElement(label_1.Label, null, "Status"),
                React.createElement(select_1.Select, { value: status, onValueChange: function (v) { setStatus(v); setPage(1); } },
                    React.createElement(select_1.SelectTrigger, null,
                        React.createElement(select_1.SelectValue, { placeholder: "Any status" })),
                    React.createElement(select_1.SelectContent, null,
                        React.createElement(select_1.SelectItem, { value: "any" }, "Any"),
                        React.createElement(select_1.SelectItem, { value: "draft" }, "Draft"),
                        React.createElement(select_1.SelectItem, { value: "final" }, "Final")))),
            React.createElement("div", { className: "grid gap-1" },
                React.createElement(label_1.Label, null, "Per page"),
                React.createElement(select_1.Select, { value: String(perPage), onValueChange: function (v) { setPerPage(Number(v)); setPage(1); } },
                    React.createElement(select_1.SelectTrigger, null,
                        React.createElement(select_1.SelectValue, { placeholder: "10" })),
                    React.createElement(select_1.SelectContent, null,
                        React.createElement(select_1.SelectItem, { value: "10" }, "10"),
                        React.createElement(select_1.SelectItem, { value: "20" }, "20"),
                        React.createElement(select_1.SelectItem, { value: "50" }, "50"))))),
        React.createElement("div", { className: "mt-6 space-y-4" },
            error && (React.createElement("div", { className: "rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm" },
                React.createElement("b", null, "Error:"),
                " ",
                error)),
            loading ? (React.createElement("div", { className: "space-y-3" }, __spreadArrays(Array(4)).map(function (_, i) { return React.createElement(RowSkeleton, { key: i }); }))) : data.items.length === 0 ? (React.createElement(card_1.Card, { className: "border-border/60" },
                React.createElement(card_1.CardHeader, null,
                    React.createElement(card_1.CardTitle, null, "No resumes yet"),
                    React.createElement(card_1.CardDescription, null, "Create your first resume to get started.")),
                React.createElement(card_1.CardContent, null,
                    React.createElement("div", { className: "flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center" },
                        React.createElement("p", { className: "text-sm text-muted-foreground mb-4" }, "Use professional templates and get ATS-friendly suggestions as you write."),
                        React.createElement("div", { className: "flex flex-wrap items-center gap-2" },
                            React.createElement(button_1.Button, { asChild: true },
                                React.createElement(link_1["default"], { href: "/resumes/new" },
                                    React.createElement(lucide_react_1.Plus, { className: "mr-2 h-4 w-4" }),
                                    "Create Resume")),
                            React.createElement(button_1.Button, { asChild: true, variant: "outline" },
                                React.createElement(link_1["default"], { href: "/templates" }, "Browse Templates"))))))) : (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "hidden md:block" },
                    React.createElement(ResumesTable, { items: data.items, onChanged: reload, sort: sort, setSort: setSort })),
                React.createElement("div", { className: "md:hidden" },
                    React.createElement(ResumesCards, { items: data.items, onChanged: reload })),
                React.createElement("div", { className: "flex justify-end" },
                    React.createElement(pagination_1.Pagination, null,
                        React.createElement(pagination_1.PaginationContent, null,
                            React.createElement(pagination_1.PaginationItem, null,
                                React.createElement(pagination_1.PaginationPrevious, { href: "#", "aria-disabled": page <= 1, onClick: function (e) {
                                        e.preventDefault();
                                        if (page > 1)
                                            setPage(page - 1);
                                    } })),
                            React.createElement(pagination_1.PaginationItem, null,
                                React.createElement("span", { className: "px-3 py-2 text-sm text-muted-foreground" },
                                    "Page ",
                                    page,
                                    " of ",
                                    Math.max(1, Math.ceil(data.total / data.perPage)))),
                            React.createElement(pagination_1.PaginationItem, null,
                                React.createElement(pagination_1.PaginationNext, { href: "#", "aria-disabled": page >= Math.max(1, Math.ceil(data.total / data.perPage)), onClick: function (e) {
                                        e.preventDefault();
                                        var totalPages = Math.max(1, Math.ceil(data.total / data.perPage));
                                        if (page < totalPages)
                                            setPage(page + 1);
                                    } }))))))))));
}
exports["default"] = ResumesPage;
