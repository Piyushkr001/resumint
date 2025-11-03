// app/(auth)/signup/SignupClient.tsx
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
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("zod");
var zod_2 = require("@hookform/resolvers/zod");
var lucide_react_1 = require("lucide-react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var checkbox_1 = require("@/components/ui/checkbox");
var separator_1 = require("@/components/ui/separator");
var GoogleSignIn_1 = require("../_components/GoogleSignIn");
/* -------------------------- Validation Schema -------------------------- */
var passwordRules = zod_1.z
    .string()
    .min(8, "At least 8 characters")
    .refine(function (v) { return /[A-Za-z]/.test(v); }, {
    message: "Include at least one letter"
})
    .refine(function (v) { return /\d/.test(v); }, {
    message: "Include at least one number"
});
var SignupSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(2, "Enter your full name"),
    email: zod_1.z.string().email("Enter a valid email"),
    password: passwordRules,
    confirm: zod_1.z.string(),
    accept: zod_1.z.boolean()
})
    .refine(function (d) { return d.password === d.confirm; }, {
    message: "Passwords do not match",
    path: ["confirm"]
})
    .refine(function (d) { return d.accept === true; }, {
    message: "You must accept the Terms",
    path: ["accept"]
});
/* ------------------------------- Component ------------------------------ */
function SignupClient() {
    var router = navigation_1.useRouter();
    var _a = React.useState(false), showPwd = _a[0], setShowPwd = _a[1];
    var _b = React.useState(false), showConfirm = _b[0], setShowConfirm = _b[1];
    var _c = React.useState(false), loading = _c[0], setLoading = _c[1];
    var form = react_hook_form_1.useForm({
        resolver: zod_2.zodResolver(SignupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirm: "",
            accept: true
        },
        mode: "onTouched"
    });
    var pwd = form.watch("password");
    var strength = (function () {
        var score = (pwd.length >= 8 ? 1 : 0) +
            (/[A-Za-z]/.test(pwd) ? 1 : 0) +
            (/\d/.test(pwd) ? 1 : 0);
        if (score >= 3)
            return { label: "Strong", className: "text-emerald-600" };
        if (score === 2)
            return { label: "Medium", className: "text-amber-600" };
        if (score === 1)
            return { label: "Weak", className: "text-red-600" };
        return { label: "", className: "" };
    })();
    function onSubmit(values) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var err_1, status, msg;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        setLoading(true);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, react_hot_toast_1["default"].promise(axios_1["default"].post("/api/auth/signup", {
                                name: values.name,
                                email: values.email,
                                password: values.password
                            }, { withCredentials: true }), {
                                loading: "Creating your account…",
                                success: "Account created!",
                                error: function (e) { var _a, _b; return ((_b = (_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || "Signup failed, please try again"; }
                            })];
                    case 2:
                        _d.sent();
                        // let Navbar / AuthProvider know auth state changed
                        if (typeof window !== "undefined") {
                            window.dispatchEvent(new Event("auth:changed"));
                        }
                        router.replace("/dashboard");
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _d.sent();
                        status = (_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _a === void 0 ? void 0 : _a.status;
                        msg = (_c = (_b = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.error;
                        if (status === 409 || (msg === null || msg === void 0 ? void 0 : msg.toLowerCase().includes("email"))) {
                            form.setError("email", {
                                message: msg || "This email is already in use"
                            });
                        }
                        else {
                            react_hot_toast_1["default"].error(msg || "Something went wrong");
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
    var isSubmitDisabled = loading || !form.formState.isDirty || !form.formState.isValid;
    /* --------------------------------- UI --------------------------------- */
    return (React.createElement("main", { className: "grid min-h-svh grid-cols-1 bg-background text-foreground lg:grid-cols-2" },
        React.createElement("section", { className: "flex flex-col justify-center px-4 py-8 sm:px-8 lg:px-12" },
            React.createElement("div", { className: "mx-auto w-full max-w-md" },
                React.createElement("div", { className: "mb-6 flex items-center gap-2" },
                    React.createElement("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10" },
                        React.createElement(lucide_react_1.Sparkles, { className: "h-5 w-5 text-primary" })),
                    React.createElement("div", null,
                        React.createElement("p", { className: "text-base font-semibold leading-tight" }, "Resumint"),
                        React.createElement("p", { className: "text-xs text-muted-foreground" }, "ATS-ready resumes in minutes"))),
                React.createElement(card_1.Card, { className: "shadow-sm" },
                    React.createElement(card_1.CardHeader, { className: "space-y-1" },
                        React.createElement(card_1.CardTitle, { className: "text-2xl font-semibold tracking-tight" }, "Create your account"),
                        React.createElement(card_1.CardDescription, null, "Start optimizing your resume for modern ATS systems.")),
                    React.createElement(card_1.CardContent, null,
                        React.createElement("form", { onSubmit: form.handleSubmit(onSubmit), className: "flex flex-col gap-4" },
                            React.createElement("div", { className: "space-y-1" },
                                React.createElement(label_1.Label, { htmlFor: "name" }, "Full name"),
                                React.createElement("div", { className: "flex items-center gap-2 rounded-md border px-3" },
                                    React.createElement(lucide_react_1.User, { className: "h-4 w-4 text-muted-foreground" }),
                                    React.createElement(input_1.Input, __assign({ id: "name", type: "text", placeholder: "Piyush Kumar" }, form.register("name"), { className: "border-0 px-0 shadow-none focus-visible:ring-0" }))),
                                form.formState.errors.name && (React.createElement("p", { className: "mt-1 text-xs text-red-600" }, form.formState.errors.name.message))),
                            React.createElement("div", { className: "space-y-1" },
                                React.createElement(label_1.Label, { htmlFor: "email" }, "Email"),
                                React.createElement("div", { className: "flex items-center gap-2 rounded-md border px-3" },
                                    React.createElement(lucide_react_1.Mail, { className: "h-4 w-4 text-muted-foreground" }),
                                    React.createElement(input_1.Input, __assign({ id: "email", type: "email", autoComplete: "email", placeholder: "you@example.com" }, form.register("email"), { className: "border-0 px-0 shadow-none focus-visible:ring-0" }))),
                                form.formState.errors.email && (React.createElement("p", { className: "mt-1 text-xs text-red-600" }, form.formState.errors.email.message))),
                            React.createElement("div", { className: "space-y-1" },
                                React.createElement(label_1.Label, { htmlFor: "password" }, "Password"),
                                React.createElement("div", { className: "flex items-center gap-2 rounded-md border px-3" },
                                    React.createElement(lucide_react_1.Lock, { className: "h-4 w-4 text-muted-foreground" }),
                                    React.createElement(input_1.Input, __assign({ id: "password", type: showPwd ? "text" : "password", autoComplete: "new-password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }, form.register("password"), { className: "border-0 px-0 shadow-none focus-visible:ring-0" })),
                                    React.createElement("button", { type: "button", onClick: function () { return setShowPwd(function (p) { return !p; }); }, className: "rounded p-1 text-muted-foreground hover:bg-muted" }, showPwd ? (React.createElement(lucide_react_1.EyeOff, { className: "h-4 w-4" })) : (React.createElement(lucide_react_1.Eye, { className: "h-4 w-4" })))),
                                strength.label && (React.createElement("p", { className: "mt-1 text-xs " + strength.className },
                                    "Password strength: ",
                                    strength.label)),
                                form.formState.errors.password && (React.createElement("p", { className: "mt-1 text-xs text-red-600" }, form.formState.errors.password.message))),
                            React.createElement("div", { className: "space-y-1" },
                                React.createElement(label_1.Label, { htmlFor: "confirm" }, "Confirm password"),
                                React.createElement("div", { className: "flex items-center gap-2 rounded-md border px-3" },
                                    React.createElement(lucide_react_1.Lock, { className: "h-4 w-4 text-muted-foreground" }),
                                    React.createElement(input_1.Input, __assign({ id: "confirm", type: showConfirm ? "text" : "password", autoComplete: "new-password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }, form.register("confirm"), { className: "border-0 px-0 shadow-none focus-visible:ring-0" })),
                                    React.createElement("button", { type: "button", onClick: function () { return setShowConfirm(function (p) { return !p; }); }, className: "rounded p-1 text-muted-foreground hover:bg-muted" }, showConfirm ? (React.createElement(lucide_react_1.EyeOff, { className: "h-4 w-4" })) : (React.createElement(lucide_react_1.Eye, { className: "h-4 w-4" })))),
                                form.formState.errors.confirm && (React.createElement("p", { className: "mt-1 text-xs text-red-600" }, form.formState.errors.confirm.message))),
                            React.createElement("div", { className: "space-y-1 rounded-md bg-muted/60 p-3 text-xs" },
                                React.createElement("p", { className: "mb-1 font-medium text-muted-foreground" }, "Password must include:"),
                                React.createElement("ul", { className: "space-y-1" },
                                    React.createElement(RuleItem, { satisfied: pwd.length >= 8 }, "At least 8 characters"),
                                    React.createElement(RuleItem, { satisfied: /[A-Za-z]/.test(pwd) }, "At least one letter"),
                                    React.createElement(RuleItem, { satisfied: /\d/.test(pwd) }, "At least one number"))),
                            React.createElement("div", { className: "flex items-start gap-2" },
                                React.createElement(checkbox_1.Checkbox, { id: "accept", checked: form.watch("accept"), onCheckedChange: function (v) {
                                        return form.setValue("accept", v === true, {
                                            shouldDirty: true,
                                            shouldValidate: true
                                        });
                                    } }),
                                React.createElement("div", { className: "space-y-0.5 text-xs leading-snug" },
                                    React.createElement(label_1.Label, { htmlFor: "accept" },
                                        "I agree to the",
                                        " ",
                                        React.createElement(link_1["default"], { href: "/terms", className: "underline underline-offset-2" }, "Terms"),
                                        " ",
                                        "and",
                                        " ",
                                        React.createElement(link_1["default"], { href: "/privacy", className: "underline underline-offset-2" }, "Privacy Policy"),
                                        "."),
                                    form.formState.errors.accept && (React.createElement("p", { className: "text-xs text-red-600" }, form.formState.errors.accept.message)))),
                            React.createElement(button_1.Button, { type: "submit", className: "mt-1 w-full", disabled: isSubmitDisabled }, loading ? (React.createElement(React.Fragment, null,
                                React.createElement(lucide_react_1.Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                                "Creating account\u2026")) : ("Sign up"))),
                        React.createElement(separator_1.Separator, { className: "my-4" }),
                        React.createElement("div", { className: "flex flex-col gap-3" },
                            React.createElement(GoogleSignIn_1["default"], null))),
                    React.createElement(card_1.CardFooter, { className: "flex items-center justify-center" },
                        React.createElement("p", { className: "text-sm text-muted-foreground" },
                            "Already have an account?",
                            " ",
                            React.createElement(link_1["default"], { href: "/login", className: "font-medium text-primary underline-offset-4 hover:underline" }, "Log in")))))),
        React.createElement("section", { className: "relative hidden items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 lg:flex" },
            React.createElement("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.25),transparent_55%),radial-gradient(circle_at_bottom,rgba(56,189,248,0.22),transparent_55%)]" }),
            React.createElement("div", { className: "relative z-10 mx-auto flex max-w-md flex-col gap-6 px-8 text-slate-50" },
                React.createElement("div", { className: "inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-slate-700/70 backdrop-blur" },
                    React.createElement(lucide_react_1.Sparkles, { className: "h-3.5 w-3.5 text-amber-400" }),
                    React.createElement("span", null, "ATS-optimized templates \u2022 One-click export")),
                React.createElement("h2", { className: "text-3xl font-semibold leading-tight md:text-4xl" },
                    "Stand out to recruiters.",
                    React.createElement("br", null),
                    React.createElement("span", { className: "text-sky-300" }, "Beat the bots.")),
                React.createElement("p", { className: "text-sm text-slate-200/80" }, "Resumint analyzes your resume against real job descriptions, surfaces missing keywords, and helps you tailor each application in minutes."),
                React.createElement("ul", { className: "space-y-2 text-sm text-slate-100" },
                    React.createElement("li", { className: "flex items-center gap-2" },
                        React.createElement(lucide_react_1.Check, { className: "h-4 w-4 text-emerald-400" }),
                        "Real-time ATS match scoring"),
                    React.createElement("li", { className: "flex items-center gap-2" },
                        React.createElement(lucide_react_1.Check, { className: "h-4 w-4 text-emerald-400" }),
                        "Beautiful, recruiter-friendly templates"),
                    React.createElement("li", { className: "flex items-center gap-2" },
                        React.createElement(lucide_react_1.Check, { className: "h-4 w-4 text-emerald-400" }),
                        "Export to PDF with one click")),
                React.createElement("div", { className: "mt-4 flex items-center gap-3 text-xs text-slate-300/80" },
                    React.createElement("div", { className: "flex -space-x-2" },
                        React.createElement("div", { className: "h-7 w-7 rounded-full border border-slate-700 bg-slate-600/70" }),
                        React.createElement("div", { className: "h-7 w-7 rounded-full border border-slate-700 bg-slate-500/70" }),
                        React.createElement("div", { className: "h-7 w-7 rounded-full border border-slate-700 bg-slate-400/70" })),
                    React.createElement("span", null, "Join candidates who already upgraded their resume."))))));
}
exports["default"] = SignupClient;
/* ---------------------------- Small subcomponent ---------------------------- */
function RuleItem(_a) {
    var satisfied = _a.satisfied, children = _a.children;
    return (React.createElement("li", { className: "flex items-center gap-2" },
        React.createElement("span", { className: "flex h-4 w-4 items-center justify-center rounded-full border text-[10px] " + (satisfied
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                : "border-slate-400/60 bg-transparent text-slate-400") }, satisfied ? React.createElement(lucide_react_1.Check, { className: "h-3 w-3" }) : React.createElement(lucide_react_1.X, { className: "h-3 w-3" })),
        React.createElement("span", { className: satisfied ? "text-emerald-700 text-xs" : "text-xs" }, children)));
}
