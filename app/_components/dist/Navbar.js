"use client";
"use strict";
exports.__esModule = true;
var image_1 = require("next/image");
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var sheet_1 = require("@/components/ui/sheet");
var separator_1 = require("@/components/ui/separator");
var ModeToggle_1 = require("@/components/ModeToggle");
var menuItems = [
    { title: "Home", path: "/" },
    { title: "Dashboard", path: "/dashboard" },
    { title: "About", path: "/about" },
    { title: "Contact", path: "/contact" },
];
function Navbar() {
    var pathname = navigation_1.usePathname();
    var _a = react_1.useState(false), open = _a[0], setOpen = _a[1];
    var isActive = function (p) { return pathname === p; };
    // Close Sheet on route change
    react_1.useEffect(function () {
        setOpen(false);
    }, [pathname]);
    // Close Sheet when viewport crosses md (>=768px)
    react_1.useEffect(function () {
        if (typeof window === "undefined")
            return;
        var mql = window.matchMedia("(min-width: 768px)");
        var handler = function (e) {
            if (e.matches)
                setOpen(false);
        };
        if (mql.addEventListener)
            mql.addEventListener("change", handler);
        else
            mql.addListener(handler);
        return function () {
            if (mql.removeEventListener)
                mql.removeEventListener("change", handler);
            else
                mql.removeListener(handler);
        };
    }, []);
    return (React.createElement("div", { className: "sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60" },
        React.createElement("header", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 text-foreground" },
            React.createElement(link_1["default"], { href: "/", className: "flex items-center gap-2", "aria-label": "Resumint Home" },
                React.createElement(image_1["default"], { className: "block dark:hidden", src: "/Images/Logo/logo.svg" // <- replace with your light logo (or /Images/Logo/logo.svg)
                    , alt: "Resumint", width: 180, height: 180, priority: true }),
                React.createElement(image_1["default"], { className: "hidden dark:block", src: "/Images/Logo/logo-dark.svg" // <- replace with your dark logo (inverted/white)
                    , alt: "Resumint", width: 180, height: 180, priority: true })),
            React.createElement("nav", { className: "hidden md:flex items-center gap-1" }, menuItems.map(function (item) { return (React.createElement(button_1.Button, { key: item.path, asChild: true, variant: "ghost", size: "sm", className: "px-3 " + (isActive(item.path) ? "bg-muted font-medium" : "") },
                React.createElement(link_1["default"], { href: item.path, "aria-current": isActive(item.path) ? "page" : undefined }, item.title))); })),
            React.createElement("div", { className: "hidden md:flex items-center gap-2" },
                React.createElement(ModeToggle_1.ModeToggle, null),
                React.createElement(button_1.Button, { asChild: true, variant: isActive("/login") ? "secondary" : "ghost", size: "sm" },
                    React.createElement(link_1["default"], { href: "/login", "aria-current": isActive("/login") ? "page" : undefined }, "Login")),
                React.createElement(button_1.Button, { asChild: true, size: "sm", className: "px-4" },
                    React.createElement(link_1["default"], { href: "/signup", "aria-current": isActive("/signup") ? "page" : undefined }, "Sign Up"))),
            React.createElement("div", { className: "md:hidden" },
                React.createElement(sheet_1.Sheet, { open: open, onOpenChange: setOpen },
                    React.createElement(sheet_1.SheetTrigger, { asChild: true },
                        React.createElement(button_1.Button, { variant: "ghost", size: "icon", "aria-label": "Open menu" },
                            React.createElement(lucide_react_1.Menu, { className: "h-5 w-5" }))),
                    React.createElement(sheet_1.SheetContent, { side: "right", className: "w-80 bg-background/95 text-foreground backdrop-blur supports-backdrop-filter:bg-background/85" },
                        React.createElement(sheet_1.SheetHeader, null,
                            React.createElement(sheet_1.SheetTitle, { className: "flex items-center gap-2" },
                                React.createElement(image_1["default"], { className: "block dark:hidden", src: "/Images/Logo/logo-light.svg", alt: "Resumint", width: 28, height: 28 }),
                                React.createElement(image_1["default"], { className: "hidden dark:block", src: "/Images/Logo/logo-dark.svg", alt: "Resumint", width: 28, height: 28 }),
                                React.createElement("span", null, "Resumint"))),
                        React.createElement(separator_1.Separator, { className: "my-4" }),
                        React.createElement("nav", { className: "grid gap-1" }, menuItems.map(function (item) { return (React.createElement(sheet_1.SheetClose, { asChild: true, key: item.path },
                            React.createElement(button_1.Button, { asChild: true, variant: isActive(item.path) ? "secondary" : "ghost", className: "justify-start" },
                                React.createElement(link_1["default"], { href: item.path, "aria-current": isActive(item.path) ? "page" : undefined }, item.title)))); })),
                        React.createElement(separator_1.Separator, { className: "my-4" }),
                        React.createElement("div", { className: "grid gap-2" },
                            React.createElement(sheet_1.SheetClose, { asChild: true },
                                React.createElement(button_1.Button, { asChild: true, variant: isActive("/login") ? "secondary" : "outline" },
                                    React.createElement(link_1["default"], { href: "/login", "aria-current": isActive("/login") ? "page" : undefined }, "Login"))),
                            React.createElement(sheet_1.SheetClose, { asChild: true },
                                React.createElement(button_1.Button, { asChild: true },
                                    React.createElement(link_1["default"], { href: "/signup", "aria-current": isActive("/signup") ? "page" : undefined }, "Sign Up"))),
                            React.createElement("div", { className: "flex items-center justify-center pt-2" },
                                React.createElement(ModeToggle_1.ModeToggle, null)))))))));
}
exports["default"] = Navbar;
