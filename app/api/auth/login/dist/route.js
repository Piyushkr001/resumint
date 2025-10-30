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
// app/api/auth/login/route.ts
exports.runtime = "nodejs";
exports.dynamic = "force-dynamic";
var server_1 = require("next/server");
var bcryptjs_1 = require("bcryptjs");
var drizzle_orm_1 = require("drizzle-orm");
var schema_1 = require("@/config/schema");
var crypto_1 = require("@/lib/crypto");
var jwt_1 = require("@/lib/jwt");
var cookies_1 = require("@/lib/cookies");
var db_1 = require("@/config/db");
function POST(req) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var _c, email, password, normalizedEmail, user, ok, jti, session, refresh, res;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, req.json()];
                case 1:
                    _c = _d.sent(), email = _c.email, password = _c.password;
                    if (!email || !password) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Missing fields" }, { status: 400 })];
                    }
                    normalizedEmail = String(email).toLowerCase().trim();
                    return [4 /*yield*/, db_1.db.query.usersTable.findFirst({
                            where: drizzle_orm_1.eq(schema_1.usersTable.email, normalizedEmail)
                        })];
                case 2:
                    user = _d.sent();
                    if (!user || !user.passwordHash) {
                        // passwordHash missing usually means social-only account
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Invalid credentials" }, { status: 401 })];
                    }
                    return [4 /*yield*/, bcryptjs_1["default"].compare(password, user.passwordHash)];
                case 3:
                    ok = _d.sent();
                    if (!ok)
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Invalid credentials" }, { status: 401 })];
                    // update last login
                    return [4 /*yield*/, db_1.db.update(schema_1.usersTable)
                            .set({ lastLoginAt: new Date(), updatedAt: new Date() })
                            .where(drizzle_orm_1.eq(schema_1.usersTable.id, user.id))];
                case 4:
                    // update last login
                    _d.sent();
                    jti = crypto_1.randomJti();
                    return [4 /*yield*/, jwt_1.signAccessToken(user.id, {
                            role: user.role,
                            email: user.email,
                            name: user.name,
                            imageUrl: user.imageUrl
                        })];
                case 5:
                    session = _d.sent();
                    return [4 /*yield*/, jwt_1.signRefreshToken(user.id, jti)];
                case 6:
                    refresh = _d.sent();
                    return [4 /*yield*/, db_1.db.insert(schema_1.refreshTokensTable).values({
                            userId: user.id,
                            jtiHash: crypto_1.sha256(jti),
                            userAgent: (_a = req.headers.get("user-agent")) !== null && _a !== void 0 ? _a : undefined,
                            ip: ((_b = req.headers.get("x-forwarded-for")) !== null && _b !== void 0 ? _b : "").split(",")[0] || undefined,
                            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        })];
                case 7:
                    _d.sent();
                    res = server_1.NextResponse.json({
                        user: { id: user.id, name: user.name, email: user.email, role: user.role, imageUrl: user.imageUrl }
                    });
                    return [2 /*return*/, cookies_1.attachAuthCookies(res, session, refresh)];
            }
        });
    });
}
exports.POST = POST;
