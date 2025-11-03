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
var server_1 = require("next/server");
var headers_1 = require("next/headers");
var drizzle_orm_1 = require("drizzle-orm");
var db_1 = require("@/config/db");
var jwt_1 = require("@/lib/jwt");
exports.runtime = "nodejs";
exports.dynamic = "force-dynamic";
function json(data, status) {
    if (status === void 0) { status = 200; }
    return server_1.NextResponse.json(data, { status: status, headers: { "Cache-Control": "no-store" } });
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
function clampRange(fromQ, toQ) {
    var today = new Date();
    var to = toQ !== null && toQ !== void 0 ? toQ : new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()))
        .toISOString().slice(0, 10);
    var from = fromQ;
    if (!from) {
        var d = new Date(to + "T00:00:00Z");
        d.setUTCDate(d.getUTCDate() - 29);
        from = d.toISOString().slice(0, 10);
    }
    return { from: from, to: to };
}
function getRows(res) {
    if (Array.isArray(res))
        return res;
    if (Array.isArray(res === null || res === void 0 ? void 0 : res.rows))
        return res.rows;
    return [];
}
function GET(req) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var uid, url, _c, from, to, limit, rMatched, rMissing, rExtras, e_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, requireUid()];
                case 1:
                    uid = _d.sent();
                    if (!uid)
                        return [2 /*return*/, json({ error: "Unauthorized" }, 401)];
                    url = new URL(req.url);
                    _c = clampRange(url.searchParams.get("from"), url.searchParams.get("to")), from = _c.from, to = _c.to;
                    limit = Math.min(50, Math.max(1, Number((_a = url.searchParams.get("limit")) !== null && _a !== void 0 ? _a : 16)));
                    return [4 /*yield*/, db_1.db.execute(drizzle_orm_1.sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      SELECT LOWER(TRIM(k)) AS keyword, COUNT(*)::int AS count\n      FROM ats_analyses, UNNEST(COALESCE(matched, ARRAY[]::text[])) AS k\n      WHERE user_id = ", "\n        AND created_at >= ", "::date\n        AND created_at <  (", "::date + INTERVAL '1 day')\n      GROUP BY LOWER(TRIM(k))\n      HAVING LOWER(TRIM(k)) <> ''\n      ORDER BY count DESC, keyword ASC\n      LIMIT ", "\n    "], ["\n      SELECT LOWER(TRIM(k)) AS keyword, COUNT(*)::int AS count\n      FROM ats_analyses, UNNEST(COALESCE(matched, ARRAY[]::text[])) AS k\n      WHERE user_id = ", "\n        AND created_at >= ", "::date\n        AND created_at <  (", "::date + INTERVAL '1 day')\n      GROUP BY LOWER(TRIM(k))\n      HAVING LOWER(TRIM(k)) <> ''\n      ORDER BY count DESC, keyword ASC\n      LIMIT ", "\n    "])), uid, from, to, limit))];
                case 2:
                    rMatched = _d.sent();
                    return [4 /*yield*/, db_1.db.execute(drizzle_orm_1.sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      SELECT LOWER(TRIM(k)) AS keyword, COUNT(*)::int AS count\n      FROM ats_analyses, UNNEST(COALESCE(missing, ARRAY[]::text[])) AS k\n      WHERE user_id = ", "\n        AND created_at >= ", "::date\n        AND created_at <  (", "::date + INTERVAL '1 day')\n      GROUP BY LOWER(TRIM(k))\n      HAVING LOWER(TRIM(k)) <> ''\n      ORDER BY count DESC, keyword ASC\n      LIMIT ", "\n    "], ["\n      SELECT LOWER(TRIM(k)) AS keyword, COUNT(*)::int AS count\n      FROM ats_analyses, UNNEST(COALESCE(missing, ARRAY[]::text[])) AS k\n      WHERE user_id = ", "\n        AND created_at >= ", "::date\n        AND created_at <  (", "::date + INTERVAL '1 day')\n      GROUP BY LOWER(TRIM(k))\n      HAVING LOWER(TRIM(k)) <> ''\n      ORDER BY count DESC, keyword ASC\n      LIMIT ", "\n    "])), uid, from, to, limit))];
                case 3:
                    rMissing = _d.sent();
                    return [4 /*yield*/, db_1.db.execute(drizzle_orm_1.sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      SELECT LOWER(TRIM(k)) AS keyword, COUNT(*)::int AS count\n      FROM ats_analyses, UNNEST(COALESCE(extras, ARRAY[]::text[])) AS k\n      WHERE user_id = ", "\n        AND created_at >= ", "::date\n        AND created_at <  (", "::date + INTERVAL '1 day')\n      GROUP BY LOWER(TRIM(k))\n      HAVING LOWER(TRIM(k)) <> ''\n      ORDER BY count DESC, keyword ASC\n      LIMIT ", "\n    "], ["\n      SELECT LOWER(TRIM(k)) AS keyword, COUNT(*)::int AS count\n      FROM ats_analyses, UNNEST(COALESCE(extras, ARRAY[]::text[])) AS k\n      WHERE user_id = ", "\n        AND created_at >= ", "::date\n        AND created_at <  (", "::date + INTERVAL '1 day')\n      GROUP BY LOWER(TRIM(k))\n      HAVING LOWER(TRIM(k)) <> ''\n      ORDER BY count DESC, keyword ASC\n      LIMIT ", "\n    "])), uid, from, to, limit))];
                case 4:
                    rExtras = _d.sent();
                    return [2 /*return*/, json({
                            range: { from: from, to: to },
                            matched: getRows(rMatched),
                            missing: getRows(rMissing),
                            extras: getRows(rExtras)
                        })];
                case 5:
                    e_1 = _d.sent();
                    console.error("analytics/keywords error:", e_1);
                    return [2 /*return*/, json({ error: (_b = e_1 === null || e_1 === void 0 ? void 0 : e_1.message) !== null && _b !== void 0 ? _b : "Internal Error" }, 500)];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.GET = GET;
var templateObject_1, templateObject_2, templateObject_3;
