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
var navigation_1 = require("next/navigation");
var react_1 = require("react");
var swr_1 = require("swr");
var lucide_react_1 = require("lucide-react");
var http_1 = require("@/lib/http");
var button_1 = require("@/components/ui/button");
var sheet_1 = require("@/components/ui/sheet");
var separator_1 = require("@/components/ui/separator");
var ModeToggle_1 = require("@/components/ModeToggle");
var menuItems = [
    { title: "Home", path: "/" },
    { title: "Dashboard", path: "/dashboard" },
    { title: "Templates", path: "/templates" },
    { title: "About", path: "/about" },
    { title: "Contact", path: "/contact" },
];
var fetchMe = function () { return __awaiter(void 0, void 0, Promise, function () {
    var r, _a;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                return [4 /*yield*/, http_1.http.get("/api/auth/me")];
            case 1:
                r = _d.sent();
                return [2 /*return*/, (_c = (_b = r.data) === null || _b === void 0 ? void 0 : _b.user) !== null && _c !== void 0 ? _c : null];
            case 2:
                _a = _d.sent();
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
function Navbar() {
    var _this = this;
    var _a, _b;
    var pathname = navigation_1.usePathname();
    var router = navigation_1.useRouter();
    var _c = react_1.useState(false), open = _c[0], setOpen = _c[1];
    var _d = swr_1["default"]("me", fetchMe, {
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        shouldRetryOnError: false
    }), me = _d.data, isLoading = _d.isLoading, mutate = _d.mutate;
    var isActive = function (p) { return pathname === p; };
    // If user is not logged in, clicking "Dashboard" should go to login with redirect
    var getHref = function (path) {
        if (path === "/dashboard" && !me)
            return "/login?next=/dashboard";
        return path;
    };
    react_1.useEffect(function () { setOpen(false); }, [pathname]);
    react_1.useEffect(function () {
        var _a, _b;
        if (typeof window === "undefined")
            return;
        var mql = window.matchMedia("(min-width: 768px)");
        var handler = function (e) { if (e.matches)
            setOpen(false); };
        (_a = mql.addEventListener) === null || _a === void 0 ? void 0 : _a.call(mql, "change", handler);
        (_b = mql.addListener) === null || _b === void 0 ? void 0 : _b.call(mql, handler);
        return function () {
            var _a, _b;
            (_a = mql.removeEventListener) === null || _a === void 0 ? void 0 : _a.call(mql, "change", handler);
            (_b = mql.removeListener) === null || _b === void 0 ? void 0 : _b.call(mql, handler);
        };
    }, []);
    react_1.useEffect(function () {
        var onAuthChanged = function () { return mutate(); };
        window.addEventListener("auth:changed", onAuthChanged);
        return function () { return window.removeEventListener("auth:changed", onAuthChanged); };
    }, [mutate]);
    function onLogout() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, , 2, 4]);
                        return [4 /*yield*/, http_1.http.post("/api/auth/logout")];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, mutate(null, { revalidate: false })];
                    case 3:
                        _a.sent();
                        router.push("/");
                        window.dispatchEvent(new Event("auth:changed"));
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    return (React.createElement("div", { className: "sticky top-0 z-50 rounded-full border-b border-border bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60" },
        React.createElement("header", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 text-foreground" },
            React.createElement(link_1["default"], { href: "/", className: "flex items-center gap-2", "aria-label": "Resumint Home" },
                React.createElement(image_1["default"], { className: "block dark:hidden", src: "/Images/Logo/logo.svg", alt: "Resumint", width: 180, height: 180, priority: true }),
                React.createElement(image_1["default"], { className: "hidden dark:block", src: "/Images/Logo/logo-dark.svg", alt: "Resumint", width: 180, height: 180, priority: true })),
            React.createElement("nav", { className: "hidden md:flex items-center gap-1" }, menuItems.map(function (item) { return (React.createElement(button_1.Button, { key: item.path, asChild: true, variant: "ghost", size: "sm", className: "px-3 " + (isActive(item.path) ? "bg-muted font-medium" : "") },
                React.createElement(link_1["default"], { href: getHref(item.path), "aria-current": isActive(item.path) ? "page" : undefined }, item.title))); })),
            React.createElement("div", { className: "hidden md:flex items-center gap-2" },
                React.createElement(ModeToggle_1.ModeToggle, null),
                isLoading ? (React.createElement(button_1.Button, { variant: "ghost", size: "sm", disabled: true, className: "px-3" }, "\u2026")) : me ? (React.createElement(React.Fragment, null,
                    React.createElement(button_1.Button, { asChild: true, variant: "ghost", size: "sm", className: "px-2" },
                        React.createElement(link_1["default"], { href: "/dashboard", "aria-label": "Account" },
                            me.imageUrl
                                ? React.createElement("img", { src: me.imageUrl, alt: (_a = me.name) !== null && _a !== void 0 ? _a : me.email, className: "h-5 w-5 rounded-full" })
                                : React.createElement(lucide_react_1.User, { className: "h-4 w-4" }),
                            React.createElement("span", { className: "ml-2 hidden sm:inline max-w-40 truncate" }, (_b = me.name) !== null && _b !== void 0 ? _b : me.email))),
                    React.createElement(button_1.Button, { size: "sm", variant: "outline", onClick: onLogout },
                        React.createElement(lucide_react_1.LogOut, { className: "mr-2 h-4 w-4" }),
                        " Logout"))) : (React.createElement(React.Fragment, null,
                    React.createElement(button_1.Button, { asChild: true, variant: isActive("/login") ? "secondary" : "ghost", size: "sm" },
                        React.createElement(link_1["default"], { href: "/login", "aria-current": isActive("/login") ? "page" : undefined }, "Login")),
                    React.createElement(button_1.Button, { asChild: true, size: "sm", className: "px-4" },
                        React.createElement(link_1["default"], { href: "/signup", "aria-current": isActive("/signup") ? "page" : undefined }, "Sign Up"))))),
            React.createElement("div", { className: "md:hidden" },
                React.createElement(sheet_1.Sheet, { open: open, onOpenChange: setOpen },
                    React.createElement(sheet_1.SheetTrigger, { asChild: true },
                        React.createElement(button_1.Button, { variant: "ghost", size: "icon", "aria-label": "Open menu" },
                            React.createElement(lucide_react_1.Menu, { className: "h-5 w-5" }))),
                    React.createElement(sheet_1.SheetContent, { side: "right", className: "w-80 bg-background/95 text-foreground backdrop-blur supports-backdrop-filter:bg-background/85" },
                        React.createElement(sheet_1.SheetHeader, null,
                            React.createElement(sheet_1.SheetTitle, { className: "flex items-center gap-2" },
                                React.createElement(image_1["default"], { className: "block dark:hidden", src: "/Images/Logo/logo.svg", alt: "Resumint", width: 28, height: 28 }),
                                React.createElement(image_1["default"], { className: "hidden dark:block", src: "/Images/Logo/logo-dark.svg", alt: "Resumint", width: 28, height: 28 }),
                                React.createElement("span", null, "Resumint"))),
                        React.createElement(separator_1.Separator, { className: "my-4" }),
                        React.createElement("nav", { className: "grid gap-1" }, menuItems.map(function (item) { return (React.createElement(sheet_1.SheetClose, { asChild: true, key: item.path },
                            React.createElement(button_1.Button, { asChild: true, variant: isActive(item.path) ? "secondary" : "ghost", className: "justify-start" },
                                React.createElement(link_1["default"], { href: getHref(item.path), "aria-current": isActive(item.path) ? "page" : undefined }, item.title)))); })),
                        React.createElement(separator_1.Separator, { className: "my-4" }),
                        React.createElement("div", { className: "grid gap-2" },
                            isLoading ? (React.createElement(button_1.Button, { variant: "ghost", disabled: true }, "\u2026")) : me ? (React.createElement(button_1.Button, { variant: "outline", onClick: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, onLogout()];
                                        case 1:
                                            _a.sent();
                                            setOpen(false);
                                            return [2 /*return*/];
                                    }
                                }); }); } },
                                React.createElement(lucide_react_1.LogOut, { className: "mr-2 h-4 w-4" }),
                                " Logout")) : (React.createElement(React.Fragment, null,
                                React.createElement(sheet_1.SheetClose, { asChild: true },
                                    React.createElement(button_1.Button, { asChild: true, variant: isActive("/login") ? "secondary" : "outline" },
                                        React.createElement(link_1["default"], { href: "/login", "aria-current": isActive("/login") ? "page" : undefined }, "Login"))),
                                React.createElement(sheet_1.SheetClose, { asChild: true },
                                    React.createElement(button_1.Button, { asChild: true },
                                        React.createElement(link_1["default"], { href: "/signup", "aria-current": isActive("/signup") ? "page" : undefined }, "Sign Up"))))),
                            React.createElement("div", { className: "flex items-center justify-center pt-2" },
                                React.createElement(ModeToggle_1.ModeToggle, null)))))))));
}
exports["default"] = Navbar;
