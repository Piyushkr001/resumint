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
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("zod");
var zod_2 = require("@hookform/resolvers/zod");
var react_hot_toast_1 = require("react-hot-toast");
var link_1 = require("next/link");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var textarea_1 = require("@/components/ui/textarea");
var label_1 = require("@/components/ui/label");
var badge_1 = require("@/components/ui/badge");
var separator_1 = require("@/components/ui/separator");
var select_1 = require("@/components/ui/select");
var lucide_react_1 = require("lucide-react");
/* ------------------------ Validation schema ------------------------ */
var ContactSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Please enter your name"),
    email: zod_1.z.string().email("Enter a valid email"),
    //@ts-ignore
    topic: zod_1.z["enum"](["general", "support", "bug", "billing", "feedback"], {
        required_error: "Select a topic"
    }),
    subject: zod_1.z.string().min(3, "Subject is too short").max(255),
    message: zod_1.z.string().min(10, "Message is too short").max(4000)
});
/* --------------------------- API helper ---------------------------- */
function postContact(body) {
    return __awaiter(this, void 0, void 0, function () {
        var res, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("/api/contact", {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body),
                        cache: "no-store"
                    })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()["catch"](function () { return ({}); })];
                case 2:
                    data = _a.sent();
                    if (!res.ok) {
                        throw new Error((data === null || data === void 0 ? void 0 : data.error) || "HTTP " + res.status);
                    }
                    return [2 /*return*/, data];
            }
        });
    });
}
/* ------------------------------ Page ------------------------------- */
function ContactPage() {
    var _a = React.useState(false), loading = _a[0], setLoading = _a[1];
    var form = react_hook_form_1.useForm({
        resolver: zod_2.zodResolver(ContactSchema),
        defaultValues: {
            name: "",
            email: "",
            topic: "general",
            subject: "",
            message: ""
        },
        mode: "onTouched"
    });
    function onSubmit(values) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setLoading(true);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, postContact(values)];
                    case 2:
                        _b.sent();
                        react_hot_toast_1.toast.success("Thanks! We’ve received your message.");
                        form.reset(__assign(__assign({}, values), { subject: "", message: "" }));
                        return [3 /*break*/, 5];
                    case 3:
                        e_1 = _b.sent();
                        react_hot_toast_1.toast.error((_a = e_1 === null || e_1 === void 0 ? void 0 : e_1.message) !== null && _a !== void 0 ? _a : "Failed to send message");
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    var isDisabled = loading || !form.formState.isDirty || !form.formState.isValid;
    return (React.createElement("main", { className: "mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8" },
        React.createElement("section", { className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between" },
            React.createElement("div", { className: "space-y-2" },
                React.createElement(badge_1.Badge, { variant: "outline", className: "w-fit gap-2" },
                    React.createElement(lucide_react_1.MessageCircle, { className: "h-3.5 w-3.5 text-primary" }),
                    "Contact"),
                React.createElement("h1", { className: "text-3xl font-semibold tracking-tight sm:text-4xl" },
                    "Get in touch with ",
                    React.createElement("span", { className: "text-primary" }, "Resumint")),
                React.createElement("p", { className: "max-w-xl text-sm text-muted-foreground sm:text-base" }, "Have a question, found a bug, or need help tuning your resume? Drop us a message and we\u2019ll get back to you as soon as we can.")),
            React.createElement("div", { className: "flex flex-col items-start gap-2 text-sm text-muted-foreground md:items-end" },
                React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement(lucide_react_1.Clock, { className: "h-4 w-4 text-emerald-500" }),
                    React.createElement("span", null, "Typical response time: under 24 hours")),
                React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement(lucide_react_1.Mail, { className: "h-4 w-4 text-sky-500" }),
                    React.createElement("span", null, "support@resumint.app")))),
        React.createElement("section", { className: "flex flex-col gap-6 lg:flex-row" },
            React.createElement("div", { className: "flex-1 min-w-0" },
                React.createElement(card_1.Card, { className: "h-full" },
                    React.createElement(card_1.CardHeader, null,
                        React.createElement(card_1.CardTitle, null, "Send us a message"),
                        React.createElement(card_1.CardDescription, null, "Fill out the form and we\u2019ll follow up in your inbox.")),
                    React.createElement(card_1.CardContent, null,
                        React.createElement("form", { onSubmit: form.handleSubmit(onSubmit), className: "flex flex-col gap-5", noValidate: true, "aria-busy": loading },
                            React.createElement("div", { className: "grid gap-4 md:grid-cols-2" },
                                React.createElement("div", { className: "space-y-1.5" },
                                    React.createElement(label_1.Label, { htmlFor: "name" }, "Name"),
                                    React.createElement(input_1.Input, __assign({ id: "name", placeholder: "Your name" }, form.register("name"), { disabled: loading, "aria-invalid": !!form.formState.errors.name })),
                                    form.formState.errors.name && (React.createElement("p", { className: "text-xs text-destructive" }, form.formState.errors.name.message))),
                                React.createElement("div", { className: "space-y-1.5" },
                                    React.createElement(label_1.Label, { htmlFor: "email" }, "Email"),
                                    React.createElement(input_1.Input, __assign({ id: "email", type: "email", autoComplete: "email", placeholder: "you@example.com" }, form.register("email"), { disabled: loading, "aria-invalid": !!form.formState.errors.email })),
                                    form.formState.errors.email && (React.createElement("p", { className: "text-xs text-destructive" }, form.formState.errors.email.message)))),
                            React.createElement("div", { className: "grid gap-4 md:grid-cols-2" },
                                React.createElement("div", { className: "space-y-1.5" },
                                    React.createElement(label_1.Label, null, "Topic"),
                                    React.createElement(select_1.Select, { value: form.watch("topic"), onValueChange: function (v) {
                                            return form.setValue("topic", v, {
                                                shouldDirty: true,
                                                shouldValidate: true
                                            });
                                        }, disabled: loading },
                                        React.createElement(select_1.SelectTrigger, null,
                                            React.createElement(select_1.SelectValue, { placeholder: "Choose a topic" })),
                                        React.createElement(select_1.SelectContent, null,
                                            React.createElement(select_1.SelectItem, { value: "general" }, "General question"),
                                            React.createElement(select_1.SelectItem, { value: "support" }, "Account / support"),
                                            React.createElement(select_1.SelectItem, { value: "bug" }, "Bug report"),
                                            React.createElement(select_1.SelectItem, { value: "billing" }, "Billing"),
                                            React.createElement(select_1.SelectItem, { value: "feedback" }, "Feedback / idea"))),
                                    form.formState.errors.topic && (React.createElement("p", { className: "text-xs text-destructive" }, form.formState.errors.topic.message))),
                                React.createElement("div", { className: "space-y-1.5" },
                                    React.createElement(label_1.Label, { htmlFor: "subject" }, "Subject"),
                                    React.createElement(input_1.Input, __assign({ id: "subject", placeholder: "Short summary" }, form.register("subject"), { disabled: loading, "aria-invalid": !!form.formState.errors.subject })),
                                    form.formState.errors.subject && (React.createElement("p", { className: "text-xs text-destructive" }, form.formState.errors.subject.message)))),
                            React.createElement("div", { className: "space-y-1.5" },
                                React.createElement(label_1.Label, { htmlFor: "message" }, "Message"),
                                React.createElement(textarea_1.Textarea, __assign({ id: "message", rows: 5, placeholder: "Share as much detail as you can so we can help faster." }, form.register("message"), { disabled: loading, "aria-invalid": !!form.formState.errors.message })),
                                form.formState.errors.message && (React.createElement("p", { className: "text-xs text-destructive" }, form.formState.errors.message.message))),
                            React.createElement("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" },
                                React.createElement("p", { className: "text-xs text-muted-foreground" }, "By submitting, you agree we can contact you about this request."),
                                React.createElement(button_1.Button, { type: "submit", disabled: isDisabled, className: "min-w-[140px]" }, loading ? (React.createElement(React.Fragment, null,
                                    React.createElement(lucide_react_1.Send, { className: "mr-2 h-4 w-4 animate-pulse" }),
                                    "Sending\u2026")) : (React.createElement(React.Fragment, null,
                                    React.createElement(lucide_react_1.Send, { className: "mr-2 h-4 w-4" }),
                                    "Send message")))))))),
            React.createElement("aside", { className: "w-full shrink-0 space-y-4 lg:w-80" },
                React.createElement(card_1.Card, null,
                    React.createElement(card_1.CardHeader, null,
                        React.createElement(card_1.CardTitle, null, "Other ways to reach us"),
                        React.createElement(card_1.CardDescription, null, "Prefer not to use the form? No problem.")),
                    React.createElement(card_1.CardContent, { className: "space-y-3 text-sm" },
                        React.createElement("div", { className: "flex items-start gap-3" },
                            React.createElement(lucide_react_1.Mail, { className: "mt-0.5 h-4 w-4 text-sky-500" }),
                            React.createElement("div", null,
                                React.createElement("p", { className: "font-medium" }, "Email"),
                                React.createElement("p", { className: "text-xs text-muted-foreground" }, "support@resumint.app"))),
                        React.createElement("div", { className: "flex items-start gap-3" },
                            React.createElement(lucide_react_1.MessageCircle, { className: "mt-0.5 h-4 w-4 text-primary" }),
                            React.createElement("div", null,
                                React.createElement("p", { className: "font-medium" }, "Live support"),
                                React.createElement("p", { className: "text-xs text-muted-foreground" }, "Coming soon: in-app chat for quick questions."))),
                        React.createElement("div", { className: "flex items-start gap-3" },
                            React.createElement(lucide_react_1.Clock, { className: "mt-0.5 h-4 w-4 text-emerald-500" }),
                            React.createElement("div", null,
                                React.createElement("p", { className: "font-medium" }, "Hours"),
                                React.createElement("p", { className: "text-xs text-muted-foreground" }, "Monday\u2013Friday, 10:00\u201318:00 (IST)"))),
                        React.createElement("div", { className: "flex items-start gap-3" },
                            React.createElement(lucide_react_1.MapPin, { className: "mt-0.5 h-4 w-4 text-amber-500" }),
                            React.createElement("div", null,
                                React.createElement("p", { className: "font-medium" }, "Location"),
                                React.createElement("p", { className: "text-xs text-muted-foreground" }, "Remote-first, serving users worldwide."))))),
                React.createElement(card_1.Card, null,
                    React.createElement(card_1.CardHeader, null,
                        React.createElement(card_1.CardTitle, null, "Need quick answers?"),
                        React.createElement(card_1.CardDescription, null, "These links solve most common questions.")),
                    React.createElement(card_1.CardContent, { className: "space-y-2 text-sm" },
                        React.createElement("ul", { className: "space-y-2" },
                            React.createElement("li", { className: "flex items-center justify-between gap-2" },
                                React.createElement("span", { className: "text-xs text-muted-foreground" }, "Help with ATS score"),
                                React.createElement(button_1.Button, { variant: "ghost", size: "sm", asChild: true, className: "px-2" },
                                    React.createElement(link_1["default"], { href: "/dashboard/ats" },
                                        "Open ATS tool",
                                        React.createElement(lucide_react_1.ArrowRight, { className: "ml-1 h-3 w-3" })))),
                            React.createElement("li", { className: "flex items-center justify-between gap-2" },
                                React.createElement("span", { className: "text-xs text-muted-foreground" }, "Manage your account"),
                                React.createElement(button_1.Button, { variant: "ghost", size: "sm", asChild: true, className: "px-2" },
                                    React.createElement(link_1["default"], { href: "/dashboard/settings" },
                                        "Open settings",
                                        React.createElement(lucide_react_1.ArrowRight, { className: "ml-1 h-3 w-3" }))))),
                        React.createElement(separator_1.Separator, { className: "my-2" }),
                        React.createElement("p", { className: "text-xs text-muted-foreground" }, "For security issues, please mention \u201CSecurity\u201D in your subject line so we can prioritize your request.")))))));
}
exports["default"] = ContactPage;
