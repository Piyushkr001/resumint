"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
// app/api/dashboard/route.ts
exports.runtime = "nodejs";
exports.dynamic = "force-dynamic";
var server_1 = require("next/server");
var headers_1 = require("next/headers");
var drizzle_orm_1 = require("drizzle-orm");
var db_1 = require("@/config/db");
var schema_1 = require("@/config/schema");
var jwt_1 = require("@/lib/jwt");
var crypto_1 = require("@/lib/crypto");
var isProd = process.env.NODE_ENV === "production";
function getUserIdFromCookies() {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, Promise, function () {
        var jar, session, payload, uid, _g, refresh, _h, payload, jti, uid, rec, newSession, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    jar = headers_1.cookies();
                    return [4 /*yield*/, jar];
                case 1:
                    session = (_b = (_a = (_k.sent()).get("session")) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : null;
                    if (!session) return [3 /*break*/, 5];
                    _k.label = 2;
                case 2:
                    _k.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, jwt_1.verifyAccessToken(session)];
                case 3:
                    payload = (_k.sent()).payload;
                    uid = (_c = payload === null || payload === void 0 ? void 0 : payload.sub) !== null && _c !== void 0 ? _c : null;
                    if (uid)
                        return [2 /*return*/, { userId: uid }];
                    return [3 /*break*/, 5];
                case 4:
                    _g = _k.sent();
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, jar];
                case 6:
                    refresh = (_e = (_d = (_k.sent()).get("refresh")) === null || _d === void 0 ? void 0 : _d.value) !== null && _e !== void 0 ? _e : null;
                    if (!refresh)
                        return [2 /*return*/, { userId: null }];
                    _k.label = 7;
                case 7:
                    _k.trys.push([7, 11, , 12]);
                    return [4 /*yield*/, jwt_1.verifyRefreshToken(refresh)];
                case 8:
                    _h = (_k.sent()), payload = _h.payload, jti = _h.jti;
                    uid = String((_f = payload === null || payload === void 0 ? void 0 : payload.sub) !== null && _f !== void 0 ? _f : "");
                    if (!uid)
                        return [2 /*return*/, { userId: null }];
                    return [4 /*yield*/, db_1.db.query.refreshTokensTable.findFirst({
                            where: drizzle_orm_1.and(drizzle_orm_1.eq(schema_1.refreshTokensTable.userId, uid), drizzle_orm_1.eq(schema_1.refreshTokensTable.jtiHash, crypto_1.sha256(jti)), drizzle_orm_1.eq(schema_1.refreshTokensTable.revoked, false), drizzle_orm_1.gt(schema_1.refreshTokensTable.expiresAt, new Date()))
                        })];
                case 9:
                    rec = _k.sent();
                    if (!rec)
                        return [2 /*return*/, { userId: null }];
                    return [4 /*yield*/, jwt_1.signAccessToken(uid, {
                            role: payload.role,
                            email: payload.email,
                            name: payload.name,
                            imageUrl: payload.imageUrl
                        })];
                case 10:
                    newSession = _k.sent();
                    return [2 /*return*/, { userId: uid, newSession: newSession }];
                case 11:
                    _j = _k.sent();
                    return [2 /*return*/, { userId: null }];
                case 12: return [2 /*return*/];
            }
        });
    });
}
function GET() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, userId, newSession, user, now, weekAgo, totalResumes, createdThisWeek, avgAts, templateCount, kpis, recent, resumes, insights, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getUserIdFromCookies()];
                case 1:
                    _a = _b.sent(), userId = _a.userId, newSession = _a.newSession;
                    if (!userId) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } })];
                    }
                    return [4 /*yield*/, db_1.db.query.usersTable.findFirst({
                            where: drizzle_orm_1.eq(schema_1.usersTable.id, userId),
                            columns: { id: true }
                        })];
                case 2:
                    user = _b.sent();
                    if (!user) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } })];
                    }
                    now = new Date();
                    weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return [4 /*yield*/, db_1.db
                            .select({ totalResumes: drizzle_orm_1.sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["count(*)"], ["count(*)"]))) })
                            .from(schema_1.resumesTable)
                            .where(drizzle_orm_1.eq(schema_1.resumesTable.userId, userId))];
                case 3:
                    totalResumes = (_b.sent())[0].totalResumes;
                    return [4 /*yield*/, db_1.db
                            .select({ createdThisWeek: drizzle_orm_1.sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["count(*)"], ["count(*)"]))) })
                            .from(schema_1.resumesTable)
                            .where(drizzle_orm_1.and(drizzle_orm_1.eq(schema_1.resumesTable.userId, userId), drizzle_orm_1.gt(schema_1.resumesTable.createdAt, weekAgo)))];
                case 4:
                    createdThisWeek = (_b.sent())[0].createdThisWeek;
                    return [4 /*yield*/, db_1.db
                            .select({ avgAts: drizzle_orm_1.sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["COALESCE(AVG(", "), 0)"], ["COALESCE(AVG(", "), 0)"])), schema_1.resumesTable.atsScore) })
                            .from(schema_1.resumesTable)
                            .where(drizzle_orm_1.eq(schema_1.resumesTable.userId, userId))];
                case 5:
                    avgAts = (_b.sent())[0].avgAts;
                    return [4 /*yield*/, db_1.db
                            .select({ templateCount: drizzle_orm_1.sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["COUNT(DISTINCT ", ")"], ["COUNT(DISTINCT ", ")"])), schema_1.resumesTable.template) })
                            .from(schema_1.resumesTable)
                            .where(drizzle_orm_1.eq(schema_1.resumesTable.userId, userId))];
                case 6:
                    templateCount = (_b.sent())[0].templateCount;
                    kpis = [
                        { label: "Resumes Created", value: Number(totalResumes !== null && totalResumes !== void 0 ? totalResumes : 0), delta: "+" + (createdThisWeek !== null && createdThisWeek !== void 0 ? createdThisWeek : 0) + " this week", up: (createdThisWeek !== null && createdThisWeek !== void 0 ? createdThisWeek : 0) >= 0 },
                        { label: "ATS Avg. Score", value: Math.round(Number(avgAts !== null && avgAts !== void 0 ? avgAts : 0)), delta: "+0", up: true },
                        { label: "Templates Used", value: Number(templateCount !== null && templateCount !== void 0 ? templateCount : 0), delta: "+0", up: true },
                    ];
                    return [4 /*yield*/, db_1.db
                            .select({
                            id: schema_1.resumesTable.id,
                            title: schema_1.resumesTable.title,
                            template: schema_1.resumesTable.template,
                            ats: schema_1.resumesTable.atsScore,
                            updatedAtISO: schema_1.resumesTable.updatedAt
                        })
                            .from(schema_1.resumesTable)
                            .where(drizzle_orm_1.eq(schema_1.resumesTable.userId, userId))
                            .orderBy(drizzle_orm_1.desc(schema_1.resumesTable.updatedAt))
                            .limit(5)];
                case 7:
                    recent = _b.sent();
                    resumes = recent.map(function (r) {
                        var _a, _b, _c, _d;
                        return ({
                            id: r.id,
                            title: (_a = r.title) !== null && _a !== void 0 ? _a : "Untitled",
                            template: (_b = r.template) !== null && _b !== void 0 ? _b : "clean",
                            ats: (_c = r.ats) !== null && _c !== void 0 ? _c : 0,
                            updatedAt: new Date((_d = r.updatedAtISO) !== null && _d !== void 0 ? _d : new Date()).toLocaleString(undefined, {
                                month: "short",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit"
                            })
                        });
                    });
                    insights = [];
                    res = server_1.NextResponse.json({
                        kpis: kpis,
                        resumes: resumes,
                        insights: insights
                    }, { headers: { "Cache-Control": "no-store" } });
                    // Re-attach a fresh short-lived session if we minted one
                    if (newSession) {
                        res.cookies.set("session", newSession, {
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
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
