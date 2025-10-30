"use strict";
exports.__esModule = true;
exports.clearAuthCookies = exports.attachAuthCookies = void 0;
var isProd = process.env.NODE_ENV === "production";
function attachAuthCookies(res, sessionJwt, refreshJwt) {
    res.cookies.set("session", sessionJwt, {
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        path: "/",
        maxAge: 60 * 15
    });
    res.cookies.set("refresh", refreshJwt, {
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        path: "/",
        maxAge: 60 * 60 * 24 * 7
    });
    return res;
}
exports.attachAuthCookies = attachAuthCookies;
function clearAuthCookies(res) {
    res.cookies.set("session", "", { httpOnly: true, sameSite: "lax", secure: isProd, path: "/", maxAge: 0 });
    res.cookies.set("refresh", "", { httpOnly: true, sameSite: "lax", secure: isProd, path: "/", maxAge: 0 });
    return res;
}
exports.clearAuthCookies = clearAuthCookies;
