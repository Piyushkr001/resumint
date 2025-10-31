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
exports.GET = exports.dynamic = exports.runtime = void 0;
// app/api/auth/me/route.ts
exports.runtime = "nodejs";
exports.dynamic = "force-dynamic";
var server_1 = require("next/server");
var headers_1 = require("next/headers");
var db_1 = require("@/config/db");
var schema_1 = require("@/config/schema");
var drizzle_orm_1 = require("drizzle-orm");
var jwt_1 = require("@/lib/jwt");
var crypto_1 = require("@/lib/crypto");
var isProd = process.env.NODE_ENV === "production";
function GET() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __awaiter(this, void 0, void 0, function () {
        var jar, session, userId, newSessionJwt, payload, _m, refresh, payload, uid, jti, rec, _o, user, res;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    jar = headers_1.cookies();
                    return [4 /*yield*/, jar];
                case 1:
                    session = (_b = (_a = (_p.sent()).get("session")) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : null;
                    userId = null;
                    newSessionJwt = null;
                    if (!session) return [3 /*break*/, 5];
                    _p.label = 2;
                case 2:
                    _p.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, jwt_1.verifyAccessToken(session)];
                case 3:
                    payload = (_p.sent()).payload;
                    userId = (payload === null || payload === void 0 ? void 0 : payload.sub) ? String(payload.sub) : null;
                    return [3 /*break*/, 5];
                case 4:
                    _m = _p.sent();
                    return [3 /*break*/, 5];
                case 5:
                    if (!!userId) return [3 /*break*/, 13];
                    return [4 /*yield*/, jar];
                case 6:
                    refresh = (_d = (_c = (_p.sent()).get("refresh")) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : null;
                    if (!refresh) return [3 /*break*/, 13];
                    _p.label = 7;
                case 7:
                    _p.trys.push([7, 12, , 13]);
                    return [4 /*yield*/, jwt_1.verifyRefreshToken(refresh)];
                case 8:
                    payload = (_p.sent()).payload;
                    uid = String((_e = payload === null || payload === void 0 ? void 0 : payload.sub) !== null && _e !== void 0 ? _e : "");
                    jti = String((_g = (_f = payload) === null || _f === void 0 ? void 0 : _f.jti) !== null && _g !== void 0 ? _g : "");
                    if (!(uid && jti)) return [3 /*break*/, 11];
                    return [4 /*yield*/, db_1.db.query.refreshTokensTable.findFirst({
                            where: drizzle_orm_1.and(drizzle_orm_1.eq(schema_1.refreshTokensTable.userId, uid), drizzle_orm_1.eq(schema_1.refreshTokensTable.jtiHash, crypto_1.sha256(jti)), drizzle_orm_1.eq(schema_1.refreshTokensTable.revoked, false), drizzle_orm_1.gt(schema_1.refreshTokensTable.expiresAt, new Date()))
                        })];
                case 9:
                    rec = _p.sent();
                    if (!rec) return [3 /*break*/, 11];
                    userId = uid;
                    return [4 /*yield*/, jwt_1.signAccessToken(uid, {
                            role: (_h = payload) === null || _h === void 0 ? void 0 : _h.role,
                            email: (_j = payload) === null || _j === void 0 ? void 0 : _j.email,
                            name: (_k = payload) === null || _k === void 0 ? void 0 : _k.name,
                            imageUrl: (_l = payload) === null || _l === void 0 ? void 0 : _l.imageUrl
                        })];
                case 10:
                    // re-issue short-lived session (carry some claims if you want)
                    newSessionJwt = _p.sent();
                    _p.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    _o = _p.sent();
                    return [3 /*break*/, 13];
                case 13:
                    if (!userId) {
                        return [2 /*return*/, server_1.NextResponse.json({ user: null }, { status: 401, headers: { "Cache-Control": "no-store" } })];
                    }
                    return [4 /*yield*/, db_1.db.query.usersTable.findFirst({
                            where: drizzle_orm_1.eq(schema_1.usersTable.id, userId),
                            columns: { id: true, name: true, email: true, role: true, imageUrl: true }
                        })];
                case 14:
                    user = _p.sent();
                    if (!user) {
                        return [2 /*return*/, server_1.NextResponse.json({ user: null }, { status: 401, headers: { "Cache-Control": "no-store" } })];
                    }
                    res = server_1.NextResponse.json({ user: user }, { headers: { "Cache-Control": "no-store" } });
                    if (newSessionJwt) {
                        res.cookies.set("session", newSessionJwt, {
                            httpOnly: true,
                            sameSite: "lax",
                            secure: isProd,
                            path: "/",
                            maxAge: 60 * 15
                        });
                    }
                    return [2 /*return*/, res];
            }
        });
    });
}
exports.GET = GET;
