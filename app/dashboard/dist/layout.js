"use strict";
exports.__esModule = true;
exports.metadata = void 0;
var Sidebar_1 = require("./_components/Sidebar");
// If you keep auth in Navbar only, pass user/onLogout down here if you want them in sidebar too.
exports.metadata = {
    title: "Dashboard"
};
function DashboardLayout(_a) {
    var children = _a.children;
    return (React.createElement("div", { className: "min-h-screen" },
        React.createElement("header", { className: "sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background/70 px-3 backdrop-blur md:hidden" },
            React.createElement(Sidebar_1.DashboardMobileSidebar, null),
            React.createElement("div", { className: "font-semibold" }, "Dashboard")),
        React.createElement("div", { className: "flex" },
            React.createElement(Sidebar_1.DashboardSidebar, null),
            React.createElement("main", { className: "flex-1 p-4 md:p-6" }, children))));
}
exports["default"] = DashboardLayout;
