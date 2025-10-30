"use client";
"use strict";
exports.__esModule = true;
var image_1 = require("next/image");
var link_1 = require("next/link");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var input_1 = require("@/components/ui/input");
var card_1 = require("@/components/ui/card");
function Hero() {
    return (React.createElement("section", { className: "relative isolate overflow-hidden border-b border-border bg-background" },
        React.createElement("div", { className: "pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-background via-background/40 to-background" }),
        React.createElement("div", { className: "mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-20 lg:px-8" },
            React.createElement("div", { className: "flex flex-col gap-6" },
                React.createElement(badge_1.Badge, { variant: "secondary", className: "w-fit gap-2 border border-border/60 bg-background/70 backdrop-blur" },
                    React.createElement(lucide_react_1.Sparkles, { className: "h-4 w-4" }),
                    "New: AI suggestions & ATS scoring"),
                React.createElement("h1", { className: "text-pretty text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl" },
                    "Build an",
                    " ",
                    React.createElement("span", { className: "bg-linear-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent" }, "ATS-ready resume"),
                    " ",
                    "in minutes."),
                React.createElement("p", { className: "max-w-xl text-base text-muted-foreground sm:text-lg" }, "Resumint helps you craft, score, and tailor resumes with one click. Optimize for job descriptions and share a beautiful public link."),
                React.createElement("div", { className: "flex w-full flex-col gap-3 sm:flex-row" },
                    React.createElement(input_1.Input, { placeholder: "Paste a job description URL\u2026", className: "h-11 sm:max-w-md", "aria-label": "Job description URL" }),
                    React.createElement("div", { className: "flex gap-3" },
                        React.createElement(button_1.Button, { className: "h-11 px-5", asChild: true },
                            React.createElement(link_1["default"], { href: "/signup" }, "Create your resume")),
                        React.createElement(button_1.Button, { variant: "outline", className: "h-11 px-5", asChild: true },
                            React.createElement(link_1["default"], { href: "/learn\n                \\" }, "Lear More")))),
                React.createElement("ul", { className: "mt-2 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2" }, [
                    "AI section rewrites",
                    "Real-time ATS score",
                    "Job match insights",
                    "One-click public link",
                ].map(function (item) { return (React.createElement("li", { key: item, className: "flex items-center gap-2" },
                    React.createElement(lucide_react_1.Check, { className: "h-4 w-4 text-emerald-500" }),
                    React.createElement("span", null, item))); }))),
            React.createElement("div", { className: "relative" },
                React.createElement("div", { className: "pointer-events-none absolute -inset-x-10 -top-10 -z-10 h-64 rounded-full blur-3xl", style: {
                        background: "radial-gradient(120px 120px at 30% 40%, rgba(16,185,129,.2), transparent 60%), radial-gradient(160px 160px at 70% 30%, rgba(52,211,153,.18), transparent 60%)"
                    } }),
                React.createElement(card_1.Card, { className: "overflow-hidden border border-border/60 shadow-sm" },
                    React.createElement(card_1.CardContent, { className: "p-0" },
                        React.createElement("div", { className: "relative aspect-16/10 w-full bg-muted" },
                            React.createElement(image_1["default"], { src: "/Images/hero-preview.jpg", alt: "Resumint preview", fill: true, priority: true, sizes: "(min-width: 1024px) 640px, 100vw", className: "object-cover" })),
                        React.createElement("div", { className: "absolute right-4 top-4 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-sm text-foreground shadow-sm backdrop-blur" },
                            "ATS Score: ",
                            React.createElement("span", { className: "font-semibold text-emerald-600" }, "92")))),
                React.createElement("div", { className: "mt-4 grid grid-cols-3 gap-3 text-center text-sm" },
                    React.createElement("div", { className: "rounded-md border border-border/60 bg-background/60 p-3" },
                        React.createElement("p", { className: "font-semibold text-foreground" }, "25k+"),
                        React.createElement("p", { className: "text-muted-foreground" }, "Resumes")),
                    React.createElement("div", { className: "rounded-md border border-border/60 bg-background/60 p-3" },
                        React.createElement("p", { className: "font-semibold text-foreground" }, "4.9/5"),
                        React.createElement("p", { className: "text-muted-foreground" }, "User rating")),
                    React.createElement("div", { className: "rounded-md border border-border/60 bg-background/60 p-3" },
                        React.createElement("p", { className: "font-semibold text-foreground" }, "200+"),
                        React.createElement("p", { className: "text-muted-foreground" }, "Templates")))))));
}
exports["default"] = Hero;
