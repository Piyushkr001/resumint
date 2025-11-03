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
var zod_1 = require("zod");
var crypto_1 = require("crypto");
var drizzle_orm_1 = require("drizzle-orm");
var db_1 = require("@/config/db");
var schema_1 = require("@/config/schema");
var password_1 = require("@/lib/password");
exports.runtime = "nodejs";
exports.dynamic = "force-dynamic";
function json(data, status) {
    if (status === void 0) { status = 200; }
    return server_1.NextResponse.json(data, {
        status: status,
        headers: { "Cache-Control": "no-store" }
    });
}
var ResetBody = zod_1.z.object({
    email: zod_1.z.string().email(),
    otp: zod_1.z.string().min(4).max(10),
    newPassword: zod_1.z.string().min(8).max(128)
});
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
function hashOtp(otp) {
    return crypto_1["default"].createHash("sha256").update(otp).digest("hex");
}
function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var bodyUnknown, parsed, _a, email, otp, newPassword, emailNorm, user, now, otpHash, token, newHash;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, req.json()["catch"](function () { return null; })];
                case 1:
                    bodyUnknown = _b.sent();
                    parsed = ResetBody.safeParse(bodyUnknown);
                    if (!parsed.success) {
                        return [2 /*return*/, json({ error: "Invalid input" }, 400)];
                    }
                    _a = parsed.data, email = _a.email, otp = _a.otp, newPassword = _a.newPassword;
                    emailNorm = normalizeEmail(email);
                    return [4 /*yield*/, db_1.db.query.usersTable.findFirst({
                            where: drizzle_orm_1.eq(schema_1.usersTable.email, emailNorm)
                        })];
                case 2:
                    user = _b.sent();
                    if (!user) {
                        // Generic error (don't reveal whether the email exists)
                        return [2 /*return*/, json({ error: "Invalid code or email" }, 400)];
                    }
                    now = new Date();
                    otpHash = hashOtp(otp);
                    return [4 /*yield*/, db_1.db.query.passwordResetTokensTable.findFirst({
                            where: drizzle_orm_1.and(drizzle_orm_1.eq(schema_1.passwordResetTokensTable.userId, user.id), drizzle_orm_1.eq(schema_1.passwordResetTokensTable.otpHash, otpHash), drizzle_orm_1.isNull(schema_1.passwordResetTokensTable.usedAt), drizzle_orm_1.gt(schema_1.passwordResetTokensTable.expiresAt, now)),
                            orderBy: function (t, _a) {
                                var desc = _a.desc;
                                return desc(t.createdAt);
                            }
                        })];
                case 3:
                    token = _b.sent();
                    if (!token) {
                        return [2 /*return*/, json({ error: "Invalid or expired code" }, 400)];
                    }
                    return [4 /*yield*/, password_1.hashPassword(newPassword)];
                case 4:
                    newHash = _b.sent();
                    return [4 /*yield*/, db_1.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    // 1) Update the user's password
                                    return [4 /*yield*/, tx
                                            .update(schema_1.usersTable)
                                            .set({ passwordHash: newHash, updatedAt: now })
                                            .where(drizzle_orm_1.eq(schema_1.usersTable.id, user.id))];
                                    case 1:
                                        // 1) Update the user's password
                                        _a.sent();
                                        // 2) Mark this reset token as used
                                        return [4 /*yield*/, tx
                                                .update(schema_1.passwordResetTokensTable)
                                                .set({ usedAt: now })
                                                .where(drizzle_orm_1.eq(schema_1.passwordResetTokensTable.id, token.id))];
                                    case 2:
                                        // 2) Mark this reset token as used
                                        _a.sent();
                                        // 3) Optional but recommended: revoke all active refresh tokens
                                        return [4 /*yield*/, tx
                                                .update(schema_1.refreshTokensTable)
                                                .set({ revoked: true })
                                                .where(drizzle_orm_1.eq(schema_1.refreshTokensTable.userId, user.id))];
                                    case 3:
                                        // 3) Optional but recommended: revoke all active refresh tokens
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 5:
                    _b.sent();
                    return [2 /*return*/, json({ ok: true })];
            }
        });
    });
}
exports.POST = POST;
