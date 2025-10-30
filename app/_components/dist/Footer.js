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
exports.__esModule = true;
var image_1 = require("next/image");
var link_1 = require("next/link");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var separator_1 = require("@/components/ui/separator");
var input_1 = require("@/components/ui/input");
var button_1 = require("@/components/ui/button");
var react_2 = require("@phosphor-icons/react");
function Footer() {
    var _a = react_1.useState(""), email = _a[0], setEmail = _a[1];
    var year = new Date().getFullYear();
    function onSubscribe(e) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                e.preventDefault();
                // TODO: POST to your newsletter endpoint
                // await fetch("/api/subscribe", { method: "POST", body: JSON.stringify({ email }) })
                console.log("Subscribed:", email);
                setEmail("");
                return [2 /*return*/];
            });
        });
    }
    return (React.createElement("footer", { className: "border-t border-border bg-background text-foreground" },
        React.createElement("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" },
            React.createElement("div", { className: "grid grid-cols-1 gap-10 py-12 md:grid-cols-4" },
                React.createElement("div", { className: "md:col-span-2" },
                    React.createElement("div", { className: "flex items-center gap-3" },
                        React.createElement(image_1["default"], { src: "/Images/Logo/logo.svg", alt: "Resumint", width: 180, height: 180, className: "block dark:hidden" }),
                        React.createElement(image_1["default"], { src: "/Images/Logo/logo-dark.svg", alt: "Resumint", width: 180, height: 180, className: "hidden dark:block" })),
                    React.createElement("p", { className: "mt-3 max-w-md text-sm text-muted-foreground" }, "Build, score, and tailor ATS-ready resumes. Share a beautiful link and get hired faster."),
                    React.createElement("form", { onSubmit: onSubscribe, className: "mt-5 flex flex-col gap-3 sm:flex-row" },
                        React.createElement(input_1.Input, { type: "email", required: true, value: email, onChange: function (e) { return setEmail(e.target.value); }, placeholder: "Join our newsletter", className: "h-11 sm:max-w-xs", "aria-label": "Email address" }),
                        React.createElement(button_1.Button, { type: "submit", className: "h-11 px-5" }, "Subscribe")),
                    React.createElement("div", { className: "mt-4 flex items-center gap-3 text-muted-foreground" },
                        React.createElement(link_1["default"], { href: "#", "aria-label": "Email" },
                            React.createElement(lucide_react_1.Mail, { className: "h-5 w-5 hover:text-foreground" })),
                        React.createElement(link_1["default"], { href: "https://github.com", target: "_blank", "aria-label": "GitHub" },
                            React.createElement(lucide_react_1.Github, { className: "h-5 w-5 hover:text-foreground" })),
                        React.createElement(link_1["default"], { href: "https://twitter.com", target: "_blank", "aria-label": "Twitter" },
                            React.createElement(react_2.XLogoIcon, { className: "h-5 w-5 hover:text-foreground" })),
                        React.createElement(link_1["default"], { href: "https://linkedin.com", target: "_blank", "aria-label": "LinkedIn" },
                            React.createElement(lucide_react_1.Linkedin, { className: "h-5 w-5 hover:text-foreground" })))),
                React.createElement(FooterColumn, { title: "Product", links: [
                        { label: "Features", href: "/#features" },
                        { label: "Templates", href: "/templates" },
                        { label: "Changelog", href: "/changelog" },
                    ] }),
                React.createElement(FooterColumn, { title: "Resources", links: [
                        { label: "Docs", href: "/docs" },
                        { label: "Guides", href: "/guides" },
                        { label: "Support", href: "/support" },
                    ] })),
            React.createElement(separator_1.Separator, { className: "mb-6" }),
            React.createElement("div", { className: "flex flex-col items-start justify-between gap-4 pb-10 text-sm text-muted-foreground md:flex-row md:items-center" },
                React.createElement("p", null,
                    "\u00A9 ",
                    year,
                    " Resumint. All rights reserved."),
                React.createElement("nav", { className: "flex flex-wrap items-center gap-x-6 gap-y-2" },
                    React.createElement(link_1["default"], { href: "/privacy", className: "hover:text-foreground" }, "Privacy"),
                    React.createElement(link_1["default"], { href: "/terms", className: "hover:text-foreground" }, "Terms"),
                    React.createElement(link_1["default"], { href: "/contact", className: "hover:text-foreground" }, "Contact"))))));
}
exports["default"] = Footer;
/* --- small helper component for link columns --- */
function FooterColumn(_a) {
    var title = _a.title, links = _a.links;
    return (React.createElement("div", null,
        React.createElement("h3", { className: "text-sm font-semibold tracking-wide text-foreground" }, title),
        React.createElement("ul", { className: "mt-4 space-y-2" }, links.map(function (l) { return (React.createElement("li", { key: l.href },
            React.createElement(link_1["default"], { href: l.href, className: "text-sm text-muted-foreground hover:text-foreground" }, l.label))); }))));
}
