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
// app/api/auth/google-credential/route.ts
exports.runtime = "nodejs";
exports.dynamic = "force-dynamic";
var server_1 = require("next/server");
var jose_1 = require("jose");
var drizzle_orm_1 = require("drizzle-orm");
var db_1 = require("@/config/db");
var schema_1 = require("@/config/schema");
var crypto_1 = require("@/lib/crypto");
var jwt_1 = require("@/lib/jwt");
var cookies_1 = require("@/lib/cookies"); // ✅ use attach-to-response helper
var GOOGLE_JWKS = jose_1.createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
var GOOGLE_AUD = (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "").trim();
function POST(req) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __awaiter(this, void 0, void 0, function () {
        var credential, dbg, payload, res, err_1, reason, email, sub, emailVerified, name, picture, user, _j, created, jti, session, refresh, res, err_2;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    if (!GOOGLE_AUD) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Server misconfigured: missing Google client ID" }, { status: 500 })];
                    }
                    return [4 /*yield*/, req.json()["catch"](function () { return ({}); })];
                case 1:
                    credential = (_k.sent()).credential;
                    if (!credential) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Missing credential" }, { status: 400 })];
                    }
                    // Debug (dev only)
                    if (process.env.NODE_ENV !== "production") {
                        try {
                            dbg = jose_1.decodeJwt(credential);
                            console.log("[google-credential] token.aud:", dbg.aud, "iss:", dbg.iss, "envAUB:", GOOGLE_AUD);
                        }
                        catch (_l) { }
                    }
                    _k.label = 2;
                case 2:
                    _k.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, jose_1.jwtVerify(credential, GOOGLE_JWKS, {
                            audience: GOOGLE_AUD,
                            issuer: ["https://accounts.google.com", "accounts.google.com"],
                            algorithms: ["RS256"],
                            clockTolerance: 5
                        })];
                case 3:
                    res = _k.sent();
                    payload = res.payload;
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _k.sent();
                    reason = (err_1 === null || err_1 === void 0 ? void 0 : err_1.message) || "verify_failed";
                    if (process.env.NODE_ENV !== "production") {
                        console.error("[google-credential] verify failed:", reason);
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Invalid Google credential", reason: reason }, { status: 401 })];
                    }
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Invalid Google credential" }, { status: 401 })];
                case 5:
                    _k.trys.push([5, 17, , 18]);
                    email = String((_a = payload.email) !== null && _a !== void 0 ? _a : "").toLowerCase();
                    sub = String((_b = payload.sub) !== null && _b !== void 0 ? _b : "");
                    if (!email || !sub) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Google did not return email/sub" }, { status: 400 })];
                    }
                    emailVerified = Boolean(payload.email_verified);
                    name = String((_c = payload.name) !== null && _c !== void 0 ? _c : "Google User");
                    picture = String((_d = payload.picture) !== null && _d !== void 0 ? _d : "");
                    return [4 /*yield*/, db_1.db.query.usersTable.findFirst({
                            where: drizzle_orm_1.eq(schema_1.usersTable.providerId, sub),
                            columns: { id: true, name: true, email: true, role: true, imageUrl: true }
                        })];
                case 6:
                    if (!((_e = (_k.sent())) !== null && _e !== void 0)) return [3 /*break*/, 7];
                    _j = _e;
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, db_1.db.query.usersTable.findFirst({
                        where: drizzle_orm_1.eq(schema_1.usersTable.email, email),
                        columns: { id: true, name: true, email: true, role: true, imageUrl: true }
                    })];
                case 8:
                    _j = (_k.sent());
                    _k.label = 9;
                case 9:
                    user = _j;
                    if (!!user) return [3 /*break*/, 11];
                    return [4 /*yield*/, db_1.db
                            .insert(schema_1.usersTable)
                            .values({
                            name: name,
                            email: email,
                            provider: "google",
                            providerId: sub,
                            passwordHash: null,
                            imageUrl: picture || null,
                            emailVerifiedAt: emailVerified ? new Date() : null,
                            lastLoginAt: new Date()
                        })
                            .returning({
                            id: schema_1.usersTable.id,
                            name: schema_1.usersTable.name,
                            email: schema_1.usersTable.email,
                            role: schema_1.usersTable.role,
                            imageUrl: schema_1.usersTable.imageUrl
                        })];
                case 10:
                    created = _k.sent();
                    user = created === null || created === void 0 ? void 0 : created[0];
                    return [3 /*break*/, 13];
                case 11: 
                // Link existing account to Google (idempotent) and refresh profile bits
                return [4 /*yield*/, db_1.db
                        .update(schema_1.usersTable)
                        .set({
                        provider: "google",
                        providerId: sub,
                        imageUrl: (_f = user.imageUrl) !== null && _f !== void 0 ? _f : (picture || null),
                        emailVerifiedAt: emailVerified ? new Date() : null,
                        lastLoginAt: new Date()
                    })
                        .where(drizzle_orm_1.eq(schema_1.usersTable.id, user.id))];
                case 12:
                    // Link existing account to Google (idempotent) and refresh profile bits
                    _k.sent();
                    _k.label = 13;
                case 13:
                    if (!user) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Failed to create or fetch user" }, { status: 500 })];
                    }
                    jti = crypto_1.randomJti();
                    return [4 /*yield*/, jwt_1.signAccessToken(user.id, {
                            role: user.role,
                            email: user.email,
                            name: user.name,
                            imageUrl: user.imageUrl
                        })];
                case 14:
                    session = _k.sent();
                    return [4 /*yield*/, jwt_1.signRefreshToken(user.id, jti)];
                case 15:
                    refresh = _k.sent();
                    return [4 /*yield*/, db_1.db.insert(schema_1.refreshTokensTable).values({
                            userId: user.id,
                            jtiHash: crypto_1.sha256(jti),
                            userAgent: (_g = req.headers.get("user-agent")) !== null && _g !== void 0 ? _g : undefined,
                            ip: ((_h = req.headers.get("x-forwarded-for")) !== null && _h !== void 0 ? _h : "").split(",")[0] || undefined,
                            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        })];
                case 16:
                    _k.sent();
                    res = server_1.NextResponse.json({
                        user: { id: user.id, name: user.name, email: user.email, role: user.role, imageUrl: user.imageUrl }
                    });
                    return [2 /*return*/, cookies_1.attachAuthCookies(res, session, refresh)];
                case 17:
                    err_2 = _k.sent();
                    console.error("[google-credential] DB error:", err_2);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Database error" }, { status: 500 })];
                case 18: return [2 /*return*/];
            }
        });
    });
}
exports.POST = POST;
