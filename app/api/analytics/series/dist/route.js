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
var schema_1 = require("@/config/schema");
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
function daysBetween(from, to) {
    var start = new Date(from + "T00:00:00Z");
    var end = new Date(to + "T00:00:00Z");
    var out = [];
    for (var d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
        out.push(d.toISOString().slice(0, 10));
    }
    return out;
}
function getRows(res) {
    if (Array.isArray(res))
        return res;
    if (Array.isArray(res === null || res === void 0 ? void 0 : res.rows))
        return res.rows;
    return [];
}
function GET(req) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var uid, url, metric, _b, from, to, table, res, rows, map_1, series, e_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, requireUid()];
                case 1:
                    uid = _c.sent();
                    if (!uid)
                        return [2 /*return*/, json({ error: "Unauthorized" }, 401)];
                    url = new URL(req.url);
                    metric = (url.searchParams.get("metric") || "views").toLowerCase();
                    _b = clampRange(url.searchParams.get("from"), url.searchParams.get("to")), from = _b.from, to = _b.to;
                    if (!["views", "downloads"].includes(metric)) {
                        return [2 /*return*/, json({ error: "Invalid metric. Use 'views' or 'downloads'." }, 400)];
                    }
                    table = metric === "views" ? schema_1.atsAnalysesTable : schema_1.resumesTable;
                    return [4 /*yield*/, db_1.db.execute(drizzle_orm_1.sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      SELECT date_trunc('day', created_at)::date AS d, COUNT(*)::int AS c\n      FROM ", "\n      WHERE user_id = ", "\n        AND created_at >= ", "::date\n        AND created_at <  (", "::date + INTERVAL '1 day')\n      GROUP BY d\n      ORDER BY d\n    "], ["\n      SELECT date_trunc('day', created_at)::date AS d, COUNT(*)::int AS c\n      FROM ", "\n      WHERE user_id = ", "\n        AND created_at >= ", "::date\n        AND created_at <  (", "::date + INTERVAL '1 day')\n      GROUP BY d\n      ORDER BY d\n    "])), table, uid, from, to))];
                case 2:
                    res = _c.sent();
                    rows = getRows(res);
                    map_1 = new Map(rows.map(function (r) { return [r.d.slice(0, 10), Number(r.c)]; }));
                    series = daysBetween(from, to).map(function (day) { var _a; return ({ date: day, value: (_a = map_1.get(day)) !== null && _a !== void 0 ? _a : 0 }); });
                    return [2 /*return*/, json({ metric: metric, from: from, to: to, resumeId: null, series: series })];
                case 3:
                    e_1 = _c.sent();
                    console.error("analytics/series error:", e_1);
                    return [2 /*return*/, json({ error: (_a = e_1 === null || e_1 === void 0 ? void 0 : e_1.message) !== null && _a !== void 0 ? _a : "Internal Error" }, 500)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.GET = GET;
var templateObject_1;
