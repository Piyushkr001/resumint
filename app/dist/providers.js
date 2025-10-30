"use client";
"use strict";
exports.__esModule = true;
var google_1 = require("@react-oauth/google");
function Providers(_a) {
    var children = _a.children;
    var clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    return React.createElement(google_1.GoogleOAuthProvider, { clientId: clientId }, children);
}
exports["default"] = Providers;
