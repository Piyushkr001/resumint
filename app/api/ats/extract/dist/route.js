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
var module_1 = require("module");
exports.runtime = "nodejs";
exports.dynamic = "force-dynamic";
var require = module_1.createRequire(import.meta.url);
/* ------------------------------- helpers ------------------------------- */
function isPdf(u8) {
    return (!!u8 &&
        u8.byteLength >= 5 &&
        u8[0] === 0x25 && // %
        u8[1] === 0x50 && // P
        u8[2] === 0x44 && // D
        u8[3] === 0x46 && // F
        u8[4] === 0x2D // -
    );
}
/** Load pdf-parse in a way that survives CJS/ESM differences. */
var _pdfParse = null;
function getPdfParse() {
    return __awaiter(this, void 0, void 0, function () {
        var mod, fn, _a, mod, fn;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (_pdfParse)
                        return [2 /*return*/, _pdfParse];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("pdf-parse"); })];
                case 2:
                    mod = _b.sent();
                    fn = typeof mod === "function" ? mod : mod === null || mod === void 0 ? void 0 : mod["default"];
                    if (typeof fn === "function") {
                        _pdfParse = fn;
                        return [2 /*return*/, fn];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4:
                    // Then try CJS require
                    try {
                        mod = require("pdf-parse");
                        fn = typeof mod === "function" ? mod : mod === null || mod === void 0 ? void 0 : mod["default"];
                        if (typeof fn === "function") {
                            _pdfParse = fn;
                            return [2 /*return*/, fn];
                        }
                    }
                    catch (_c) { }
                    return [2 /*return*/, null];
            }
        });
    });
}
function extractWithPdfParse(u8) {
    var _a;
    return __awaiter(this, void 0, Promise, function () {
        var pdfParse, out;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getPdfParse()];
                case 1:
                    pdfParse = _b.sent();
                    if (!pdfParse)
                        return [2 /*return*/, ""];
                    return [4 /*yield*/, pdfParse(Buffer.from(u8))];
                case 2:
                    out = _b.sent();
                    return [2 /*return*/, ((_a = out === null || out === void 0 ? void 0 : out.text) !== null && _a !== void 0 ? _a : "").trim()];
            }
        });
    });
}
/** Fallback using pdfjs-dist via root import (no subpath to avoid resolution issues). */
function extractWithPdfjs(u8) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, Promise, function () {
        var pdfjs, getDocument, doc, parts, p, page, content, line, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("pdfjs-dist"); })];
                case 1:
                    pdfjs = _h.sent();
                    getDocument = (_a = pdfjs.getDocument) !== null && _a !== void 0 ? _a : (_b = pdfjs["default"]) === null || _b === void 0 ? void 0 : _b.getDocument;
                    if (typeof getDocument !== "function")
                        throw new Error("pdfjs-dist getDocument not found");
                    return [4 /*yield*/, getDocument({
                            data: u8,
                            isEvalSupported: false,
                            useWorkerFetch: false
                        }).promise];
                case 2:
                    doc = _h.sent();
                    _h.label = 3;
                case 3:
                    _h.trys.push([3, , 9, 16]);
                    parts = [];
                    p = 1;
                    _h.label = 4;
                case 4:
                    if (!(p <= doc.numPages)) return [3 /*break*/, 8];
                    return [4 /*yield*/, doc.getPage(p)];
                case 5:
                    page = _h.sent();
                    return [4 /*yield*/, page.getTextContent()];
                case 6:
                    content = _h.sent();
                    line = content.items
                        .map(function (it) { return (it && typeof it.str === "string" ? it.str : ""); })
                        .filter(Boolean)
                        .join(" ");
                    parts.push(line);
                    (_c = page.cleanup) === null || _c === void 0 ? void 0 : _c.call(page);
                    _h.label = 7;
                case 7:
                    p++;
                    return [3 /*break*/, 4];
                case 8: return [2 /*return*/, parts.join("\n").replace(/\s+/g, " ").trim()];
                case 9:
                    _h.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, ((_d = doc.cleanup) === null || _d === void 0 ? void 0 : _d.call(doc))];
                case 10:
                    _h.sent();
                    return [3 /*break*/, 12];
                case 11:
                    _f = _h.sent();
                    return [3 /*break*/, 12];
                case 12:
                    _h.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, ((_e = doc.destroy) === null || _e === void 0 ? void 0 : _e.call(doc))];
                case 13:
                    _h.sent();
                    return [3 /*break*/, 15];
                case 14:
                    _g = _h.sent();
                    return [3 /*break*/, 15];
                case 15: return [7 /*endfinally*/];
                case 16: return [2 /*return*/];
            }
        });
    });
}
function extractPdfText(ab) {
    return __awaiter(this, void 0, Promise, function () {
        var u8, t, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    u8 = new Uint8Array(ab);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, extractWithPdfParse(u8)];
                case 2:
                    t = _b.sent();
                    if (t)
                        return [2 /*return*/, t];
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4: return [4 /*yield*/, extractWithPdfjs(u8)];
                case 5: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
function extractTextPlain(ab) {
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new TextDecoder("utf-8", { fatal: false }).decode(new Uint8Array(ab)).trim()];
        });
    });
}
/* --------------------------------- POST -------------------------------- */
function POST(req) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var ct, ab, u8, text, _b, fd, file, ab, mime, u8, text, _c, _d, _e, err_1;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 20, , 21]);
                    ct = (req.headers.get("content-type") || "").toLowerCase();
                    if (!ct.startsWith("application/octet-stream")) return [3 /*break*/, 6];
                    return [4 /*yield*/, req.arrayBuffer()];
                case 1:
                    ab = _f.sent();
                    if (!ab || ab.byteLength === 0) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Empty body" }, { status: 400 })];
                    }
                    u8 = new Uint8Array(ab);
                    if (!isPdf(u8)) return [3 /*break*/, 3];
                    return [4 /*yield*/, extractPdfText(ab)];
                case 2:
                    _b = _f.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, extractTextPlain(ab)];
                case 4:
                    _b = _f.sent();
                    _f.label = 5;
                case 5:
                    text = _b;
                    if (!text)
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Could not extract text" }, { status: 422 })];
                    return [2 /*return*/, server_1.NextResponse.json({ text: text }, { status: 200, headers: { "Cache-Control": "no-store" } })];
                case 6:
                    if (!ct.includes("multipart/form-data")) return [3 /*break*/, 19];
                    return [4 /*yield*/, req.formData()];
                case 7:
                    fd = _f.sent();
                    file = fd.get("file");
                    if (!file)
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Missing file" }, { status: 400 })];
                    return [4 /*yield*/, file.arrayBuffer()];
                case 8:
                    ab = _f.sent();
                    mime = (file.type || "").toLowerCase();
                    u8 = new Uint8Array(ab);
                    if (!(mime === "application/pdf" || isPdf(u8))) return [3 /*break*/, 10];
                    return [4 /*yield*/, extractPdfText(ab)];
                case 9:
                    _c = _f.sent();
                    return [3 /*break*/, 18];
                case 10:
                    if (!(mime === "text/plain")) return [3 /*break*/, 12];
                    return [4 /*yield*/, extractTextPlain(ab)];
                case 11:
                    _d = _f.sent();
                    return [3 /*break*/, 17];
                case 12:
                    if (!isPdf(u8)) return [3 /*break*/, 14];
                    return [4 /*yield*/, extractPdfText(ab)];
                case 13:
                    _e = _f.sent();
                    return [3 /*break*/, 16];
                case 14: return [4 /*yield*/, extractTextPlain(ab)];
                case 15:
                    _e = _f.sent();
                    _f.label = 16;
                case 16:
                    _d = _e;
                    _f.label = 17;
                case 17:
                    _c = _d;
                    _f.label = 18;
                case 18:
                    text = _c;
                    if (!text)
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Could not extract text" }, { status: 422 })];
                    return [2 /*return*/, server_1.NextResponse.json({ text: text }, { status: 200, headers: { "Cache-Control": "no-store" } })];
                case 19: return [2 /*return*/, server_1.NextResponse.json({ error: "Unsupported Content-Type" }, { status: 415 })];
                case 20:
                    err_1 = _f.sent();
                    console.error("ATS extract error:", err_1);
                    return [2 /*return*/, server_1.NextResponse.json({ error: (_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.message) !== null && _a !== void 0 ? _a : "Extraction failed" }, { status: 500 })];
                case 21: return [2 /*return*/];
            }
        });
    });
}
exports.POST = POST;
