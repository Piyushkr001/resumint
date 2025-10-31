"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var react_hot_toast_1 = require("react-hot-toast");
function AlreadyToast() {
    var sp = navigation_1.useSearchParams();
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        if (sp.get("already") === "1") {
            react_hot_toast_1["default"].success("Already logged in");
            var url = new URL(window.location.href);
            url.searchParams["delete"]("already");
            router.replace(url.pathname + (url.search ? "?" + url.search : ""));
        }
    }, [sp, router]);
    return null;
}
exports["default"] = AlreadyToast;
