// app/(auth)/login/LoginClient.tsx
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
var swr_1 = require("swr");
var zod_1 = require("zod");
var zod_2 = require("@hookform/resolvers/zod");
var react_hook_form_1 = require("react-hook-form");
var lucide_react_1 = require("lucide-react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var checkbox_1 = require("@/components/ui/checkbox");
var separator_1 = require("@/components/ui/separator");
var GoogleSignIn_1 = require("../_components/GoogleSignIn");
/* --------------------------- Validation Schema --------------------------- */
var LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Enter a valid email"),
    password: zod_1.z.string().min(8, "At least 8 characters"),
    remember: zod_1.z.boolean().optional()
});
/* ------------------------------- Fetch /me ------------------------------- */
var fetchMe = function () { return __awaiter(void 0, void 0, void 0, function () {
    var r, _a;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1["default"].get("/api/auth/me", { withCredentials: true })];
            case 1:
                r = _d.sent();
                return [2 /*return*/, (_c = (_b = r.data) === null || _b === void 0 ? void 0 : _b.user) !== null && _c !== void 0 ? _c : null];
            case 2:
                _a = _d.sent();
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
/* -------------------------------- Component ------------------------------ */
function LoginClient() {
    var router = navigation_1.useRouter();
    var me = swr_1["default"]("me", fetchMe, { shouldRetryOnError: false }).data;
    var _a = React.useState(false), showPwd = _a[0], setShowPwd = _a[1];
    var _b = React.useState(false), loading = _b[0], setLoading = _b[1];
    var form = react_hook_form_1.useForm({
        resolver: zod_2.zodResolver(LoginSchema),
        defaultValues: { email: "", password: "", remember: true },
        mode: "onTouched"
    });
    // If already logged in, redirect
    React.useEffect(function () {
        if (me) {
            react_hot_toast_1["default"].success("Already logged in");
            router.replace("/dashboard");
        }
    }, [me, router]);
    // Restore remembered email
    React.useEffect(function () {
        var remembered = typeof window !== "undefined"
            ? localStorage.getItem("resumint:rememberEmail")
            : null;
        if (remembered)
            form.setValue("email", remembered);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    /* ------------------------------ Submit logic ----------------------------- */
    // 🔥 This is unchanged – same API call & behavior as your original code
    function onSubmit(values) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        setLoading(true);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, 4, 5]);
                        if (values.remember) {
                            localStorage.setItem("resumint:rememberEmail", values.email);
                        }
                        else {
                            localStorage.removeItem("resumint:rememberEmail");
                        }
                        return [4 /*yield*/, react_hot_toast_1["default"].promise(axios_1["default"].post("/api/auth/login", { email: values.email, password: values.password }, { withCredentials: true }), {
                                loading: "Signing you in…",
                                success: "Welcome back!",
                                error: function (e) { var _a, _b; return ((_b = (_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || "Login failed"; }
                            })];
                    case 2:
                        _c.sent();
                        // 🔔 tell Navbar to re-fetch immediately
                        if (typeof window !== "undefined") {
                            window.dispatchEvent(new Event("auth:changed"));
                        }
                        router.replace("/dashboard");
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _c.sent();
                        form.setError("password", {
                            message: ((_b = (_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || "Invalid credentials"
                        });
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
                    React.createElement(card_1.CardHeader, null,
                        React.createElement(card_1.CardTitle, { className: "text-2xl font-semibold tracking-tight" }, "Welcome back"),
                        React.createElement(card_1.CardDescription, null, "Sign in to continue optimizing your ATS-ready resumes.")),
                    React.createElement(card_1.CardContent, { className: "space-y-4" },
                        React.createElement("form", { onSubmit: form.handleSubmit(onSubmit), noValidate: true, "aria-busy": loading, className: "space-y-4" },
                            React.createElement("div", { className: "space-y-1" },
                                React.createElement(label_1.Label, { htmlFor: "email" }, "Email"),
                                React.createElement("div", { className: "flex items-center gap-2 rounded-md border px-3" },
                                    React.createElement(lucide_react_1.Mail, { className: "h-4 w-4 text-muted-foreground" }),
                                    React.createElement(input_1.Input, __assign({ id: "email", type: "email", inputMode: "email", autoCapitalize: "none", placeholder: "you@example.com", autoComplete: "email" }, form.register("email"), { className: "border-0 px-0 shadow-none focus-visible:ring-0", "aria-invalid": !!form.formState.errors.email, "aria-describedby": "email-error", disabled: loading }))),
                                form.formState.errors.email && (React.createElement("p", { id: "email-error", className: "mt-1 text-xs text-destructive" }, form.formState.errors.email.message))),
                            React.createElement("div", { className: "space-y-1" },
                                React.createElement(label_1.Label, { htmlFor: "password" }, "Password"),
                                React.createElement("div", { className: "flex items-center gap-2 rounded-md border px-3" },
                                    React.createElement(lucide_react_1.Lock, { className: "h-4 w-4 text-muted-foreground" }),
                                    React.createElement(input_1.Input, __assign({ id: "password", type: showPwd ? "text" : "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", autoComplete: "current-password" }, form.register("password"), { className: "border-0 px-0 shadow-none focus-visible:ring-0", "aria-invalid": !!form.formState.errors.password, "aria-describedby": "password-error", disabled: loading })),
                                    React.createElement("button", { type: "button", onClick: function () { return setShowPwd(function (s) { return !s; }); }, className: "rounded p-1 text-muted-foreground hover:bg-muted", "aria-label": showPwd ? "Hide password" : "Show password", disabled: loading }, showPwd ? (React.createElement(lucide_react_1.EyeOff, { className: "h-4 w-4" })) : (React.createElement(lucide_react_1.Eye, { className: "h-4 w-4" })))),
                                form.formState.errors.password && (React.createElement("p", { id: "password-error", className: "mt-1 text-xs text-destructive" }, form.formState.errors.password.message))),
                            React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-2 text-sm" },
                                React.createElement("label", { htmlFor: "remember", className: "flex items-center gap-2 text-xs sm:text-sm" },
                                    React.createElement(checkbox_1.Checkbox, { id: "remember", checked: form.watch("remember"), onCheckedChange: function (v) {
                                            return form.setValue("remember", Boolean(v), {
                                                shouldDirty: true
                                            });
                                        }, disabled: loading }),
                                    React.createElement("span", { className: "text-muted-foreground" }, "Remember me")),
                                React.createElement(link_1["default"], { href: "/forgot", className: "text-xs font-medium text-primary underline-offset-4 hover:underline sm:text-sm" }, "Forgot password?")),
                            React.createElement(button_1.Button, { className: "mt-1 w-full", type: "submit", disabled: isSubmitDisabled }, loading ? (React.createElement(React.Fragment, null,
                                React.createElement(lucide_react_1.Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
                                "Signing you in\u2026")) : (React.createElement(React.Fragment, null,
                                React.createElement(lucide_react_1.ArrowRight, { className: "mr-2 h-4 w-4" }),
                                "Sign in")))),
                        React.createElement("div", { className: "relative py-3" },
                            React.createElement(separator_1.Separator, null),
                            React.createElement("span", { className: "absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground" }, "or continue with")),
                        React.createElement(GoogleSignIn_1["default"], null)),
                    React.createElement(card_1.CardFooter, { className: "flex items-center justify-center text-sm text-muted-foreground" },
                        React.createElement("span", null,
                            "Don't have an account?",
                            " ",
                            React.createElement(link_1["default"], { href: "/signup", className: "font-medium text-primary underline-offset-4 hover:underline" }, "Sign up")))))),
        React.createElement("section", { className: "relative hidden items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 lg:flex" },
            React.createElement("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.25),transparent_55%),radial-gradient(circle_at_bottom,rgba(56,189,248,0.22),transparent_55%)]" }),
            React.createElement("div", { className: "relative z-10 mx-auto flex max-w-md flex-col gap-6 px-8 text-slate-50" },
                React.createElement("div", { className: "inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-slate-700/70 backdrop-blur" },
                    React.createElement(lucide_react_1.Sparkles, { className: "h-3.5 w-3.5 text-amber-400" }),
                    React.createElement("span", null, "Secure login \u2022 Session-based auth")),
                React.createElement("h2", { className: "text-3xl font-semibold leading-tight md:text-4xl" },
                    "Pick up where you left off.",
                    React.createElement("br", null),
                    React.createElement("span", { className: "text-sky-300" }, "Your resumes, always in sync.")),
                React.createElement("p", { className: "text-sm text-slate-200/80" }, "Log in to access your ATS scores, tailored suggestions, and saved templates. Keep iterating on your resume without losing your work."),
                React.createElement("ul", { className: "space-y-2 text-sm text-slate-100" },
                    React.createElement("li", { className: "flex items-center gap-2" },
                        React.createElement(lucide_react_1.Check, { className: "h-4 w-4 text-emerald-400" }),
                        "Resume drafts synced to your account"),
                    React.createElement("li", { className: "flex items-center gap-2" },
                        React.createElement(lucide_react_1.Check, { className: "h-4 w-4 text-emerald-400" }),
                        "Instant access to ATS analysis history"),
                    React.createElement("li", { className: "flex items-center gap-2" },
                        React.createElement(lucide_react_1.Check, { className: "h-4 w-4 text-emerald-400" }),
                        "Continue applications across devices")),
                React.createElement("div", { className: "mt-4 flex items-center gap-3 text-xs text-slate-300/80" },
                    React.createElement("div", { className: "flex -space-x-2" },
                        React.createElement("div", { className: "h-7 w-7 rounded-full border border-slate-700 bg-slate-600/70" }),
                        React.createElement("div", { className: "h-7 w-7 rounded-full border border-slate-700 bg-slate-500/70" }),
                        React.createElement("div", { className: "h-7 w-7 rounded-full border border-slate-700 bg-slate-400/70" })),
                    React.createElement("span", null, "Join candidates improving their resumes every week."))))));
}
exports["default"] = LoginClient;
