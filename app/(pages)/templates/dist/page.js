// app/template/page.tsx
"use client";
"use strict";
exports.__esModule = true;
var React = require("react");
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var select_1 = require("@/components/ui/select");
var dialog_1 = require("@/components/ui/dialog");
var separator_1 = require("@/components/ui/separator");
var scroll_area_1 = require("@/components/ui/scroll-area");
var lucide_react_1 = require("lucide-react");
var TEMPLATES = [
    {
        id: "clean",
        name: "Clean",
        tagline: "Crisp, readable, and ATS-safe.",
        badges: ["ATS-friendly", "1-page"],
        bestFor: ["Product", "Frontend", "General"],
        highlights: ["Strong typographic hierarchy", "Simple sections", "Great for juniors/switchers"],
        popularity: 92
    },
    {
        id: "modern",
        name: "Modern",
        tagline: "Contemporary with subtle accents.",
        badges: ["ATS-friendly", "2-column"],
        bestFor: ["Design-leaning", "Frontend", "Full-stack"],
        highlights: ["Subtle accent color", "Compact header", "Dense content layout"],
        popularity: 88
    },
    {
        id: "minimal",
        name: "Minimal",
        tagline: "Ultra-simple, no distractions.",
        badges: ["ATS-friendly", "1-page"],
        bestFor: ["Research", "Backend", "Data/ML"],
        highlights: ["Spacious margins", "Few lines & rules", "Laser focus on content"],
        popularity: 81
    },
    {
        id: "elegant",
        name: "Elegant",
        tagline: "Polished with refined details.",
        badges: ["ATS-friendly", "2-column"],
        bestFor: ["Leadership", "Senior ICs", "Client-facing"],
        highlights: ["Accented headings", "Subtle dividers", "Excellent readability"],
        popularity: 86
    },
];
/* ------------------------------------------------------------------ */
/* Little Resume Preview (mock content just for visual feel)          */
/* ------------------------------------------------------------------ */
function TemplatePreview(_a) {
    var variant = _a.variant;
    var accent = variant === "clean" ? "bg-neutral-900"
        : variant === "modern" ? "bg-blue-600"
            : variant === "minimal" ? "bg-neutral-800"
                : "bg-purple-700";
    var border = variant === "modern" || variant === "elegant" ? "border border-border" : "border border-transparent";
    var headerAccent = variant === "modern" || variant === "elegant";
    return (React.createElement("div", { className: "w-full rounded-lg " + border + " bg-white dark:bg-neutral-950 p-5" },
        React.createElement("div", { className: "flex items-start justify-between gap-3" },
            React.createElement("div", { className: "min-w-0" },
                React.createElement("div", { className: "text-xl font-semibold leading-tight truncate" }, "Piyush Kumar"),
                React.createElement("div", { className: "text-xs text-muted-foreground" }, "Frontend Developer")),
            headerAccent && React.createElement("div", { className: "h-6 w-6 rounded-sm " + accent, "aria-hidden": true })),
        React.createElement(separator_1.Separator, { className: "my-4" }),
        React.createElement("div", { className: "flex flex-col gap-4 md:flex-row" },
            React.createElement("div", { className: "flex-1 space-y-3" },
                React.createElement("section", null,
                    React.createElement("div", { className: "mb-1 text-sm font-medium" }, "Experience"),
                    React.createElement("div", { className: "space-y-2" }, [0, 1].map(function (i) { return (React.createElement("div", { key: i, className: "rounded-md border border-dashed p-2" },
                        React.createElement("div", { className: "flex items-center justify-between" },
                            React.createElement("div", { className: "text-sm font-medium" }, "Frontend Engineer \u2022 Acme"),
                            React.createElement("div", { className: "text-[10px] text-muted-foreground" }, "2024 \u2014 Present")),
                        React.createElement("ul", { className: "mt-1 list-disc pl-4 text-[11px] text-muted-foreground" },
                            React.createElement("li", null, "Built accessible UI with Next.js + Shadcn."),
                            React.createElement("li", null, "Improved TTI by ~30% via code-splitting.")))); }))),
                React.createElement("section", null,
                    React.createElement("div", { className: "mb-1 text-sm font-medium" }, "Education"),
                    React.createElement("div", { className: "rounded-md border border-dashed p-2" },
                        React.createElement("div", { className: "text-sm font-medium" }, "B.Tech \u2022 BIT Mesra"),
                        React.createElement("div", { className: "text-[11px] text-muted-foreground" }, "2019 \u2014 2023 \u2022 Grade: 8.2 / 10")))),
            React.createElement("div", { className: "w-full md:w-64 md:flex-none space-y-3" },
                React.createElement("section", null,
                    React.createElement("div", { className: "mb-1 text-sm font-medium" }, "Summary"),
                    React.createElement("p", { className: "text-[11px] text-muted-foreground" }, "Frontend dev focused on Next.js, TypeScript, and design-systems. Loves performance, accessibility, and crisp UI.")),
                React.createElement("section", null,
                    React.createElement("div", { className: "mb-1 text-sm font-medium" }, "Skills"),
                    React.createElement("div", { className: "flex flex-wrap gap-1" }, ["Next.js", "TypeScript", "Shadcn", "Tailwind", "Drizzle"].map(function (s) { return (React.createElement("span", { key: s, className: "rounded border px-2 py-0.5 text-[10px] text-muted-foreground" }, s)); })))))));
}
/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */
function TemplateCard(_a) {
    var t = _a.t, onUse = _a.onUse;
    return (React.createElement(card_1.Card, { className: "flex h-full flex-col" },
        React.createElement(card_1.CardHeader, { className: "pb-3" },
            React.createElement("div", { className: "flex items-start justify-between gap-2" },
                React.createElement("div", null,
                    React.createElement(card_1.CardTitle, { className: "text-base" }, t.name),
                    React.createElement(card_1.CardDescription, { className: "mt-1" }, t.tagline)),
                React.createElement(badge_1.Badge, { variant: "secondary", className: "shrink-0" },
                    React.createElement(lucide_react_1.Star, { className: "mr-1 h-3 w-3" }),
                    t.popularity)),
            React.createElement("div", { className: "mt-2 flex flex-wrap gap-1" }, t.badges.map(function (b) { return (React.createElement(badge_1.Badge, { key: b, variant: "outline", className: "text-[11px]" }, b)); }))),
        React.createElement(card_1.CardContent, { className: "flex-1 space-y-3" },
            React.createElement("div", { className: "rounded-lg border bg-background p-2" },
                React.createElement(TemplatePreview, { variant: t.id })),
            React.createElement("div", { className: "space-y-1 text-sm" },
                React.createElement("div", { className: "text-xs text-muted-foreground" }, "Best for"),
                React.createElement("div", { className: "flex flex-wrap gap-1" }, t.bestFor.map(function (b) { return (React.createElement(badge_1.Badge, { key: b, variant: "secondary" }, b)); }))),
            React.createElement("div", { className: "space-y-1 text-sm" },
                React.createElement("div", { className: "text-xs text-muted-foreground" }, "Highlights"),
                React.createElement("ul", { className: "list-disc pl-5 text-sm text-muted-foreground" }, t.highlights.map(function (h) { return React.createElement("li", { key: h }, h); })))),
        React.createElement(card_1.CardFooter, { className: "flex items-center justify-between" },
            React.createElement(dialog_1.Dialog, null,
                React.createElement(dialog_1.DialogTrigger, { asChild: true },
                    React.createElement(button_1.Button, { variant: "outline", size: "sm" },
                        React.createElement(lucide_react_1.Eye, { className: "mr-2 h-4 w-4" }),
                        "Preview")),
                React.createElement(dialog_1.DialogContent, { className: "max-w-3xl" },
                    React.createElement(dialog_1.DialogHeader, null,
                        React.createElement(dialog_1.DialogTitle, null,
                            t.name,
                            " Template Preview"),
                        React.createElement(dialog_1.DialogDescription, null, t.tagline)),
                    React.createElement(scroll_area_1.ScrollArea, { className: "max-h-[70vh] rounded-md border p-3" },
                        React.createElement(TemplatePreview, { variant: t.id })))),
            React.createElement(button_1.Button, { size: "sm", onClick: function () { return onUse(t.id); } },
                React.createElement(lucide_react_1.Wand2, { className: "mr-2 h-4 w-4" }),
                "Use template"))));
}
/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
function TemplateGalleryPage() {
    var router = navigation_1.useRouter();
    var _a = React.useState(""), q = _a[0], setQ = _a[1];
    var _b = React.useState("all"), category = _b[0], setCategory = _b[1];
    var _c = React.useState("popular"), sort = _c[0], setSort = _c[1];
    var filtered = React.useMemo(function () {
        var list = TEMPLATES.filter(function (t) {
            var matchesQ = !q.trim() ||
                t.name.toLowerCase().includes(q.toLowerCase()) ||
                t.tagline.toLowerCase().includes(q.toLowerCase()) ||
                t.badges.some(function (b) { return b.toLowerCase().includes(q.toLowerCase()); });
            if (!matchesQ)
                return false;
            if (category === "ats") {
                return t.badges.map(function (b) { return b.toLowerCase(); }).includes("ats-friendly");
            }
            if (category === "onepage") {
                return t.badges.map(function (b) { return b.toLowerCase(); }).includes("1-page");
            }
            if (category === "twocol") {
                return t.badges.map(function (b) { return b.toLowerCase(); }).includes("2-column");
            }
            return true;
        });
        if (sort === "popular") {
            list = list.sort(function (a, b) { return b.popularity - a.popularity; });
        }
        else if (sort === "az") {
            list = list.sort(function (a, b) { return a.name.localeCompare(b.name); });
        }
        else if (sort === "za") {
            list = list.sort(function (a, b) { return b.name.localeCompare(a.name); });
        }
        return list;
    }, [q, category, sort]);
    function handleUseTemplate(id) {
        router.push("/resumes/new?template=" + id);
    }
    return (React.createElement("div", { className: "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6" },
        React.createElement("div", { className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between" },
            React.createElement("div", { className: "space-y-1" },
                React.createElement("h1", { className: "text-2xl font-semibold tracking-tight" }, "Resume Templates"),
                React.createElement("p", { className: "text-sm text-muted-foreground" },
                    "Pick a template that fits your profile. All options are ",
                    React.createElement("b", null, "ATS-friendly"),
                    ".")),
            React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement(button_1.Button, { asChild: true, variant: "outline", size: "sm" },
                    React.createElement(link_1["default"], { href: "/dashboard/resumes" },
                        React.createElement(lucide_react_1.CheckCircle2, { className: "mr-2 h-4 w-4" }),
                        "Go to Resumes")),
                React.createElement(button_1.Button, { asChild: true, size: "sm" },
                    React.createElement(link_1["default"], { href: "/resumes/new" },
                        React.createElement(lucide_react_1.Sparkles, { className: "mr-2 h-4 w-4" }),
                        "Start from blank")))),
        React.createElement(separator_1.Separator, { className: "my-4" }),
        React.createElement("div", { className: "flex flex-col gap-3 md:flex-row md:items-end md:justify-between" },
            React.createElement("div", { className: "flex w-full items-center gap-2 md:max-w-md" },
                React.createElement("div", { className: "relative w-full" },
                    React.createElement(lucide_react_1.Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
                    React.createElement(input_1.Input, { placeholder: "Search templates\u2026", className: "pl-9", value: q, onChange: function (e) { return setQ(e.target.value); } }))),
            React.createElement("div", { className: "flex w-full flex-wrap gap-2 md:w-auto md:justify-end" },
                React.createElement("div", { className: "grid gap-1" },
                    React.createElement(label_1.Label, { className: "text-xs" }, "Category"),
                    React.createElement(select_1.Select, { value: category, onValueChange: function (v) { return setCategory(v); } },
                        React.createElement(select_1.SelectTrigger, { className: "w-[180px]" },
                            React.createElement(select_1.SelectValue, { placeholder: "All" })),
                        React.createElement(select_1.SelectContent, null,
                            React.createElement(select_1.SelectItem, { value: "all" }, "All"),
                            React.createElement(select_1.SelectItem, { value: "ats" }, "ATS-friendly"),
                            React.createElement(select_1.SelectItem, { value: "onepage" }, "1-page"),
                            React.createElement(select_1.SelectItem, { value: "twocol" }, "2-column")))),
                React.createElement("div", { className: "grid gap-1" },
                    React.createElement(label_1.Label, { className: "text-xs" }, "Sort"),
                    React.createElement(select_1.Select, { value: sort, onValueChange: function (v) { return setSort(v); } },
                        React.createElement(select_1.SelectTrigger, { className: "w-[180px]" },
                            React.createElement(select_1.SelectValue, { placeholder: "Popular" })),
                        React.createElement(select_1.SelectContent, null,
                            React.createElement(select_1.SelectItem, { value: "popular" }, "Popularity"),
                            React.createElement(select_1.SelectItem, { value: "az" }, "A \u2192 Z"),
                            React.createElement(select_1.SelectItem, { value: "za" }, "Z \u2192 A")))))),
        React.createElement("div", { className: "mt-6 flex flex-wrap gap-4" },
            filtered.map(function (t) { return (React.createElement("div", { key: t.id, className: "basis-full sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(33.333%-0.666rem)] shrink-0" },
                React.createElement(TemplateCard, { t: t, onUse: handleUseTemplate }))); }),
            filtered.length === 0 && (React.createElement(card_1.Card, { className: "w-full border-dashed" },
                React.createElement(card_1.CardContent, { className: "p-6 text-center text-sm text-muted-foreground" }, "No templates match your filters."))))));
}
exports["default"] = TemplateGalleryPage;
