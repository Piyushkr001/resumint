// app/dashboard/ats/page.tsx
"use client";
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
var React = require("react");
var react_1 = require("react");
var react_hot_toast_1 = require("react-hot-toast");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var textarea_1 = require("@/components/ui/textarea");
var badge_1 = require("@/components/ui/badge");
var separator_1 = require("@/components/ui/separator");
var progress_1 = require("@/components/ui/progress");
var tabs_1 = require("@/components/ui/tabs");
var lucide_react_1 = require("lucide-react");
/* ------------------------------------------------------------------ */
/* Helpers (tokenization/keyword ranking used only for local signals)  */
/* ------------------------------------------------------------------ */
var STOP = new Set([
    "and", "or", "the", "a", "an", "of", "to", "in", "for", "with", "on", "at", "by", "as",
    "is", "are", "be", "this", "that", "from", "your", "you", "we", "our", "their", "they",
    "it", "i", "me", "my", "mine", "us", "will", "shall", "can", "could", "should", "must",
    "have", "has", "had", "do", "did", "done", "not", "no", "yes", "but", "if", "then",
    "about", "across", "over", "under", "within", "between", "per", "etc", "via"
]);
function tokenize(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\+\#\.\- ]+/g, " ")
        .split(/\s+/g)
        .filter(function (t) { return t && t.length > 2 && !STOP.has(t); });
}
function extractResumeSignals(text) {
    var _a, _b, _c, _d, _e, _f;
    var email = (_b = (_a = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null;
    var phone = (_d = (_c = text.match(/(\+?\d[\d\-\s()]{8,}\d)/)) === null || _c === void 0 ? void 0 : _c[0]) !== null && _d !== void 0 ? _d : null;
    var links = Array.from(text.matchAll(/https?:\/\/[^\s)]+/g)).map(function (m) { return m[0]; });
    var github = (_e = links.find(function (l) { return /github\.com\//i.test(l); })) !== null && _e !== void 0 ? _e : null;
    var linkedin = (_f = links.find(function (l) { return /linkedin\.com\//i.test(l); })) !== null && _f !== void 0 ? _f : null;
    var years = Array.from(text.matchAll(/(\d+)\+?\s*(?:years|yrs)/gi)).map(function (m) { return Number(m[1]); });
    var claimedYoE = years.length ? Math.max.apply(Math, years) : null;
    return { email: email, phone: phone, links: links, github: github, linkedin: linkedin, claimedYoE: claimedYoE };
}
/* ------------------------------------------------------------------ */
/* File helpers                                                        */
/* ------------------------------------------------------------------ */
function readFileAsArrayBuffer(file) {
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var r = new FileReader();
                    r.onerror = function () { return reject(new Error("Failed to read file")); };
                    r.onload = function () { return resolve(r.result); };
                    r.readAsArrayBuffer(file);
                })];
        });
    });
}
function extractResumeTextViaAPI(file) {
    var _a, _b, _c;
    return __awaiter(this, void 0, Promise, function () {
        var ab, res, j, t, tx, e_1, fd, res, _d, j, t, ee_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 7, , 15]);
                    return [4 /*yield*/, readFileAsArrayBuffer(file)];
                case 1:
                    ab = _e.sent();
                    return [4 /*yield*/, fetch("/api/ats/extract", {
                            method: "POST",
                            headers: { "Content-Type": "application/octet-stream" },
                            body: ab
                        })];
                case 2:
                    res = _e.sent();
                    if (!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.json()];
                case 3:
                    j = _e.sent();
                    t = ((_a = j === null || j === void 0 ? void 0 : j.text) !== null && _a !== void 0 ? _a : "").trim();
                    if (t)
                        return [2 /*return*/, t];
                    throw new Error((j === null || j === void 0 ? void 0 : j.error) || "Empty extraction");
                case 4: return [4 /*yield*/, res.text()];
                case 5:
                    tx = _e.sent();
                    throw new Error(tx || "HTTP " + res.status);
                case 6: return [3 /*break*/, 15];
                case 7:
                    e_1 = _e.sent();
                    _e.label = 8;
                case 8:
                    _e.trys.push([8, 13, , 14]);
                    fd = new FormData();
                    fd.set("file", file);
                    return [4 /*yield*/, fetch("/api/ats/extract", { method: "POST", body: fd })];
                case 9:
                    res = _e.sent();
                    if (!!res.ok) return [3 /*break*/, 11];
                    _d = Error.bind;
                    return [4 /*yield*/, res.text()];
                case 10: throw new (_d.apply(Error, [void 0, _e.sent()]))();
                case 11: return [4 /*yield*/, res.json()];
                case 12:
                    j = _e.sent();
                    t = ((_b = j === null || j === void 0 ? void 0 : j.text) !== null && _b !== void 0 ? _b : "").trim();
                    if (t)
                        return [2 /*return*/, t];
                    throw new Error((j === null || j === void 0 ? void 0 : j.error) || "Empty extraction");
                case 13:
                    ee_1 = _e.sent();
                    throw new Error((_c = ee_1 === null || ee_1 === void 0 ? void 0 : ee_1.message) !== null && _c !== void 0 ? _c : "Extraction failed");
                case 14: return [3 /*break*/, 15];
                case 15: return [2 /*return*/];
            }
        });
    });
}
/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
function ATSPage() {
    var _a, _b, _c;
    var _d = react_1.useState(null), resumeFile = _d[0], setResumeFile = _d[1];
    var _e = react_1.useState(""), resumeText = _e[0], setResumeText = _e[1];
    var _f = react_1.useState(""), jdText = _f[0], setJdText = _f[1];
    var _g = react_1.useState(false), loadingExtract = _g[0], setLoadingExtract = _g[1];
    var _h = react_1.useState(false), loadingScore = _h[0], setLoadingScore = _h[1];
    var _j = react_1.useState(null), result = _j[0], setResult = _j[1];
    var fileInputRef = react_1.useRef(null);
    function handleFile(e) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var f, text, err_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        f = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
                        if (!f)
                            return [2 /*return*/];
                        setResumeFile(f);
                        setLoadingExtract(true);
                        setResult(null);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, 7, 8]);
                        text = "";
                        if (!(f.type === "text/plain")) return [3 /*break*/, 3];
                        return [4 /*yield*/, f.text()];
                    case 2:
                        text = _c.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, extractResumeTextViaAPI(f)];
                    case 4:
                        text = _c.sent();
                        _c.label = 5;
                    case 5:
                        setResumeText(text);
                        react_hot_toast_1.toast.success("Resume extracted");
                        return [3 /*break*/, 8];
                    case 6:
                        err_1 = _c.sent();
                        react_hot_toast_1.toast.error((_b = err_1 === null || err_1 === void 0 ? void 0 : err_1.message) !== null && _b !== void 0 ? _b : "Failed to extract resume");
                        return [3 /*break*/, 8];
                    case 7:
                        setLoadingExtract(false);
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    }
    function pasteSampleJD() {
        setJdText("We are hiring a Frontend Developer with expertise in Next.js, React, and TypeScript. \n      Experience with Tailwind CSS, shadcn UI, performance optimization, accessibility, and CI/CD is preferred. \n      Knowledge of Drizzle ORM, PostgreSQL/Neon, authentication (Clerk/OAuth), testing (Jest/Cypress), \n      and deploying to Vercel is a plus.");
    }
    function clearAll() {
        setResumeFile(null);
        if (fileInputRef.current)
            fileInputRef.current.value = "";
        setResumeText("");
        setJdText("");
        setResult(null);
    }
    /* ----------------------------- CHANGED ------------------------------ */
    /* Now calls your API: POST /api/ats/score with { resumeText, jdText }  */
    function compute() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var res, msg, _c, json, payload, e_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!resumeText.trim()) {
                            react_hot_toast_1.toast.error("Please upload a resume (PDF/TXT) first.");
                            return [2 /*return*/];
                        }
                        if (!jdText.trim()) {
                            react_hot_toast_1.toast.error("Please paste a Job Description.");
                            return [2 /*return*/];
                        }
                        setLoadingScore(true);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 9, 10, 11]);
                        return [4 /*yield*/, fetch("/api/ats/score", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    resumeText: resumeText,
                                    jdText: jdText
                                })
                            })];
                    case 2:
                        res = _d.sent();
                        if (!!res.ok) return [3 /*break*/, 7];
                        msg = "";
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, res.text()];
                    case 4:
                        msg = _d.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        _c = _d.sent();
                        return [3 /*break*/, 6];
                    case 6: throw new Error(msg || "Scoring failed (HTTP " + res.status + ")");
                    case 7: return [4 /*yield*/, res.json()];
                    case 8:
                        json = _d.sent();
                        payload = (_a = json.result) !== null && _a !== void 0 ? _a : json;
                        // Basic shape guard
                        if (typeof (payload === null || payload === void 0 ? void 0 : payload.score) !== "number" ||
                            !Array.isArray(payload === null || payload === void 0 ? void 0 : payload.matched) ||
                            !Array.isArray(payload === null || payload === void 0 ? void 0 : payload.missing)) {
                            throw new Error("Invalid score payload");
                        }
                        setResult(payload);
                        react_hot_toast_1.toast.success("ATS analysis ready");
                        return [3 /*break*/, 11];
                    case 9:
                        e_2 = _d.sent();
                        react_hot_toast_1.toast.error((_b = e_2 === null || e_2 === void 0 ? void 0 : e_2.message) !== null && _b !== void 0 ? _b : "Failed to score");
                        return [3 /*break*/, 11];
                    case 10:
                        setLoadingScore(false);
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    }
    /* ------------------------------------------------------------------- */
    function downloadReport() {
        if (!result)
            return;
        var blob = new Blob([JSON.stringify({ result: result, meta: { createdAt: new Date().toISOString() } }, null, 2)], { type: "application/json" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "ats-report.json";
        a.click();
        URL.revokeObjectURL(url);
    }
    var signals = react_1.useMemo(function () { return (resumeText ? extractResumeSignals(resumeText) : null); }, [resumeText]);
    return (React.createElement("div", { className: "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6" },
        React.createElement("div", { className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between" },
            React.createElement("div", null,
                React.createElement("h1", { className: "text-2xl font-semibold tracking-tight" }, "ATS Analyzer"),
                React.createElement("p", { className: "text-sm text-muted-foreground" }, "Upload your resume and paste a Job Description to see a keyword-match score and quick fixes.")),
            React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement(button_1.Button, { variant: "outline", onClick: clearAll },
                    React.createElement(lucide_react_1.Trash2, { className: "mr-2 h-4 w-4" }),
                    "Clear"),
                React.createElement(button_1.Button, { onClick: compute, disabled: loadingExtract || loadingScore },
                    loadingScore ? React.createElement(lucide_react_1.Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : React.createElement(lucide_react_1.Sparkles, { className: "mr-2 h-4 w-4" }),
                    "Analyze"))),
        React.createElement(separator_1.Separator, { className: "my-4" }),
        React.createElement("div", { className: "flex flex-col gap-6 md:flex-row" },
            React.createElement("div", { className: "flex-1 min-w-0 space-y-4" },
                React.createElement(card_1.Card, null,
                    React.createElement(card_1.CardHeader, null,
                        React.createElement(card_1.CardTitle, null, "1) Upload Resume"),
                        React.createElement(card_1.CardDescription, null, "PDF or text. We extract text for scoring.")),
                    React.createElement(card_1.CardContent, { className: "space-y-3" },
                        React.createElement("div", { className: "flex items-center gap-2" },
                            React.createElement(input_1.Input, { ref: fileInputRef, type: "file", accept: ".pdf,.txt", onChange: handleFile, disabled: loadingExtract }),
                            React.createElement(button_1.Button, { variant: "outline", onClick: function () { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }, disabled: loadingExtract },
                                React.createElement(lucide_react_1.FileUp, { className: "mr-2 h-4 w-4 " + (loadingExtract ? "animate-pulse" : "") }),
                                resumeFile ? "Change" : "Choose file")),
                        loadingExtract && (React.createElement("div", { className: "flex items-center text-sm text-muted-foreground" },
                            React.createElement(lucide_react_1.Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                            "Extracting text\u2026")),
                        !!resumeText && (React.createElement(tabs_1.Tabs, { defaultValue: "preview", className: "w-full" },
                            React.createElement(tabs_1.TabsList, null,
                                React.createElement(tabs_1.TabsTrigger, { value: "preview" }, "Preview"),
                                React.createElement(tabs_1.TabsTrigger, { value: "signals" }, "Signals")),
                            React.createElement(tabs_1.TabsContent, { value: "preview" },
                                React.createElement("div", { className: "rounded-md border p-3 max-h-56 overflow-auto whitespace-pre-wrap text-sm" }, resumeText.slice(0, 3000) || "—")),
                            React.createElement(tabs_1.TabsContent, { value: "signals" },
                                React.createElement("div", { className: "grid gap-2 sm:grid-cols-2" },
                                    React.createElement("div", { className: "rounded-md border p-3 text-sm" },
                                        React.createElement("div", { className: "flex items-center gap-2 font-medium" },
                                            React.createElement(lucide_react_1.Mail, { className: "h-4 w-4" }),
                                            " Email"),
                                        React.createElement("div", { className: "mt-1 text-muted-foreground" }, (_a = signals === null || signals === void 0 ? void 0 : signals.email) !== null && _a !== void 0 ? _a : "—")),
                                    React.createElement("div", { className: "rounded-md border p-3 text-sm" },
                                        React.createElement("div", { className: "flex items-center gap-2 font-medium" },
                                            React.createElement(lucide_react_1.Phone, { className: "h-4 w-4" }),
                                            " Phone"),
                                        React.createElement("div", { className: "mt-1 text-muted-foreground" }, (_b = signals === null || signals === void 0 ? void 0 : signals.phone) !== null && _b !== void 0 ? _b : "—")),
                                    React.createElement("div", { className: "rounded-md border p-3 text-sm sm:col-span-2" },
                                        React.createElement("div", { className: "flex items-center gap-2 font-medium" },
                                            React.createElement(lucide_react_1.Link2, { className: "h-4 w-4" }),
                                            " Links"),
                                        React.createElement("div", { className: "mt-1 flex flex-wrap gap-2" }, ((_c = signals === null || signals === void 0 ? void 0 : signals.links) !== null && _c !== void 0 ? _c : []).length
                                            ? signals.links.slice(0, 6).map(function (l) { return React.createElement(badge_1.Badge, { key: l, variant: "secondary" }, l); })
                                            : React.createElement("span", { className: "text-muted-foreground text-xs" }, "\u2014"))))))))),
                React.createElement(card_1.Card, null,
                    React.createElement(card_1.CardHeader, null,
                        React.createElement(card_1.CardTitle, null, "2) Job Description"),
                        React.createElement(card_1.CardDescription, null, "Paste the JD for the role you\u2019re targeting.")),
                    React.createElement(card_1.CardContent, { className: "space-y-3" },
                        React.createElement(textarea_1.Textarea, { rows: 10, value: jdText, onChange: function (e) { return setJdText(e.target.value); }, placeholder: "Paste the JD here (skills, responsibilities, requirements)\u2026" }),
                        React.createElement("div", { className: "flex flex-wrap gap-2" },
                            React.createElement(button_1.Button, { type: "button", variant: "outline", size: "sm", onClick: pasteSampleJD },
                                React.createElement(lucide_react_1.ClipboardPaste, { className: "mr-2 h-4 w-4" }),
                                "Paste a sample JD"))))),
            React.createElement("div", { className: "w-full md:w-[420px] md:flex-none space-y-4" },
                React.createElement(card_1.Card, null,
                    React.createElement(card_1.CardHeader, null,
                        React.createElement(card_1.CardTitle, null, "ATS Score"),
                        React.createElement(card_1.CardDescription, null, "Based on JD keyword coverage & resume hygiene.")),
                    React.createElement(card_1.CardContent, null, !result ? (React.createElement("div", { className: "text-sm text-muted-foreground" }, "Run analysis to see your score.")) : (React.createElement("div", { className: "space-y-3" },
                        React.createElement("div", { className: "flex items-center justify-between" },
                            React.createElement("div", { className: "text-2xl font-semibold" }, result.score),
                            React.createElement(badge_1.Badge, { variant: result.score >= 85 ? "default" : "secondary" }, result.score >= 85 ? "Excellent" : result.score >= 70 ? "Good" : "Needs work")),
                        React.createElement(progress_1.Progress, { value: result.score }),
                        React.createElement("div", { className: "text-xs text-muted-foreground" }, result.summary)))),
                    React.createElement(card_1.CardFooter, { className: "flex items-center justify-end gap-2" },
                        React.createElement(button_1.Button, { variant: "outline", size: "sm", onClick: downloadReport, disabled: !result },
                            React.createElement(lucide_react_1.Download, { className: "mr-2 h-4 w-4" }),
                            "Download report (JSON)"))),
                React.createElement(card_1.Card, null,
                    React.createElement(card_1.CardHeader, null,
                        React.createElement(card_1.CardTitle, null, "Keywords"),
                        React.createElement(card_1.CardDescription, null, "Matched vs. missing from the JD.")),
                    React.createElement(card_1.CardContent, { className: "space-y-3" }, !result ? (React.createElement("div", { className: "text-sm text-muted-foreground" }, "Run analysis to see keywords.")) : (React.createElement(React.Fragment, null,
                        React.createElement("div", null,
                            React.createElement("div", { className: "mb-1 text-xs font-medium" }, "Matched"),
                            React.createElement("div", { className: "flex flex-wrap gap-1" }, result.matched.length
                                ? result.matched.map(function (k) { return React.createElement(badge_1.Badge, { key: "m-" + k, variant: "secondary" }, k); })
                                : React.createElement("span", { className: "text-xs text-muted-foreground" }, "\u2014"))),
                        React.createElement("div", null,
                            React.createElement("div", { className: "mb-1 text-xs font-medium" }, "Missing"),
                            React.createElement("div", { className: "flex flex-wrap gap-1" }, result.missing.length
                                ? result.missing.map(function (k) { return React.createElement(badge_1.Badge, { key: "x-" + k, variant: "outline", className: "border-destructive/50 text-destructive" }, k); })
                                : React.createElement("span", { className: "text-xs text-muted-foreground" }, "\u2014"))),
                        !!result.extras.length && (React.createElement("div", null,
                            React.createElement("div", { className: "mb-1 text-xs font-medium" }, "Extra skills in resume"),
                            React.createElement("div", { className: "flex flex-wrap gap-1" }, result.extras.map(function (k) { return React.createElement(badge_1.Badge, { key: "e-" + k, variant: "outline" }, k); })))))))),
                React.createElement(card_1.Card, null,
                    React.createElement(card_1.CardHeader, null,
                        React.createElement(card_1.CardTitle, null, "Quick Issues"),
                        React.createElement(card_1.CardDescription, null, "Fix these to improve ATS pass rates.")),
                    React.createElement(card_1.CardContent, { className: "space-y-2" }, !result ? (React.createElement("div", { className: "text-sm text-muted-foreground" }, "Nothing to show yet.")) : result.issues.length ? (React.createElement("ul", { className: "list-disc pl-5 text-sm" }, result.issues.map(function (i) { return React.createElement("li", { key: i }, i); }))) : (React.createElement("div", { className: "flex items-center gap-2 text-sm text-green-600" },
                        React.createElement(lucide_react_1.ShieldCheck, { className: "h-4 w-4" }),
                        "Looks good \u2014 no major issues detected."))))))));
}
exports["default"] = ATSPage;
