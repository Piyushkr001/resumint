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
exports.POST = void 0;
var server_1 = require("next/server");
var headers_1 = require("next/headers");
var bcryptjs_1 = require("bcryptjs");
var db_1 = require("@/config/db");
var schema_1 = require("@/config/schema");
var drizzle_orm_1 = require("drizzle-orm");
var crypto_1 = require("@/lib/crypto");
var jwt_1 = require("@/lib/jwt");
var cookies_1 = require("@/lib/cookies");
function POST(req) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var jar, existing, _d, _e, name, email, password, normalizedEmail, exists, passwordHash, user, jti, access, refresh, res;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, headers_1.cookies()];
                case 1:
                    jar = _f.sent();
                    existing = (_a = jar.get("refresh")) === null || _a === void 0 ? void 0 : _a.value;
                    if (!existing) return [3 /*break*/, 5];
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, jwt_1.verifyRefreshToken(existing)];
                case 3:
                    _f.sent();
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Already logged in" }, { status: 409 })];
                case 4:
                    _d = _f.sent();
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, req.json()];
                case 6:
                    _e = _f.sent(), name = _e.name, email = _e.email, password = _e.password;
                    if (!name || !email || !password)
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Missing fields" }, { status: 400 })];
                    normalizedEmail = String(email).toLowerCase().trim();
                    return [4 /*yield*/, db_1.db.query.usersTable.findFirst({ where: drizzle_orm_1.eq(schema_1.usersTable.email, normalizedEmail) })];
                case 7:
                    exists = _f.sent();
                    if (exists)
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Email already in use" }, { status: 409 })];
                    return [4 /*yield*/, bcryptjs_1["default"].hash(password, 12)];
                case 8:
                    passwordHash = _f.sent();
                    return [4 /*yield*/, db_1.db.insert(schema_1.usersTable)
                            .values({ name: name, email: normalizedEmail, passwordHash: passwordHash, provider: "password" })
                            .returning({ id: schema_1.usersTable.id, name: schema_1.usersTable.name, email: schema_1.usersTable.email, role: schema_1.usersTable.role, imageUrl: schema_1.usersTable.imageUrl })];
                case 9:
                    user = (_f.sent())[0];
                    jti = crypto_1.randomJti();
                    return [4 /*yield*/, jwt_1.signAccessToken(user.id, { role: user.role, email: user.email, name: user.name })];
                case 10:
                    access = _f.sent();
                    return [4 /*yield*/, jwt_1.signRefreshToken(user.id, jti)];
                case 11:
                    refresh = _f.sent();
                    return [4 /*yield*/, db_1.db.insert(schema_1.refreshTokensTable).values({
                            userId: user.id,
                            jtiHash: crypto_1.sha256(jti),
                            userAgent: ((_b = req.headers.get("user-agent")) !== null && _b !== void 0 ? _b : undefined),
                            ip: ((_c = req.headers.get("x-forwarded-for")) !== null && _c !== void 0 ? _c : "").split(",")[0] || undefined,
                            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        })];
                case 12:
                    _f.sent();
                    res = server_1.NextResponse.json({ user: user });
                    return [2 /*return*/, cookies_1.attachAuthCookies(res, access, refresh)];
            }
        });
    });
}
exports.POST = POST;
