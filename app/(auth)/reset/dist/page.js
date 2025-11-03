"use client";
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
exports.__esModule = true;
var React = require("react");
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var axios_1 = require("axios");
var react_hot_toast_1 = require("react-hot-toast");
var zod_1 = require("zod");
var zod_2 = require("@hookform/resolvers/zod");
var react_hook_form_1 = require("react-hook-form");
var lucide_react_1 = require("lucide-react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var passwordRules = zod_1.z
    .string()
    .min(8, "At least 8 characters")
    .refine(function (v) { return /[A-Za-z]/.test(v); }, {
    message: "Include at least one letter"
})
    .refine(function (v) { return /\d/.test(v); }, { message: "Include at least one number" });
var ResetSchema = zod_1.z
    .object({
    email: zod_1.z.string().email("Enter a valid email"),
    code: zod_1.z
        .string()
        .min(4, "Enter the verification code")
        .max(10, "Too long"),
    newPassword: passwordRules,
    confirmPassword: zod_1.z.string().min(8, "Confirm your password")
})
    .refine(function (d) { return d.newPassword === d.confirmPassword; }, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});
function ResetPasswordPage() {
    var _a;
    var router = navigation_1.useRouter();
    var searchParams = navigation_1.useSearchParams();
    var emailFromQuery = (_a = searchParams.get("email")) !== null && _a !== void 0 ? _a : "";
    var _b = React.useState(false), loading = _b[0], setLoading = _b[1];
    var _c = React.useState(false), resending = _c[0], setResending = _c[1];
    var form = react_hook_form_1.useForm({
        resolver: zod_2.zodResolver(ResetSchema),
        defaultValues: {
            email: emailFromQuery,
            code: "",
            newPassword: "",
            confirmPassword: ""
        },
        mode: "onTouched"
    });
    function onSubmit(values) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var err_1, msg;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        setLoading(true);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, react_hot_toast_1["default"].promise(axios_1["default"].post("/api/auth/reset-password", // <-- your API to verify OTP + reset password
                            {
                                email: values.email,
                                otp: values.code,
                                newPassword: values.newPassword
                            }, { withCredentials: true }), {
                                loading: "Resetting your password…",
                                success: "Password updated! You can now log in.",
                                error: function (e) { var _a, _b; return ((_b = (_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || "Could not reset password"; }
                            })];
                    case 2:
                        _c.sent();
                        router.replace("/login");
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _c.sent();
                        msg = ((_b = (_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || "Invalid code or email";
                        if (msg.toLowerCase().includes("code")) {
                            form.setError("code", { message: msg });
                        }
                        else if (msg.toLowerCase().includes("email")) {
                            form.setError("email", { message: msg });
                        }
                        else {
                            react_hot_toast_1["default"].error(msg);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function handleResend() {
        return __awaiter(this, void 0, void 0, function () {
            var email;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = form.getValues("email");
                        if (!email) {
                            form.setError("email", { message: "Enter your email first" });
                            return [2 /*return*/];
                        }
                        setResending(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 3, 4]);
                        return [4 /*yield*/, react_hot_toast_1["default"].promise(axios_1["default"].post("/api/auth/forgot", // reuse same endpoint
                            { email: email }, { withCredentials: true }), {
                                loading: "Resending code…",
                                success: "New code sent to your email",
                                error: function (e) { var _a, _b; return ((_b = (_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || "Could not resend code"; }
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        setResending(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    var isSubmitDisabled = loading || !form.formState.isDirty || !form.formState.isValid;
    return (React.createElement("main", { className: "grid min-h-svh grid-cols-1 bg-background text-foreground lg:grid-cols-2" },
        React.createElement("section", { className: "flex flex-col justify-center px-4 py-8 sm:px-8 lg:px-12" },
            React.createElement("div", { className: "mx-auto w-full max-w-md" },
                React.createElement("div", { className: "mb-6 flex items-center justify-between gap-3" },
                    React.createElement("div", { className: "flex items-center gap-2" },
                        React.createElement("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10" },
                            React.createElement(lucide_react_1.Sparkles, { className: "h-5 w-5 text-primary" })),
                        React.createElement("div", null,
                            React.createElement("p", { className: "text-base font-semibold leading-tight" }, "Resumint"),
                            React.createElement("p", { className: "text-xs text-muted-foreground" }, "ATS-ready resumes in minutes"))),
                    React.createElement(button_1.Button, { variant: "ghost", size: "sm", className: "gap-1 text-xs sm:text-sm", type: "button", onClick: function () { return router.push("/login"); } },
                        React.createElement(lucide_react_1.ArrowLeft, { className: "h-3.5 w-3.5" }),
                        "Back to login")),
                React.createElement(card_1.Card, { className: "shadow-sm" },
                    React.createElement(card_1.CardHeader, null,
                        React.createElement(card_1.CardTitle, { className: "text-2xl font-semibold tracking-tight" }, "Reset password"),
                        React.createElement(card_1.CardDescription, null, "Enter the code we sent to your email and choose a new password.")),
                    React.createElement(card_1.CardContent, { className: "space-y-4" },
                        React.createElement("form", { onSubmit: form.handleSubmit(onSubmit), noValidate: true, "aria-busy": loading, className: "space-y-4" },
                            React.createElement("div", { className: "space-y-1" },
                                React.createElement(label_1.Label, { htmlFor: "email" }, "Email"),
                                React.createElement("div", { className: "flex items-center gap-2 rounded-md border px-3" },
                                    React.createElement(lucide_react_1.Mail, { className: "h-4 w-4 text-muted-foreground" }),
                                    React.createElement(input_1.Input, __assign({ id: "email", type: "email", placeholder: "you@example.com", autoComplete: "email" }, form.register("email"), { className: "border-0 px-0 shadow-none focus-visible:ring-0", "aria-invalid": !!form.formState.errors.email, "aria-describedby": "email-error", disabled: loading }))),
                                form.formState.errors.email && (React.createElement("p", { id: "email-error", className: "mt-1 text-xs text-destructive" }, form.formState.errors.email.message))),
                            React.createElement("div", { className: "space-y-1" },
                                React.createElement("div", { className: "flex items-center justify-between" },
                                    React.createElement(label_1.Label, { htmlFor: "code" }, "Verification code"),
                                    React.createElement("button", { type: "button", onClick: handleResend, disabled: resending || loading, className: "text-xs font-medium text-primary underline-offset-4 hover:underline" }, resending ? "Resending…" : "Resend code")),
                                React.createElement("div", { className: "flex items-center gap-2 rounded-md border px-3" },
                                    React.createElement(lucide_react_1.KeyRound, { className: "h-4 w-4 text-muted-foreground" }),
                                    React.createElement(input_1.Input, __assign({ id: "code", type: "text", inputMode: "numeric", maxLength: 10, placeholder: "6-digit code" }, form.register("code"), { className: "border-0 px-0 shadow-none focus-visible:ring-0 tracking-[0.2em]", "aria-invalid": !!form.formState.errors.code, "aria-describedby": "code-error", disabled: loading }))),
                                form.formState.errors.code && (React.createElement("p", { id: "code-error", className: "mt-1 text-xs text-destructive" }, form.formState.errors.code.message))),
                            React.createElement("div", { className: "space-y-3" },
                                React.createElement("div", { className: "grid gap-4 md:grid-cols-2" },
                                    React.createElement("div", { className: "space-y-1" },
                                        React.createElement(label_1.Label, { htmlFor: "newPassword" }, "New password"),
                                        React.createElement("div", { className: "flex items-center gap-2 rounded-md border px-3" },
                                            React.createElement(lucide_react_1.Lock, { className: "h-4 w-4 text-muted-foreground" }),
                                            React.createElement(input_1.Input, __assign({ id: "newPassword", type: "password", autoComplete: "new-password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }, form.register("newPassword"), { className: "border-0 px-0 shadow-none focus-visible:ring-0", "aria-invalid": !!form.formState.errors.newPassword, "aria-describedby": "newPassword-error", disabled: loading }))),
                                        form.formState.errors.newPassword && (React.createElement("p", { id: "newPassword-error", className: "mt-1 text-xs text-destructive" }, form.formState.errors.newPassword.message))),
                                    React.createElement("div", { className: "space-y-1" },
                                        React.createElement(label_1.Label, { htmlFor: "confirmPassword" }, "Confirm password"),
                                        React.createElement("div", { className: "flex items-center gap-2 rounded-md border px-3" },
                                            React.createElement(lucide_react_1.Lock, { className: "h-4 w-4 text-muted-foreground" }),
                                            React.createElement(input_1.Input, __assign({ id: "confirmPassword", type: "password", autoComplete: "new-password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }, form.register("confirmPassword"), { className: "border-0 px-0 shadow-none focus-visible:ring-0", "aria-invalid": !!form.formState.errors.confirmPassword, "aria-describedby": "confirmPassword-error", disabled: loading }))),
                                        form.formState.errors.confirmPassword && (React.createElement("p", { id: "confirmPassword-error", className: "mt-1 text-xs text-destructive" }, form.formState.errors.confirmPassword
                                            .message)))),
                                React.createElement("p", { className: "text-xs text-muted-foreground" }, "Use at least 8 characters including a letter and a number. Avoid reusing old passwords.")),
                            React.createElement(button_1.Button, { className: "w-full", type: "submit", disabled: isSubmitDisabled }, loading ? (React.createElement(React.Fragment, null,
                                React.createElement(lucide_react_1.Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                                "Updating password\u2026")) : (React.createElement(React.Fragment, null,
                                React.createElement(lucide_react_1.ArrowRight, { className: "mr-2 h-4 w-4" }),
                                "Reset password"))))),
                    React.createElement(card_1.CardFooter, { className: "flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground" },
                        React.createElement("span", null,
                            "Didn't receive an email? Check spam or",
                            " ",
                            React.createElement("button", { type: "button", onClick: handleResend, disabled: resending || loading, className: "font-medium text-primary underline-offset-4 hover:underline disabled:opacity-60" }, "resend code"),
                            "."),
                        React.createElement(link_1["default"], { href: "/login", className: "font-medium text-primary underline-offset-4 hover:underline" }, "Back to login"))))),
        React.createElement("section", { className: "relative hidden items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 lg:flex" },
            React.createElement("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.25),transparent_55%),radial-gradient(circle_at_bottom,rgba(56,189,248,0.22),transparent_55%)]" }),
            React.createElement("div", { className: "relative z-10 mx-auto flex max-w-md flex-col gap-6 px-8 text-slate-50" },
                React.createElement("div", { className: "inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-slate-700/70 backdrop-blur" },
                    React.createElement(lucide_react_1.KeyRound, { className: "h-3.5 w-3.5 text-emerald-400" }),
                    React.createElement("span", null, "Reset your password securely")),
                React.createElement("h2", { className: "text-3xl font-semibold leading-tight md:text-4xl" },
                    "A fresh start",
                    React.createElement("br", null),
                    React.createElement("span", { className: "text-sky-300" }, "without losing your progress.")),
                React.createElement("p", { className: "text-sm text-slate-200/80" }, "Once your password is updated, you can immediately access your resumes, ATS scores, and analytics \u2014 no data loss, just a more secure account."),
                React.createElement("ul", { className: "space-y-2 text-sm text-slate-100" },
                    React.createElement("li", { className: "flex items-center gap-2" },
                        React.createElement(lucide_react_1.Check, { className: "h-4 w-4 text-emerald-400" }),
                        "OTP-based verification for extra safety"),
                    React.createElement("li", { className: "flex items-center gap-2" },
                        React.createElement(lucide_react_1.Check, { className: "h-4 w-4 text-emerald-400" }),
                        "Works with existing email login"),
                    React.createElement("li", { className: "flex items-center gap-2" },
                        React.createElement(lucide_react_1.Check, { className: "h-4 w-4 text-emerald-400" }),
                        "No changes to your resume content"))))));
}
exports["default"] = ResetPasswordPage;
