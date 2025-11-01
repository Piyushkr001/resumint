// app/resumes/new/page.tsx
//@ts-nocheck
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
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("zod");
var zod_2 = require("@hookform/resolvers/zod");
var react_hot_toast_1 = require("react-hot-toast");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var separator_1 = require("@/components/ui/separator");
var badge_1 = require("@/components/ui/badge");
var switch_1 = require("@/components/ui/switch");
var progress_1 = require("@/components/ui/progress");
var select_1 = require("@/components/ui/select");
// -------------------- Validation --------------------
var NewResumeSchema = zod_1.z.object({
    title: zod_1.z.string().min(2, "Give your resume a title"),
    role: zod_1.z.string().min(2, "What role is this resume for?"),
    template: zod_1.z.string().min(1, "Pick a template"),
    summary: zod_1.z.string().max(800, "Keep summary under 800 chars").optional(),
    skills: zod_1.z.string().optional(),
    jobDescription: zod_1.z.string().optional(),
    isPublic: zod_1.z.boolean()["default"](false)
});
// Utility to parse skills string -> array
function parseSkills(s) {
    if (!s)
        return [];
    return s
        .split(/[,\n]/g)
        .map(function (x) { return x.trim(); })
        .filter(Boolean)
        .slice(0, 20);
}
function readError(res) {
    return __awaiter(this, void 0, void 0, function () {
        var j, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 7]);
                    return [4 /*yield*/, res.json()];
                case 1:
                    j = _c.sent();
                    return [2 /*return*/, (j === null || j === void 0 ? void 0 : j.error) || (j === null || j === void 0 ? void 0 : j.message) || res.statusText];
                case 2:
                    _a = _c.sent();
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, res.text()];
                case 4: return [2 /*return*/, _c.sent()];
                case 5:
                    _b = _c.sent();
                    return [2 /*return*/, "Something went wrong"];
                case 6: return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function NewResumePage() {
    var _a;
    var router = navigation_1.useRouter();
    var _b = React.useState(""), uploadName = _b[0], setUploadName = _b[1];
    var _c = React.useState(null), pdfFile = _c[0], setPdfFile = _c[1];
    var form = react_hook_form_1.useForm({
        //@ts-ignore
        resolver: zod_2.zodResolver(NewResumeSchema),
        defaultValues: {
            title: "",
            role: "",
            template: "clean",
            summary: "",
            skills: "",
            jobDescription: "",
            isPublic: false
        },
        mode: "onTouched"
    });
    var watchAll = form.watch();
    var skills = parseSkills(watchAll.skills);
    // naive completeness for preview progress
    var completeness = [
        watchAll.title ? 20 : 0,
        watchAll.role ? 15 : 0,
        watchAll.summary ? 25 : 0,
        skills.length ? 20 : 0,
        watchAll.jobDescription ? 20 : 0,
    ].reduce(function (a, b) { return a + b; }, 0) || 5;
    function onSubmit(values) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var payload, doRequest;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        payload = {
                            title: values.title.trim(),
                            role: values.role.trim(),
                            template: values.template,
                            summary: ((_a = values.summary) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                            skills: parseSkills(values.skills),
                            jobDescription: ((_b = values.jobDescription) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                            isPublic: !!values.isPublic
                        };
                        doRequest = function () { return __awaiter(_this, void 0, void 0, function () {
                            var res, fd, _a, j, newId;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!pdfFile) return [3 /*break*/, 2];
                                        fd = new FormData();
                                        fd.append("payload", new Blob([JSON.stringify(payload)], { type: "application/json" }));
                                        fd.append("jobDescriptionPdf", pdfFile, pdfFile.name);
                                        return [4 /*yield*/, fetch("/api/resumes", {
                                                method: "POST",
                                                body: fd,
                                                credentials: "include"
                                            })];
                                    case 1:
                                        res = _b.sent();
                                        return [3 /*break*/, 4];
                                    case 2: return [4 /*yield*/, fetch("/api/resumes", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            credentials: "include",
                                            body: JSON.stringify(payload)
                                        })];
                                    case 3:
                                        // simple JSON
                                        res = _b.sent();
                                        _b.label = 4;
                                    case 4:
                                        if (res.status === 401) {
                                            react_hot_toast_1["default"].error("Please log in to create a resume.");
                                            router.push("/login?next=/resumes/new");
                                            return [2 /*return*/];
                                        }
                                        if (!!res.ok) return [3 /*break*/, 6];
                                        _a = Error.bind;
                                        return [4 /*yield*/, readError(res)];
                                    case 5: throw new (_a.apply(Error, [void 0, _b.sent()]))();
                                    case 6: return [4 /*yield*/, res.json()["catch"](function () { return ({}); })];
                                    case 7:
                                        j = _b.sent();
                                        newId = j === null || j === void 0 ? void 0 : j.id;
                                        // Redirect to the new resume or list
                                        router.push(newId ? "/resumes/" + newId : "/dashboard/resumes");
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        return [4 /*yield*/, react_hot_toast_1["default"].promise(doRequest(), {
                                loading: "Creating resume…",
                                success: "Resume created!",
                                error: function (e) { var _a; return String((_a = e === null || e === void 0 ? void 0 : e.message) !== null && _a !== void 0 ? _a : "Failed to create resume"); }
                            })];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function onSaveDraft() {
        // Optional: save to localStorage or call /api/resumes/drafts
        var draft = form.getValues();
        localStorage.setItem("resumint:new-draft", JSON.stringify(draft));
        react_hot_toast_1["default"]("Draft saved locally", { icon: "💾" });
    }
    var isSubmitting = form.formState.isSubmitting;
    var canSubmit = !isSubmitting && form.formState.isDirty && form.formState.isValid;
    return (React.createElement("div", { className: "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6" },
        React.createElement("div", { className: "mb-4 flex items-center justify-between gap-3" },
            React.createElement("div", { className: "flex items-center gap-3" },
                React.createElement(button_1.Button, { asChild: true, variant: "ghost", size: "icon", "aria-label": "Back" },
                    React.createElement(link_1["default"], { href: "/dashboard/resumes" },
                        React.createElement(lucide_react_1.ArrowLeft, { className: "h-5 w-5" }))),
                React.createElement("div", null,
                    React.createElement("h1", { className: "text-2xl font-semibold tracking-tight" }, "New Resume"),
                    React.createElement("p", { className: "text-sm text-muted-foreground" }, "Create a resume optimized for Applicant Tracking Systems (ATS)."))),
            React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement(button_1.Button, { variant: "outline", onClick: onSaveDraft, disabled: isSubmitting },
                    React.createElement(lucide_react_1.Save, { className: "mr-2 h-4 w-4" }),
                    "Save draft"),
                React.createElement(button_1.Button, { onClick: form.handleSubmit(onSubmit), disabled: !canSubmit },
                    isSubmitting ? (React.createElement(lucide_react_1.Loader2, { className: "mr-2 h-4 w-4 animate-spin" })) : (React.createElement(lucide_react_1.Check, { className: "mr-2 h-4 w-4" })),
                    "Create"))),
        React.createElement(separator_1.Separator, null),
        React.createElement("div", { className: "mt-6 grid gap-6 lg:grid-cols-3" },
            React.createElement("div", { className: "lg:col-span-2 space-y-6" },
                React.createElement(card_1.Card, { className: "border-border/60" },
                    React.createElement(card_1.CardHeader, null,
                        React.createElement(card_1.CardTitle, null, "Basic details"),
                        React.createElement(card_1.CardDescription, null, "Title, target role and template selection.")),
                    React.createElement(card_1.CardContent, { className: "grid gap-4" },
                        React.createElement("div", { className: "grid gap-2" },
                            React.createElement(label_1.Label, { htmlFor: "title" }, "Resume title"),
                            React.createElement(input_1.Input, __assign({ id: "title", placeholder: "e.g., Frontend Developer \u2014 Jane Doe" }, form.register("title"), { "aria-invalid": !!form.formState.errors.title })),
                            form.formState.errors.title && (React.createElement("p", { className: "text-sm text-destructive" }, form.formState.errors.title.message))),
                        React.createElement("div", { className: "grid gap-2 md:grid-cols-2" },
                            React.createElement("div", { className: "grid gap-2" },
                                React.createElement(label_1.Label, { htmlFor: "role" }, "Target role"),
                                React.createElement(input_1.Input, __assign({ id: "role", placeholder: "e.g., Frontend Developer" }, form.register("role"), { "aria-invalid": !!form.formState.errors.role })),
                                form.formState.errors.role && (React.createElement("p", { className: "text-sm text-destructive" }, form.formState.errors.role.message))),
                            React.createElement("div", { className: "grid gap-2" },
                                React.createElement(label_1.Label, null, "Template"),
                                React.createElement(select_1.Select, { value: form.watch("template"), onValueChange: function (val) {
                                        return form.setValue("template", val, {
                                            shouldDirty: true,
                                            shouldValidate: true
                                        });
                                    } },
                                    React.createElement(select_1.SelectTrigger, null,
                                        React.createElement(select_1.SelectValue, { placeholder: "Choose a template" })),
                                    React.createElement(select_1.SelectContent, null,
                                        React.createElement(select_1.SelectItem, { value: "clean" }, "Clean"),
                                        React.createElement(select_1.SelectItem, { value: "modern" }, "Modern"),
                                        React.createElement(select_1.SelectItem, { value: "minimal" }, "Minimal"),
                                        React.createElement(select_1.SelectItem, { value: "elegant" }, "Elegant"))),
                                form.formState.errors.template && (React.createElement("p", { className: "text-sm text-destructive" }, form.formState.errors.template.message)))))),
                React.createElement(card_1.Card, { className: "border-border/60" },
                    React.createElement(card_1.CardHeader, null,
                        React.createElement(card_1.CardTitle, null, "Profile & skills"),
                        React.createElement(card_1.CardDescription, null, "A concise summary and keywords that highlight your strengths.")),
                    React.createElement(card_1.CardContent, { className: "grid gap-4" },
                        React.createElement("div", { className: "grid gap-2" },
                            React.createElement(label_1.Label, { htmlFor: "summary" }, "Professional summary"),
                            React.createElement(textarea_1.Textarea, __assign({ id: "summary", rows: 5, placeholder: "2\u20134 lines about your experience and impact." }, form.register("summary"))),
                            form.formState.errors.summary && (React.createElement("p", { className: "text-sm text-destructive" }, form.formState.errors.summary.message))),
                        React.createElement("div", { className: "grid gap-2" },
                            React.createElement(label_1.Label, { htmlFor: "skills" }, "Skills (comma/new-line separated)"),
                            React.createElement(textarea_1.Textarea, __assign({ id: "skills", rows: 3, placeholder: "React, TypeScript, Tailwind, Next.js, Testing Library..." }, form.register("skills"))),
                            React.createElement("p", { className: "text-xs text-muted-foreground" }, "We\u2019ll parse these into tags automatically.")))),
                React.createElement(card_1.Card, { className: "border-border/60" },
                    React.createElement(card_1.CardHeader, null,
                        React.createElement(card_1.CardTitle, null, "Job description (optional)"),
                        React.createElement(card_1.CardDescription, null, "Paste a JD for better ATS alignment & suggestions.")),
                    React.createElement(card_1.CardContent, { className: "grid gap-4" },
                        React.createElement("div", { className: "grid gap-2" },
                            React.createElement(label_1.Label, { htmlFor: "jd" }, "Paste JD"),
                            React.createElement(textarea_1.Textarea, __assign({ id: "jd", rows: 6, placeholder: "Paste the role\u2019s responsibilities & requirements\u2026" }, form.register("jobDescription")))),
                        React.createElement("div", { className: "grid gap-2" },
                            React.createElement(label_1.Label, null, "Import JD from PDF (optional)"),
                            React.createElement("div", { className: "flex items-center gap-3" },
                                React.createElement(input_1.Input, { type: "file", accept: "application/pdf", onChange: function (e) {
                                        var _a, _b;
                                        var file = (_b = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null;
                                        setPdfFile(file);
                                        setUploadName(file ? file.name : "");
                                    }, disabled: isSubmitting }),
                                uploadName ? (React.createElement(badge_1.Badge, { variant: "secondary", className: "gap-1" },
                                    React.createElement(lucide_react_1.UploadCloud, { className: "h-3.5 w-3.5" }),
                                    uploadName)) : null),
                            React.createElement("p", { className: "text-xs text-muted-foreground" }, "If attached, the PDF is uploaded and parsed server-side.")))),
                React.createElement(card_1.Card, { className: "border-border/60" },
                    React.createElement(card_1.CardHeader, null,
                        React.createElement(card_1.CardTitle, null, "Visibility"),
                        React.createElement(card_1.CardDescription, null, "Choose who can see this resume.")),
                    React.createElement(card_1.CardContent, { className: "flex items-center justify-between gap-4" },
                        React.createElement("div", { className: "space-y-1" },
                            React.createElement("p", { className: "text-sm font-medium" }, "Public profile"),
                            React.createElement("p", { className: "text-xs text-muted-foreground" }, "If enabled, a shareable link will be available.")),
                        React.createElement(switch_1.Switch, { checked: !!form.watch("isPublic"), onCheckedChange: function (v) {
                                return form.setValue("isPublic", v, { shouldDirty: true });
                            }, disabled: isSubmitting })),
                    React.createElement(card_1.CardFooter, { className: "justify-end gap-2" },
                        React.createElement(button_1.Button, { variant: "outline", onClick: onSaveDraft, disabled: isSubmitting },
                            React.createElement(lucide_react_1.Save, { className: "mr-2 h-4 w-4" }),
                            "Save draft"),
                        React.createElement(button_1.Button, { onClick: form.handleSubmit(onSubmit), disabled: !canSubmit },
                            isSubmitting ? (React.createElement(lucide_react_1.Loader2, { className: "mr-2 h-4 w-4 animate-spin" })) : (React.createElement(lucide_react_1.Check, { className: "mr-2 h-4 w-4" })),
                            "Create")))),
            React.createElement("div", { className: "lg:col-span-1" },
                React.createElement("div", { className: "lg:sticky lg:top-6 space-y-4" },
                    React.createElement(card_1.Card, { className: "border-border/60" },
                        React.createElement(card_1.CardHeader, null,
                            React.createElement(card_1.CardTitle, { className: "flex items-center gap-2" },
                                React.createElement(lucide_react_1.FileText, { className: "h-4 w-4" }),
                                "Preview"),
                            React.createElement(card_1.CardDescription, null, "This is a lightweight preview.")),
                        React.createElement(card_1.CardContent, { className: "space-y-4" },
                            React.createElement("div", { className: "rounded-lg border p-4" },
                                React.createElement("div", { className: "flex items-baseline justify-between gap-3" },
                                    React.createElement("h3", { className: "line-clamp-2 text-lg font-semibold" }, watchAll.title || "Untitled resume"),
                                    React.createElement(badge_1.Badge, { variant: "secondary" }, watchAll.template || "clean")),
                                React.createElement("p", { className: "mt-1 text-sm text-muted-foreground" }, watchAll.role || "Target role"),
                                React.createElement(separator_1.Separator, { className: "my-3" }),
                                React.createElement("p", { className: "text-sm" }, ((_a = watchAll.summary) === null || _a === void 0 ? void 0 : _a.trim()) ||
                                    "Add a short, impact-focused professional summary here…"),
                                !!skills.length && (React.createElement("div", { className: "mt-3 flex flex-wrap gap-2" }, skills.map(function (s) { return (React.createElement(badge_1.Badge, { key: s, variant: "outline" }, s)); }))),
                                React.createElement("div", { className: "mt-4" },
                                    React.createElement("div", { className: "mb-1 flex items-center justify-between text-xs text-muted-foreground" },
                                        React.createElement("span", null, "Completeness"),
                                        React.createElement("span", null,
                                            completeness,
                                            "%")),
                                    React.createElement(progress_1.Progress, { value: completeness }))),
                            React.createElement("div", { className: "rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground" },
                                React.createElement(lucide_react_1.Sparkles, { className: "mr-2 inline h-3.5 w-3.5" }),
                                "ATS pro tip: match keywords from the JD in your Skills and Summary sections to improve your score."))),
                    React.createElement(card_1.Card, { className: "border-border/60" },
                        React.createElement(card_1.CardHeader, null,
                            React.createElement(card_1.CardTitle, null, "Next steps"),
                            React.createElement(card_1.CardDescription, null, "After creating your resume")),
                        React.createElement(card_1.CardContent, { className: "grid gap-2 text-sm" },
                            React.createElement("p", null, "\u2022 Add experience, projects, and achievements."),
                            React.createElement("p", null, "\u2022 Tailor keywords to each job."),
                            React.createElement("p", null, "\u2022 Export as PDF or share the public link.")),
                        React.createElement(card_1.CardFooter, { className: "justify-end" },
                            React.createElement(button_1.Button, { asChild: true, variant: "ghost", size: "sm" },
                                React.createElement(link_1["default"], { href: "/dashboard/resumes" }, "Back to list")))))))));
}
exports["default"] = NewResumePage;
