"use strict";
exports.__esModule = true;
// app/(pages)/changelog/page.tsx
var link_1 = require("next/link");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var button_1 = require("@/components/ui/button");
var separator_1 = require("@/components/ui/separator");
var lucide_react_1 = require("lucide-react");
var releases = [
    {
        version: "v1.3.0",
        date: "Nov 03, 2025",
        label: "Latest",
        highlight: "Analytics & ATS improvements",
        items: [
            {
                type: "New",
                icon: lucide_react_1.BarChart3,
                title: "Analytics dashboard",
                body: "Track views, downloads, and ATS score trends for your resumes with new charts and KPIs."
            },
            {
                type: "New",
                icon: lucide_react_1.Gauge,
                title: "Template performance",
                body: "See which resume templates get the most engagement across your shared links."
            },
            {
                type: "Improved",
                icon: lucide_react_1.Wrench,
                title: "ATS analysis accuracy",
                body: "Better keyword detection and clearer grouping of matched vs missing skills."
            },
        ]
    },
    {
        version: "v1.2.0",
        date: "Oct 20, 2025",
        label: "Update",
        highlight: "Settings, security & notifications",
        items: [
            {
                type: "New",
                icon: lucide_react_1.ShieldCheck,
                title: "Security settings",
                body: "Change your password, manage sessions, and delete your account from the dashboard."
            },
            {
                type: "New",
                icon: lucide_react_1.CalendarDays,
                title: "Notification controls",
                body: "Choose which product updates and digests you want to receive."
            },
            {
                type: "Improved",
                icon: lucide_react_1.Wrench,
                title: "Profile & preferences",
                body: "More consistent layout for profile, theme, and language settings."
            },
        ]
    },
    {
        version: "v1.1.0",
        date: "Sep 12, 2025",
        label: "Update",
        highlight: "Resume editor enhancements",
        items: [
            {
                type: "New",
                icon: lucide_react_1.FileText,
                title: "Resume variants",
                body: "Duplicate resumes to create tailored versions for different roles or companies."
            },
            {
                type: "Improved",
                icon: lucide_react_1.Wrench,
                title: "Template rendering",
                body: "Cleaner typography and spacing for exported PDFs across all templates."
            },
            {
                type: "Fixed",
                icon: lucide_react_1.Bug,
                title: "Bullet formatting issues",
                body: "Resolved a bug where bullet lists would occasionally render misaligned in exports."
            },
        ]
    },
    {
        version: "v1.0.0",
        date: "Aug 01, 2025",
        label: "Launch",
        highlight: "Public launch of Resumint",
        items: [
            {
                type: "New",
                icon: lucide_react_1.Rocket,
                title: "Core resume builder",
                body: "Create structured, ATS-aware resumes with clean, modern templates."
            },
            {
                type: "New",
                icon: lucide_react_1.Gauge,
                title: "ATS scoring",
                body: "Paste a job description and see how your resume stacks up instantly."
            },
            {
                type: "New",
                icon: lucide_react_1.ShieldCheck,
                title: "Privacy-first sharing",
                body: "Share public links when needed and revoke them in a click."
            },
        ]
    },
];
function typeBadgeVariant(type) {
    if (type === "New")
        return "default";
    if (type === "Improved")
        return "secondary";
    if (type === "Fixed")
        return "outline";
    return "secondary";
}
function ChangelogPage() {
    return (React.createElement("main", { className: "mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8" },
        React.createElement("section", { className: "flex flex-col gap-8 lg:flex-row lg:items-center" },
            React.createElement("div", { className: "flex-1 space-y-4" },
                React.createElement(badge_1.Badge, { variant: "secondary", className: "gap-2 rounded-full px-3 py-1 text-xs" },
                    React.createElement(lucide_react_1.Sparkles, { className: "h-3 w-3" }),
                    "Product updates & improvements"),
                React.createElement("h1", { className: "text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl" },
                    "Changelog \u2013 see what's",
                    " ",
                    React.createElement("span", { className: "bg-linear-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent" }, "new in Resumint")),
                React.createElement("p", { className: "max-w-xl text-sm text-muted-foreground sm:text-base" }, "We ship improvements regularly to make your resume building and job search smoother. Here\u2019s a running log of what's changed."),
                React.createElement("div", { className: "flex flex-wrap items-center gap-3" },
                    React.createElement(button_1.Button, { asChild: true, size: "lg" },
                        React.createElement(link_1["default"], { href: "/signup" }, "Start for free")),
                    React.createElement(button_1.Button, { asChild: true, size: "lg", variant: "outline" },
                        React.createElement(link_1["default"], { href: "/features" }, "View features"))),
                React.createElement("div", { className: "flex flex-wrap gap-3 text-xs text-muted-foreground" },
                    React.createElement("div", { className: "flex items-center gap-1.5" },
                        React.createElement(lucide_react_1.ShieldCheck, { className: "h-3.5 w-3.5 text-emerald-500" }),
                        "Backwards compatible \u2013 your existing resumes keep working."),
                    React.createElement("div", { className: "flex items-center gap-1.5" },
                        React.createElement(lucide_react_1.BarChart3, { className: "h-3.5 w-3.5 text-sky-500" }),
                        "Focused on real job search outcomes."))),
            React.createElement("div", { className: "mt-4 flex flex-1 items-center justify-center lg:mt-0" },
                React.createElement(card_1.Card, { className: "w-full max-w-md border-dashed" },
                    React.createElement(card_1.CardHeader, null,
                        React.createElement(card_1.CardTitle, { className: "flex items-center gap-2 text-base" },
                            React.createElement(lucide_react_1.Rocket, { className: "h-4 w-4 text-emerald-500" }),
                            "Latest release: ",
                            releases[0].version),
                        React.createElement(card_1.CardDescription, null, releases[0].highlight)),
                    React.createElement(card_1.CardContent, { className: "space-y-3 text-sm text-muted-foreground" },
                        React.createElement("p", null, "This release focuses on analytics and ATS insights so you can better understand how your resumes perform once they're out in the world."),
                        React.createElement("ul", { className: "space-y-1" },
                            React.createElement("li", { className: "flex items-center gap-2" },
                                React.createElement(lucide_react_1.Gauge, { className: "h-4 w-4 text-emerald-500" }),
                                "ATS trend visualizations"),
                            React.createElement("li", { className: "flex items-center gap-2" },
                                React.createElement(lucide_react_1.FileText, { className: "h-4 w-4 text-sky-500" }),
                                "Template usage breakdowns"),
                            React.createElement("li", { className: "flex items-center gap-2" },
                                React.createElement(lucide_react_1.BarChart3, { className: "h-4 w-4 text-indigo-500" }),
                                "Views vs downloads tracking")),
                        React.createElement(button_1.Button, { asChild: true, variant: "outline", size: "sm", className: "mt-2" },
                            React.createElement(link_1["default"], { href: "/dashboard/analytics" },
                                "Open analytics ",
                                React.createElement(lucide_react_1.ArrowRight, { className: "ml-1.5 h-3.5 w-3.5" }))))))),
        React.createElement(separator_1.Separator, null),
        React.createElement("section", { className: "space-y-6" },
            React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-3" },
                React.createElement("div", null,
                    React.createElement("h2", { className: "text-xl font-semibold tracking-tight sm:text-2xl" }, "Release history"),
                    React.createElement("p", { className: "text-sm text-muted-foreground" }, "A quick overview of notable updates, fixes, and improvements.")),
                React.createElement(badge_1.Badge, { variant: "outline", className: "rounded-full px-3 py-1 text-xs" }, "We'll keep this page up to date")),
            React.createElement("div", { className: "relative space-y-6" },
                React.createElement("div", { className: "pointer-events-none absolute left-4 top-0 hidden h-full w-px bg-border sm:left-1/2 sm:block" }),
                React.createElement("div", { className: "space-y-6" }, releases.map(function (release, idx) { return (React.createElement("div", { key: release.version, className: "relative flex flex-col gap-4 sm:flex-row sm:items-stretch" },
                    React.createElement("div", { className: "absolute left-4 top-2 h-3 w-3 rounded-full border-2 border-background bg-emerald-500 sm:left-1/2 sm:-translate-x-1/2" }),
                    React.createElement("div", { className: "hidden w-1/2 pr-6 sm:block sm:text-right" },
                        React.createElement("p", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground" }, release.date),
                        React.createElement("p", { className: "text-sm font-semibold" }, release.version),
                        release.label && (React.createElement(badge_1.Badge, { variant: "secondary", className: "mt-2 inline-flex items-center gap-1 text-[11px]" },
                            release.label === "Latest" ? React.createElement(lucide_react_1.Sparkles, { className: "h-3 w-3" }) : null,
                            release.label))),
                    React.createElement("div", { className: "sm:w-1/2 sm:pl-6" },
                        React.createElement(card_1.Card, { className: "h-full" },
                            React.createElement(card_1.CardHeader, { className: "pb-3" },
                                React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-2 sm:hidden" },
                                    React.createElement("div", null,
                                        React.createElement("p", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground" }, release.date),
                                        React.createElement("p", { className: "text-sm font-semibold" }, release.version)),
                                    release.label && (React.createElement(badge_1.Badge, { variant: "secondary", className: "inline-flex items-center gap-1 text-[11px]" },
                                        release.label === "Latest" ? React.createElement(lucide_react_1.Sparkles, { className: "h-3 w-3" }) : null,
                                        release.label))),
                                React.createElement(card_1.CardTitle, { className: "text-base" }, release.highlight),
                                React.createElement(card_1.CardDescription, null, "What's new in this release:")),
                            React.createElement(card_1.CardContent, { className: "space-y-3 text-sm text-muted-foreground" },
                                React.createElement("div", { className: "space-y-3" }, release.items.map(function (item, i) {
                                    var Icon = item.icon;
                                    return (React.createElement("div", { key: i, className: "flex items-start gap-3" },
                                        React.createElement("span", { className: "mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-muted" },
                                            React.createElement(Icon, { className: "h-3.5 w-3.5 text-emerald-600" })),
                                        React.createElement("div", { className: "space-y-1" },
                                            React.createElement("div", { className: "flex flex-wrap items-center gap-2" },
                                                React.createElement("span", { className: "font-medium text-foreground" }, item.title),
                                                React.createElement(badge_1.Badge, { variant: typeBadgeVariant(item.type), className: "px-2 py-0 text-[11px]" }, item.type)),
                                            React.createElement("p", null, item.body))));
                                }))))))); })))),
        React.createElement("section", { className: "mt-2 rounded-2xl border bg-muted/40 px-5 py-6 sm:px-8 sm:py-8" },
            React.createElement("div", { className: "flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between" },
                React.createElement("div", { className: "space-y-2" },
                    React.createElement("h2", { className: "text-lg font-semibold sm:text-xl" }, "Stay tuned for what's next"),
                    React.createElement("p", { className: "max-w-xl text-sm text-muted-foreground" }, "We're actively improving Resumint. Check back here for updates, or sign in to see the latest changes reflected in your dashboard.")),
                React.createElement("div", { className: "flex flex-wrap gap-3" },
                    React.createElement(button_1.Button, { asChild: true, size: "lg" },
                        React.createElement(link_1["default"], { href: "/dashboard" }, "Go to dashboard")),
                    React.createElement(button_1.Button, { asChild: true, variant: "outline", size: "lg" },
                        React.createElement(link_1["default"], { href: "/features" }, "See what's included")))))));
}
exports["default"] = ChangelogPage;
