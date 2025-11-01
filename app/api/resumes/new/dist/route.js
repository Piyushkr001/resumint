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
// app/api/resumes/new/route.ts
exports.runtime = "nodejs";
exports.dynamic = "force-dynamic";
var server_1 = require("next/server");
var headers_1 = require("next/headers");
var zod_1 = require("zod");
var db_1 = require("@/config/db");
var schema_1 = require("@/config/schema");
var jwt_1 = require("@/lib/jwt");
var TemplateEnum = zod_1.z["enum"](["clean", "modern", "minimal", "elegant"]);
// ----- Zod schemas for child sections -----
var ExperienceSchema = zod_1.z.object({
    company: zod_1.z.string().min(2),
    title: zod_1.z.string().min(2),
    location: zod_1.z.string().optional().nullable(),
    startDate: zod_1.z.string().min(4),
    endDate: zod_1.z.string().optional().nullable(),
    isCurrent: zod_1.z.boolean().optional()["default"](false),
    bullets: zod_1.z.array(zod_1.z.string()).max(20).optional()
});
var EducationSchema = zod_1.z.object({
    school: zod_1.z.string().min(2),
    degree: zod_1.z.string().min(2),
    field: zod_1.z.string().optional().nullable(),
    location: zod_1.z.string().optional().nullable(),
    startYear: zod_1.z.number().int().min(1900).max(2100).optional().nullable(),
    endYear: zod_1.z.number().int().min(1900).max(2100).optional().nullable(),
    achievements: zod_1.z.array(zod_1.z.string()).max(20).optional()
});
var LinkSchema = zod_1.z.object({
    label: zod_1.z.string().min(2).max(80),
    url: zod_1.z.string().url(),
    order: zod_1.z.number().int().min(0).max(1000).optional()
});
// ----- Body schema -----
var BodySchema = zod_1.z.object({
    title: zod_1.z.string().min(2),
    role: zod_1.z.string().min(2),
    template: TemplateEnum["default"]("clean"),
    summary: zod_1.z.string().max(800).optional().nullable(),
    // accept string "a, b, c" or string[]:
    skills: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string()).max(50)]).optional(),
    jobDescription: zod_1.z.string().optional().nullable(),
    isPublic: zod_1.z.boolean().optional()["default"](false),
    experiences: zod_1.z.array(ExperienceSchema).optional(),
    educations: zod_1.z.array(EducationSchema).optional(),
    links: zod_1.z.array(LinkSchema).optional()
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
                    return [2 /*return*/, String(payload.sub)];
                case 4:
                    _b = _c.sent();
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, json, parsed, body, skills, result;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, requireUserId()];
                case 1:
                    userId = _a.sent();
                    if (!userId) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 })];
                    }
                    return [4 /*yield*/, req.json()["catch"](function () { return ({}); })];
                case 2:
                    json = _a.sent();
                    parsed = BodySchema.safeParse(json);
                    if (!parsed.success) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })];
                    }
                    body = parsed.data;
                    skills = parseSkills(body.skills);
                    return [4 /*yield*/, db_1.db.transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var created;
                            var _a, _b, _c, _d, _e, _f;
                            return __generator(this, function (_g) {
                                switch (_g.label) {
                                    case 0: return [4 /*yield*/, tx
                                            .insert(schema_1.resumesTable)
                                            .values({
                                            userId: userId,
                                            title: body.title,
                                            role: body.role,
                                            template: body.template,
                                            summary: (_a = body.summary) !== null && _a !== void 0 ? _a : null,
                                            skills: skills && skills.length ? skills : null,
                                            jobDescription: (_b = body.jobDescription) !== null && _b !== void 0 ? _b : null,
                                            isPublic: (_c = body.isPublic) !== null && _c !== void 0 ? _c : false,
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
                                    case 1:
                                        created = (_g.sent())[0];
                                        if (!((_d = body.experiences) === null || _d === void 0 ? void 0 : _d.length)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, tx.insert(schema_1.resumeExperiencesTable).values(
                                            //@ts-ignore
                                            body.experiences.map(function (e, idx) {
                                                var _a, _b, _c;
                                                return ({
                                                    resumeId: created.id,
                                                    company: e.company,
                                                    title: e.title,
                                                    location: (_a = e.location) !== null && _a !== void 0 ? _a : null,
                                                    startDate: new Date(e.startDate),
                                                    endDate: e.endDate ? new Date(e.endDate) : null,
                                                    isCurrent: !!e.isCurrent,
                                                    bullets: (_c = (_b = e.bullets) === null || _b === void 0 ? void 0 : _b.slice(0, 20)) !== null && _c !== void 0 ? _c : null
                                                });
                                            }))];
                                    case 2:
                                        _g.sent();
                                        _g.label = 3;
                                    case 3:
                                        if (!((_e = body.educations) === null || _e === void 0 ? void 0 : _e.length)) return [3 /*break*/, 5];
                                        return [4 /*yield*/, tx.insert(schema_1.resumeEducationsTable).values(body.educations.map(function (ed) {
                                                var _a, _b, _c, _d, _e, _f;
                                                return ({
                                                    resumeId: created.id,
                                                    school: ed.school,
                                                    degree: ed.degree,
                                                    field: (_a = ed.field) !== null && _a !== void 0 ? _a : null,
                                                    location: (_b = ed.location) !== null && _b !== void 0 ? _b : null,
                                                    startYear: (_c = ed.startYear) !== null && _c !== void 0 ? _c : null,
                                                    endYear: (_d = ed.endYear) !== null && _d !== void 0 ? _d : null,
                                                    achievements: (_f = (_e = ed.achievements) === null || _e === void 0 ? void 0 : _e.slice(0, 20)) !== null && _f !== void 0 ? _f : null
                                                });
                                            }))];
                                    case 4:
                                        _g.sent();
                                        _g.label = 5;
                                    case 5:
                                        if (!((_f = body.links) === null || _f === void 0 ? void 0 : _f.length)) return [3 /*break*/, 7];
                                        return [4 /*yield*/, tx.insert(schema_1.resumeLinksTable).values(body.links.map(function (l, i) {
                                                var _a;
                                                return ({
                                                    resumeId: created.id,
                                                    label: l.label,
                                                    url: l.url,
                                                    order: (_a = l.order) !== null && _a !== void 0 ? _a : i
                                                });
                                            }))];
                                    case 6:
                                        _g.sent();
                                        _g.label = 7;
                                    case 7: return [2 /*return*/, created];
                                }
                            });
                        }); })];
                case 3:
                    result = _a.sent();
                    return [2 /*return*/, server_1.NextResponse.json({ resume: result }, { status: 201 })];
            }
        });
    });
}
exports.POST = POST;
