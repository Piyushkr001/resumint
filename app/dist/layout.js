"use strict";
exports.__esModule = true;
exports.metadata = void 0;
var google_1 = require("next/font/google");
require("./globals.css");
var Navbar_1 = require("./_components/Navbar");
var Footer_1 = require("./_components/Footer");
var theme_provider_1 = require("@/components/theme-provider");
var react_hot_toast_1 = require("react-hot-toast");
var providers_1 = require("./providers");
var Session_1 = require("./(auth)/_components/Session");
var ubuntu = google_1.Ubuntu_Sans({ subsets: ["latin"], display: "swap" });
exports.metadata = {
    title: "Resumint",
    description: "Build ATS-ready resumes in minutes."
};
function RootLayout(_a) {
    var children = _a.children;
    return (React.createElement("html", { lang: "en", suppressHydrationWarning: true },
        React.createElement("body", { className: ubuntu.className + " min-h-dvh bg-background text-foreground antialiased flex flex-col" },
            React.createElement(providers_1["default"], null,
                React.createElement(Session_1.AuthProvider, null,
                    React.createElement(theme_provider_1.ThemeProvider, { attribute: "class", defaultTheme: "system", enableSystem: true, disableTransitionOnChange: true },
                        React.createElement("div", { className: "sticky top-0 z-40 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60" },
                            React.createElement(Navbar_1["default"], null)),
                        React.createElement("main", { className: "flex-1 min-w-0 pb-[env(safe-area-inset-bottom)]" }, children),
                        React.createElement("div", { className: "mt-auto relative z-10" },
                            React.createElement(Footer_1["default"], null)),
                        React.createElement(react_hot_toast_1.Toaster, { position: "top-right", toastOptions: { style: { zIndex: 60 } }, gutter: 8 })))))));
}
exports["default"] = RootLayout;
