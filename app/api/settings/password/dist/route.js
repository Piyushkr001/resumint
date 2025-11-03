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
var server_1 = require("next/server");
var headers_1 = require("next/headers");
var drizzle_orm_1 = require("drizzle-orm");
var zod_1 = require("zod");
var db_1 = require("@/config/db");
var schema_1 = require("@/config/schema");
var jwt_1 = require("@/lib/jwt");
// ⬇️ IMPORTANT: change to your real password helper import
var password_1 = require("@/lib/password"); // <-- adjust path
exports.runtime = "nodejs";
exports.dynamic = "force-dynamic";
function json(data, status) {
    if (status === void 0) { status = 200; }
    return server_1.NextResponse.json(data, {
        status: status,
        headers: { "Cache-Control": "no-store" }
    });
}
function requireUid() {
    var _a;
    return __awaiter(this, void 0, Promise, function () {
        var token, payload, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, headers_1.cookies()];
                case 1:
                    token = (_a = (_c.sent()).get("session")) === null || _a === void 0 ? void 0 : _a.value;
                    if (!token)
                        return [2 /*return*/, null];
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, jwt_1.verifyAccessToken(token)];
                case 3:
                    payload = (_c.sent()).payload;
                    return [2 /*return*/, (payload === null || payload === void 0 ? void 0 : payload.sub) ? String(payload.sub) : null];
                case 4:
                    _b = _c.sent();
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
var ChangePasswordBody = zod_1.z.object({
    currentPassword: zod_1.z.string().min(6),
    newPassword: zod_1.z.string().min(8).max(128)
});
// POST /api/settings/password
function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var uid, bodyUnknown, parsed, _a, currentPassword, newPassword, user, ok, newHash;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, requireUid()];
                case 1:
                    uid = _b.sent();
                    if (!uid)
                        return [2 /*return*/, json({ error: "Unauthorized" }, 401)];
                    return [4 /*yield*/, req.json()["catch"](function () { return null; })];
                case 2:
                    bodyUnknown = _b.sent();
                    if (!bodyUnknown)
                        return [2 /*return*/, json({ error: "Invalid JSON body" }, 400)];
                    parsed = ChangePasswordBody.safeParse(bodyUnknown);
                    if (!parsed.success)
                        return [2 /*return*/, json({ error: parsed.error.flatten() }, 400)];
                    _a = parsed.data, currentPassword = _a.currentPassword, newPassword = _a.newPassword;
                    return [4 /*yield*/, db_1.db.query.usersTable.findFirst({
                            where: drizzle_orm_1.eq(schema_1.usersTable.id, uid)
                        })];
                case 3:
                    user = _b.sent();
                    if (!user)
                        return [2 /*return*/, json({ error: "User not found" }, 404)];
                    if (user.provider !== "password") {
                        return [2 /*return*/, json({ error: "Password login not enabled for this account" }, 400)];
                    }
                    if (!user.passwordHash) {
                        return [2 /*return*/, json({ error: "No password is set for this account" }, 400)];
                    }
                    return [4 /*yield*/, password_1.verifyPassword(currentPassword, user.passwordHash)];
                case 4:
                    ok = _b.sent();
                    if (!ok)
                        return [2 /*return*/, json({ error: "Current password is incorrect" }, 400)];
                    return [4 /*yield*/, password_1.hashPassword(newPassword)];
                case 5:
                    newHash = _b.sent();
                    return [4 /*yield*/, db_1.db
                            .update(schema_1.usersTable)
                            .set({ passwordHash: newHash, updatedAt: new Date() })
                            .where(drizzle_orm_1.eq(schema_1.usersTable.id, uid))];
                case 6:
                    _b.sent();
                    return [2 /*return*/, json({ ok: true })];
            }
        });
    });
}
exports.POST = POST;
