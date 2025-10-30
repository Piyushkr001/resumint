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
exports.POST = exports.dynamic = exports.runtime = void 0;
// app/api/auth/refresh/route.ts
exports.runtime = "nodejs";
exports.dynamic = "force-dynamic";
var server_1 = require("next/server");
var headers_1 = require("next/headers");
var jwt_1 = require("@/lib/jwt");
var schema_1 = require("@/config/schema");
var drizzle_orm_1 = require("drizzle-orm");
var crypto_1 = require("@/lib/crypto");
var db_1 = require("@/config/db");
var isProd = process.env.NODE_ENV === "production";
function POST() {
    var _a, _b, _c, _d, _e, _f, _g;
    return __awaiter(this, void 0, void 0, function () {
        var jar, refresh, out, userId, jti, tokenRow, user, session, res, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    jar = headers_1.cookies();
                    return [4 /*yield*/, jar];
                case 1:
                    refresh = (_a = (_j.sent()).get("refresh")) === null || _a === void 0 ? void 0 : _a.value;
                    if (!refresh) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "No refresh token" }, { status: 401 })];
                    }
                    _j.label = 2;
                case 2:
                    _j.trys.push([2, 7, , 8]);
                    return [4 /*yield*/, jwt_1.verifyRefreshToken(refresh)];
                case 3:
                    out = _j.sent();
                    userId = String((_c = (_b = out === null || out === void 0 ? void 0 : out.payload) === null || _b === void 0 ? void 0 : _b.sub) !== null && _c !== void 0 ? _c : "");
                    jti = (_e = (_d = out) === null || _d === void 0 ? void 0 : _d.jti) !== null && _e !== void 0 ? _e : String((_g = (_f = out === null || out === void 0 ? void 0 : out.payload) === null || _f === void 0 ? void 0 : _f.jti) !== null && _g !== void 0 ? _g : "");
                    if (!userId || !jti) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Invalid refresh" }, { status: 401 })];
                    }
                    return [4 /*yield*/, db_1.db.query.refreshTokensTable.findFirst({
                            where: drizzle_orm_1.and(drizzle_orm_1.eq(schema_1.refreshTokensTable.userId, userId), drizzle_orm_1.eq(schema_1.refreshTokensTable.jtiHash, crypto_1.sha256(jti)), drizzle_orm_1.eq(schema_1.refreshTokensTable.revoked, false))
                        })];
                case 4:
                    tokenRow = _j.sent();
                    if (!tokenRow || tokenRow.expiresAt < new Date()) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Refresh expired" }, { status: 401 })];
                    }
                    return [4 /*yield*/, db_1.db.query.usersTable.findFirst({
                            where: drizzle_orm_1.eq(schema_1.usersTable.id, userId),
                            columns: { id: true, email: true, role: true, name: true, imageUrl: true }
                        })];
                case 5:
                    user = _j.sent();
                    if (!user) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "User not found" }, { status: 401 })];
                    }
                    return [4 /*yield*/, jwt_1.signAccessToken(user.id, {
                            role: user.role,
                            email: user.email,
                            name: user.name,
                            imageUrl: user.imageUrl
                        })];
                case 6:
                    session = _j.sent();
                    res = server_1.NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
                    res.cookies.set("session", session, {
                        httpOnly: true,
                        sameSite: "lax",
                        secure: isProd,
                        path: "/",
                        maxAge: 60 * 15
                    });
                    // (Optional) Rotate refresh token here instead of reusing:
                    // - generate new jti & refresh
                    // - insert new row & revoke old one
                    // - set new 'refresh' cookie on res
                    return [2 /*return*/, res];
                case 7:
                    _h = _j.sent();
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Invalid refresh" }, { status: 401 })];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.POST = POST;
