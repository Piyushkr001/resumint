"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.POST = exports.dynamic = exports.runtime = void 0;
var server_1 = require("next/server");
var headers_1 = require("next/headers");
var crypto_1 = require("crypto");
var db_1 = require("@/config/db");
var schema_1 = require("@/config/schema");
var jwt_1 = require("@/lib/jwt");
exports.runtime = "nodejs";
exports.dynamic = "force-dynamic";
/* ------------------------------ helpers ------------------------------ */
var STOP = new Set([
    "and", "or", "the", "a", "an", "of", "to", "in", "for", "with", "on", "at", "by", "as",
    "is", "are", "be", "this", "that", "from", "your", "you", "we", "our", "their", "they",
    "it", "i", "me", "my", "mine", "us", "will", "shall", "can", "could", "should", "must",
    "have", "has", "had", "do", "did", "done", "not", "no", "yes", "but", "if", "then",
    "about", "across", "over", "under", "within", "between", "per", "etc", "via"
]);
var SKILL_HINTS = [
    "nextjs", "react", "typescript", "javascript", "tailwind", "shadcn", "drizzle", "neon",
    "postgres", "node", "express", "redux", "zustand", "clerk", "oauth", "vite", "webpack",
    "bun", "jest", "testing", "e2e", "cypress", "storybook", "accessibility", "a11y",
    "docker", "kubernetes", "ci", "cd", "vercel", "render", "seo", "performance", "security",
    "chartjs", "threejs", "pdfkit", "pdfjs", "rest", "graphql"
];
function tokenize(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\+\#\.\- ]+/g, " ")
        .split(/\s+/g)
        .filter(function (t) { return t && t.length > 2 && !STOP.has(t); });
}
function isUsefulKeyword(k) {
    if (k.length <= 2)
        return false;
    if (/^\d+$/.test(k))
        return false;
    if (["developer", "engineer", "senior", "junior", "team", "product", "company", "role"].includes(k))
        return false;
    return true;
}
function rankKeywords(text, max) {
    var _a;
    if (max === void 0) { max = 40; }
    var tokens = tokenize(text);
    var freq = new Map();
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var t = tokens_1[_i];
        var w = t.replace(/\.$/, "");
        freq.set(w, ((_a = freq.get(w)) !== null && _a !== void 0 ? _a : 0) + (SKILL_HINTS.includes(w) ? 4 : 1));
    }
    var ranked = __spreadArrays(freq.entries()).sort(function (a, b) { return b[1] - a[1]; })
        .map(function (_a) {
        var w = _a[0];
        return w;
    })
        .filter(isUsefulKeyword);
    var dedup = [];
    var _loop_1 = function (k) {
        if (!dedup.some(function (d) { return d.includes(k) || k.includes(d); }))
            dedup.push(k);
        if (dedup.length >= max)
            return "break";
    };
    for (var _b = 0, ranked_1 = ranked; _b < ranked_1.length; _b++) {
        var k = ranked_1[_b];
        var state_1 = _loop_1(k);
        if (state_1 === "break")
            break;
    }
    return dedup;
}
function pickTopKeywordsFromJD(jd) {
    var ranked = rankKeywords(jd, 60);
    var hinted = ranked.filter(function (r) { return SKILL_HINTS.includes(r); });
    var others = ranked.filter(function (r) { return !SKILL_HINTS.includes(r); });
    return Array.from(new Set(__spreadArrays(hinted.slice(0, 20), others.slice(0, 20)))).slice(0, 30);
}
function extractSignals(resumeText) {
    var _a, _b, _c, _d, _e, _f;
    var email = (_b = (_a = resumeText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null;
    var phone = (_d = (_c = resumeText.match(/(\+?\d[\d\-\s()]{8,}\d)/)) === null || _c === void 0 ? void 0 : _c[0]) !== null && _d !== void 0 ? _d : null;
    var links = Array.from(resumeText.matchAll(/https?:\/\/[^\s)]+/g)).map(function (m) { return m[0]; });
    var github = (_e = links.find(function (l) { return /github\.com\//i.test(l); })) !== null && _e !== void 0 ? _e : null;
    var linkedin = (_f = links.find(function (l) { return /linkedin\.com\//i.test(l); })) !== null && _f !== void 0 ? _f : null;
    return { email: email, phone: phone, github: github, linkedin: linkedin, links: links };
}
function scoreATS(resumeText, jdText) {
    var jdKeys = pickTopKeywordsFromJD(jdText);
    var resTokens = new Set(tokenize(resumeText));
    var matched = jdKeys.filter(function (k) { return resTokens.has(k); });
    var missing = jdKeys.filter(function (k) { return !resTokens.has(k); });
    var base = 0;
    for (var _i = 0, matched_1 = matched; _i < matched_1.length; _i++) {
        var k = matched_1[_i];
        base += SKILL_HINTS.includes(k) ? 4 : 2;
    }
    var ideal = jdKeys.reduce(function (acc, k) { return acc + (SKILL_HINTS.includes(k) ? 4 : 2); }, 0);
    var coverage = ideal ? Math.min(1, base / ideal) : 0;
    var sig = extractSignals(resumeText);
    var boost = 0;
    if (sig.email)
        boost += 0.03;
    if (sig.phone)
        boost += 0.02;
    if (sig.github || sig.linkedin)
        boost += 0.03;
    var score = Math.round(Math.min(100, (coverage + boost) * 100));
    var extras = rankKeywords(resumeText, 40).filter(function (k) { return !jdKeys.includes(k); }).slice(0, 15);
    var issues = [];
    if (!sig.email)
        issues.push("Email not detected");
    if (!sig.phone)
        issues.push("Phone not detected");
    if (!sig.linkedin)
        issues.push("LinkedIn not detected");
    if (resumeText.length < 1200)
        issues.push("Resume text seems too short");
    if (missing.length > 15)
        issues.push("Many JD keywords missing");
    if (score < 60)
        issues.push("Low JD match — tailor your bullets");
    var summary = "Matched " + matched.length + "/" + jdKeys.length + " target skills. " + (issues.length ? "Issues: " + issues.join("; ") + "." : "No major issues detected.");
    return { score: score, matched: matched, missing: missing, extras: extras, issues: issues, summary: summary };
}
function requireUid() {
    var _a;
    return __awaiter(this, void 0, Promise, function () {
        var cookie, payload, sub, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, headers_1.cookies()];
                case 1:
                    cookie = (_a = (_c.sent()).get("session")) === null || _a === void 0 ? void 0 : _a.value;
                    if (!cookie)
                        return [2 /*return*/, null];
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, jwt_1.verifyAccessToken(cookie)];
                case 3:
                    payload = (_c.sent()).payload;
                    sub = payload === null || payload === void 0 ? void 0 : payload.sub;
                    return [2 /*return*/, sub ? String(sub) : null];
                case 4:
                    _b = _c.sent();
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function POST(req) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var body, result, savedId, uid, jdHash, row, err_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, req.json()["catch"](function () { return null; })];
                case 1:
                    body = _d.sent();
                    if (!body || !body.resumeText || !body.jdText) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Provide resumeText and jdText" }, { status: 400 })];
                    }
                    result = scoreATS(body.resumeText, body.jdText);
                    savedId = null;
                    if (!body.save) return [3 /*break*/, 4];
                    return [4 /*yield*/, requireUid()];
                case 2:
                    uid = _d.sent();
                    if (!uid)
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 })];
                    jdHash = crypto_1["default"].createHash("sha256").update(body.jdText).digest("hex");
                    return [4 /*yield*/, db_1.db
                            .insert(schema_1.atsAnalysesTable)
                            .values({
                            userId: uid,
                            resumeId: (_a = body.resumeId) !== null && _a !== void 0 ? _a : null,
                            jdHash: jdHash,
                            score: result.score,
                            matched: result.matched,
                            missing: result.missing,
                            extras: result.extras,
                            issues: result.issues
                        })
                            .returning({ id: schema_1.atsAnalysesTable.id })];
                case 3:
                    row = (_d.sent())[0];
                    savedId = (_b = row === null || row === void 0 ? void 0 : row.id) !== null && _b !== void 0 ? _b : null;
                    _d.label = 4;
                case 4: return [2 /*return*/, server_1.NextResponse.json(__assign(__assign({}, result), { id: savedId }), { status: 200, headers: { "Cache-Control": "no-store" } })];
                case 5:
                    err_1 = _d.sent();
                    return [2 /*return*/, server_1.NextResponse.json({ error: (_c = err_1 === null || err_1 === void 0 ? void 0 : err_1.message) !== null && _c !== void 0 ? _c : "Scoring failed" }, { status: 500 })];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.POST = POST;
