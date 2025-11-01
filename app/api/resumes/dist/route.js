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
exports.POST = exports.GET = exports.dynamic = exports.runtime = void 0;
// app/api/resumes/route.ts
exports.runtime = "nodejs";
exports.dynamic = "force-dynamic";
var server_1 = require("next/server");
var headers_1 = require("next/headers");
var drizzle_orm_1 = require("drizzle-orm");
var zod_1 = require("zod");
var db_1 = require("@/config/db");
var schema_1 = require("@/config/schema");
var jwt_1 = require("@/lib/jwt");
var CreateBody = zod_1.z.object({
    title: zod_1.z.string().min(2),
    role: zod_1.z.string().min(2),
    template: zod_1.z["enum"](["clean", "modern", "minimal", "elegant"]),
    summary: zod_1.z.string().max(800).optional().nullable(),
    skills: zod_1.z.union([
        zod_1.z.string(),
        zod_1.z.array(zod_1.z.string()).max(50),
    ]).optional(),
    jobDescription: zod_1.z.string().optional().nullable(),
    isPublic: zod_1.z.boolean().optional()["default"](false)
});
function parseSkills(input) {
    if (!input)
        return null;
    if (Array.isArray(input)) {
        return input.map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 50);
    }
    return input
        .split(/[,\n]/g)
        .map(function (s) { return s.trim(); })
        .filter(Boolean)
        .slice(0, 50);
}
function requireUserId() {
    var _a;
    return __awaiter(this, void 0, Promise, function () {
        var jar, token, payload, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    jar = headers_1.cookies();
                    return [4 /*yield*/, jar];
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
                    return [2 /*return*/, String(payload.sub)];
                case 4:
                    _b = _c.sent();
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// GET /api/resumes?q=&limit=&offset=
function GET(req) {
    return __awaiter(this, void 0, void 0, function () {
        var uid, searchParams, q, limit, offset, where, rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, requireUserId()];
                case 1:
                    uid = _a.sent();
                    if (!uid)
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 })];
                    searchParams = new URL(req.url).searchParams;
                    q = (searchParams.get("q") || "").trim();
                    limit = Math.min(parseInt(searchParams.get("limit") || "20", 10) || 20, 50);
                    offset = Math.max(parseInt(searchParams.get("offset") || "0", 10) || 0, 0);
                    where = q
                        ? drizzle_orm_1.and(drizzle_orm_1.eq(schema_1.resumesTable.userId, uid), drizzle_orm_1.or(drizzle_orm_1.ilike(schema_1.resumesTable.title, "%" + q + "%"), drizzle_orm_1.ilike(schema_1.resumesTable.role, "%" + q + "%"), drizzle_orm_1.ilike(schema_1.resumesTable.template, "%" + q + "%")))
                        : drizzle_orm_1.eq(schema_1.resumesTable.userId, uid);
                    return [4 /*yield*/, db_1.db
                            .select({
                            id: schema_1.resumesTable.id,
                            title: schema_1.resumesTable.title,
                            role: schema_1.resumesTable.role,
                            template: schema_1.resumesTable.template,
                            atsScore: schema_1.resumesTable.atsScore,
                            updatedAt: schema_1.resumesTable.updatedAt
                        })
                            .from(schema_1.resumesTable)
                            .where(where)
                            .orderBy(drizzle_orm_1.desc(schema_1.resumesTable.updatedAt))
                            .limit(limit)
                            .offset(offset)];
                case 2:
                    rows = _a.sent();
                    return [2 /*return*/, server_1.NextResponse.json({ items: rows, limit: limit, offset: offset })];
            }
        });
    });
}
exports.GET = GET;
// POST /api/resumes
function POST(req) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var uid, json, parsed, body, skills, created;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, requireUserId()];
                case 1:
                    uid = _b.sent();
                    if (!uid)
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 })];
                    return [4 /*yield*/, req.json()["catch"](function () { return ({}); })];
                case 2:
                    json = _b.sent();
                    parsed = CreateBody.safeParse(json);
                    if (!parsed.success) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })];
                    }
                    body = parsed.data;
                    skills = parseSkills(body.skills);
                    return [4 /*yield*/, db_1.db
                            .insert(schema_1.resumesTable)
                            .values({
                            userId: uid,
                            title: body.title,
                            role: body.role,
                            template: body.template,
                            summary: body.summary || null,
                            skills: skills && skills.length ? skills : null,
                            jobDescription: body.jobDescription || null,
                            isPublic: (_a = body.isPublic) !== null && _a !== void 0 ? _a : false,
                            atsScore: 0
                        })
                            .returning({
                            id: schema_1.resumesTable.id,
                            title: schema_1.resumesTable.title,
                            role: schema_1.resumesTable.role,
                            template: schema_1.resumesTable.template,
                            atsScore: schema_1.resumesTable.atsScore,
                            updatedAt: schema_1.resumesTable.updatedAt
                        })];
                case 3:
                    created = (_b.sent())[0];
                    return [2 /*return*/, server_1.NextResponse.json({ resume: created }, { status: 201 })];
            }
        });
    });
}
exports.POST = POST;
