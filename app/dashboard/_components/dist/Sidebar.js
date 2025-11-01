"use client";
"use strict";
exports.__esModule = true;
exports.DashboardMobileSidebar = exports.DashboardSidebar = void 0;
var React = require("react");
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var separator_1 = require("@/components/ui/separator");
var sheet_1 = require("@/components/ui/sheet");
var scroll_area_1 = require("@/components/ui/scroll-area");
var tooltip_1 = require("@/components/ui/tooltip");
var avatar_1 = require("@/components/ui/avatar");
var utils_1 = require("@/lib/utils");
var ModeToggle_1 = require("@/components/ModeToggle");
var react_visually_hidden_1 = require("@radix-ui/react-visually-hidden");
var NAV = [
    { label: "Overview", href: "/dashboard", icon: lucide_react_1.LayoutGrid },
    { label: "Resumes", href: "/dashboard/resumes", icon: lucide_react_1.FileText },
    { label: "ATS Insights", href: "/dashboard/ats", icon: lucide_react_1.Sparkles },
    { label: "Analytics", href: "/dashboard/analytics", icon: lucide_react_1.BarChart3 },
    { label: "Settings", href: "/dashboard/settings", icon: lucide_react_1.Settings },
];
var STORAGE_KEY = "dashboard:sidebar:collapsed";
function useCollapsed(defaultValue) {
    if (defaultValue === void 0) { defaultValue = false; }
    var _a = React.useState(defaultValue), collapsed = _a[0], setCollapsed = _a[1];
    React.useEffect(function () {
        var v = localStorage.getItem(STORAGE_KEY);
        if (v === "1")
            setCollapsed(true);
        if (v === "0")
            setCollapsed(false);
    }, []);
    var toggle = React.useCallback(function () {
        setCollapsed(function (c) {
            var next = !c;
            localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
            return next;
        });
    }, []);
    return { collapsed: collapsed, toggle: toggle, setCollapsed: setCollapsed };
}
function SidebarContent(_a) {
    var _b, _c, _d;
    var collapsed = _a.collapsed, user = _a.user, onLogout = _a.onLogout;
    var pathname = navigation_1.usePathname();
    // ✅ Fix: Overview is exact; others match exact OR nested
    var isActiveLink = React.useCallback(function (href) {
        if (!pathname)
            return false;
        if (href === "/dashboard")
            return pathname === "/dashboard"; // exact only
        return pathname === href || pathname.startsWith(href + "/");
    }, [pathname]);
    return (React.createElement(tooltip_1.TooltipProvider, { delayDuration: 0 },
        React.createElement("div", { className: "flex h-full w-full flex-col" },
            React.createElement("div", { className: utils_1.cn("flex items-center gap-2 px-3 py-3", collapsed ? "justify-center" : "justify-start") }),
            React.createElement(separator_1.Separator, null),
            React.createElement(scroll_area_1.ScrollArea, { className: "flex-1" },
                React.createElement("nav", { className: "px-2 py-2", "aria-label": "Dashboard" }, NAV.map(function (item) {
                    var Icon = item.icon;
                    var active = isActiveLink(item.href);
                    var inner = (React.createElement(button_1.Button, { asChild: true, variant: active ? "secondary" : "ghost", className: utils_1.cn("w-full justify-start gap-3", collapsed ? "px-0 w-10 h-10 mx-auto" : "px-3") },
                        React.createElement(link_1["default"], { href: item.href, "aria-current": active ? "page" : undefined },
                            React.createElement(Icon, { className: utils_1.cn("h-4 w-4", collapsed && "mx-auto") }),
                            !collapsed && (React.createElement("span", { className: "truncate" }, item.label)))));
                    return (React.createElement("div", { key: item.href, className: "my-0.5" }, collapsed ? (React.createElement(tooltip_1.Tooltip, null,
                        React.createElement(tooltip_1.TooltipTrigger, { asChild: true }, inner),
                        React.createElement(tooltip_1.TooltipContent, { side: "right" }, item.label))) : (inner)));
                }))),
            React.createElement(separator_1.Separator, null),
            React.createElement("div", { className: "p-2" },
                React.createElement("div", { className: utils_1.cn("flex items-center gap-2 rounded-lg px-2 py-2", collapsed ? "justify-center" : "justify-between") }, user ? (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: utils_1.cn("flex items-center gap-2", collapsed && "justify-center") },
                        React.createElement(avatar_1.Avatar, { className: "h-7 w-7" },
                            React.createElement(avatar_1.AvatarImage, { src: (_b = user.imageUrl) !== null && _b !== void 0 ? _b : undefined, alt: (_d = (_c = user.name) !== null && _c !== void 0 ? _c : user.email) !== null && _d !== void 0 ? _d : "User" }),
                            React.createElement(avatar_1.AvatarFallback, null,
                                React.createElement(lucide_react_1.User, { className: "h-4 w-4" }))),
                        !collapsed && (React.createElement("div", { className: "min-w-0" },
                            React.createElement("p", { className: "text-sm leading-tight font-medium truncate" }, user.name || user.email),
                            user.email && (React.createElement("p", { className: "text-xs text-muted-foreground leading-tight truncate" }, user.email))))),
                    !collapsed && React.createElement(ModeToggle_1.ModeToggle, null))) : (!collapsed && React.createElement(ModeToggle_1.ModeToggle, null))),
                user && (React.createElement(button_1.Button, { onClick: onLogout, variant: "outline", className: utils_1.cn("mt-2 w-full", collapsed && "justify-center px-0 w-10 h-9 mx-auto") },
                    React.createElement(lucide_react_1.LogOut, { className: "h-4 w-4" }),
                    !collapsed && React.createElement("span", { className: "ml-2" }, "Logout")))))));
}
function DashboardSidebar(_a) {
    var _b = _a.collapsedDefault, collapsedDefault = _b === void 0 ? false : _b, user = _a.user, onLogout = _a.onLogout;
    var _c = useCollapsed(collapsedDefault), collapsed = _c.collapsed, toggle = _c.toggle;
    return (React.createElement("aside", { className: utils_1.cn("hidden md:block border-r bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50", collapsed ? "w-16" : "w-64") },
        React.createElement("div", { className: "relative h-screen" },
            React.createElement(button_1.Button, { type: "button", size: "icon", variant: "ghost", onClick: toggle, className: "absolute -right-3 top-3 z-10 h-6 w-6 rounded-full border bg-background shadow", "aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar" }, collapsed ? (React.createElement(lucide_react_1.ChevronRight, { className: "h-3.5 w-3.5" })) : (React.createElement(lucide_react_1.ChevronLeft, { className: "h-3.5 w-3.5" }))),
            React.createElement(SidebarContent, { collapsed: collapsed, user: user, onLogout: onLogout }))));
}
exports.DashboardSidebar = DashboardSidebar;
function DashboardMobileSidebar(_a) {
    var user = _a.user, onLogout = _a.onLogout;
    return (React.createElement(sheet_1.Sheet, null,
        React.createElement(sheet_1.SheetTrigger, { asChild: true },
            React.createElement(button_1.Button, { variant: "ghost", size: "icon", "aria-label": "Open menu", className: "md:hidden" },
                React.createElement(lucide_react_1.PanelLeftOpen, { className: "h-5 w-5" }))),
        React.createElement(sheet_1.SheetContent, { side: "left", className: "p-0 w-80" },
            React.createElement(sheet_1.SheetHeader, null,
                React.createElement(react_visually_hidden_1.VisuallyHidden, null,
                    React.createElement(sheet_1.SheetTitle, null, "Dashboard navigation"))),
            React.createElement(SidebarContent, { collapsed: false, user: user, onLogout: onLogout }))));
}
exports.DashboardMobileSidebar = DashboardMobileSidebar;
