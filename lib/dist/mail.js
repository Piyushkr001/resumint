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
var _a;
exports.__esModule = true;
exports.sendPasswordResetEmail = exports.sendMail = void 0;
// lib/mail.ts
var nodemailer_1 = require("nodemailer");
var port = Number((_a = process.env.SMTP_PORT) !== null && _a !== void 0 ? _a : 587);
var secure = process.env.SMTP_SECURE === "true" || port === 465; // auto-true for 465
var transporter = nodemailer_1["default"].createTransport({
    host: process.env.SMTP_HOST,
    port: port,
    secure: secure,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
// Default "from" address for all emails
var DEFAULT_FROM = process.env.SMTP_FROM || '"Resumint" <no-reply@yourdomain.com>';
/**
 * Generic mail helper for any route
 */
function sendMail(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var to, subject, text, html, from;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    to = opts.to, subject = opts.subject, text = opts.text, html = opts.html, from = opts.from;
                    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
                        console.warn("[mail] SMTP_* env vars are not fully set. Email will not be sent.");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, transporter.sendMail({
                            from: from || DEFAULT_FROM,
                            to: to,
                            subject: subject,
                            // nodemailer is fine with both; if html is provided, most clients use it
                            text: text || "",
                            html: html || text || ""
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendMail = sendMail;
/**
 * Specific helper for password reset OTP
 */
function sendPasswordResetEmail(to, otp) {
    return __awaiter(this, void 0, void 0, function () {
        var subject, text, html;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    subject = "Your Resumint password reset code";
                    text = "Your password reset code is " + otp + ". It expires in 15 minutes.";
                    html = "<p>Your password reset code is <b>" + otp + "</b>. It expires in 15 minutes.</p>";
                    return [4 /*yield*/, sendMail({ to: to, subject: subject, text: text, html: html })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendPasswordResetEmail = sendPasswordResetEmail;
