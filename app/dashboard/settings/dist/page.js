// app/dashboard/settings/page.tsx
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
var react_hot_toast_1 = require("react-hot-toast");
var zod_1 = require("zod");
var react_hook_form_1 = require("react-hook-form");
var zod_2 = require("@hookform/resolvers/zod");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var switch_1 = require("@/components/ui/switch");
var separator_1 = require("@/components/ui/separator");
var tabs_1 = require("@/components/ui/tabs");
var select_1 = require("@/components/ui/select");
var form_1 = require("@/components/ui/form");
var avatar_1 = require("@/components/ui/avatar");
var lucide_react_1 = require("lucide-react");
var ModeToggle_1 = require("@/components/ModeToggle");
/* ----------------------------- Schemas ------------------------------ */
var ProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name too short"),
    bio: zod_1.z.string().max(280, "Max 280 chars").optional(),
    website: zod_1.z
        .string()
        .url("Invalid URL")
        .optional()
        .or(zod_1.z.literal(""))
});
var PrefSchema = zod_1.z.object({
    theme: zod_1.z["enum"](["system", "light", "dark"]),
    locale: zod_1.z["enum"](["en", "hi", "fr", "de", "es"]),
    density: zod_1.z["enum"](["comfortable", "compact"])
});
var NotifSchema = zod_1.z.object({
    productUpdates: zod_1.z.boolean(),
    weeklyDigest: zod_1.z.boolean(),
    atsAlerts: zod_1.z.boolean(),
    marketing: zod_1.z.boolean()
});
var PasswordSchema = zod_1.z
    .object({
    currentPassword: zod_1.z.string().min(6),
    newPassword: zod_1.z.string().min(8, "Min 8 chars"),
    confirmNewPassword: zod_1.z.string().min(8)
})
    .refine(function (d) { return d.newPassword === d.confirmNewPassword; }, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"]
});
/* --------------------------- Helpers (API) --------------------------- */
function getJSON(url) {
    return __awaiter(this, void 0, Promise, function () {
        var res, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetch(url, {
                        method: "GET",
                        credentials: "include",
                        cache: "no-store"
                    })];
                case 1:
                    res = _b.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    _a = Error.bind;
                    return [4 /*yield*/, res.text()];
                case 2: throw new (_a.apply(Error, [void 0, (_b.sent()) || "HTTP " + res.status]))();
                case 3: return [2 /*return*/, res.json()];
            }
        });
    });
}
function postJSON(url, body) {
    return __awaiter(this, void 0, void 0, function () {
        var res, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetch(url, {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body),
                        cache: "no-store"
                    })];
                case 1:
                    res = _b.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    _a = Error.bind;
                    return [4 /*yield*/, res.text()];
                case 2: throw new (_a.apply(Error, [void 0, (_b.sent()) || "HTTP " + res.status]))();
                case 3: return [2 /*return*/, res.json()["catch"](function () { return ({}); })];
            }
        });
    });
}
/* ----------------------------- Utils -------------------------------- */
function getInitials(name) {
    var _a, _b, _c, _d;
    if (!name)
        return "U";
    var parts = name.trim().split(/\s+/);
    var first = (_b = (_a = parts[0]) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : "";
    var second = (_d = (_c = parts[1]) === null || _c === void 0 ? void 0 : _c[0]) !== null && _d !== void 0 ? _d : "";
    var init = (first + second).toUpperCase();
    return init || "U";
}
/* ----------------------------- Page -------------------------------- */
function SettingsPage() {
    var _this = this;
    var _a = React.useState(null), avatarUrl = _a[0], setAvatarUrl = _a[1];
    var _b = React.useState(""), email = _b[0], setEmail = _b[1];
    var _c = React.useState(false), savingAvatar = _c[0], setSavingAvatar = _c[1];
    var _d = React.useState(true), initialLoading = _d[0], setInitialLoading = _d[1];
    /* ------------------------- Forms setup -------------------------- */
    var profileForm = react_hook_form_1.useForm({
        resolver: zod_2.zodResolver(ProfileSchema),
        defaultValues: {
            name: "",
            bio: "",
            website: ""
        }
    });
    var prefForm = react_hook_form_1.useForm({
        resolver: zod_2.zodResolver(PrefSchema),
        defaultValues: {
            theme: "system",
            locale: "en",
            density: "comfortable"
        }
    });
    var notifForm = react_hook_form_1.useForm({
        resolver: zod_2.zodResolver(NotifSchema),
        defaultValues: {
            productUpdates: true,
            weeklyDigest: true,
            atsAlerts: true,
            marketing: false
        }
    });
    var pwdForm = react_hook_form_1.useForm({
        resolver: zod_2.zodResolver(PasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        }
    });
    var watchedName = profileForm.watch("name");
    /* ---------------------- Initial data fetch ---------------------- */
    React.useEffect(function () {
        var cancelled = false;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, profile, prefs, notif, e_1;
            var _b, _c, _d, _e, _f, _g, _h, _j, _k;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        _l.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, Promise.all([
                                getJSON("/api/settings/profile"),
                                getJSON("/api/settings/preferences"),
                                getJSON("/api/settings/notifications"),
                            ])];
                    case 1:
                        _a = _l.sent(), profile = _a[0], prefs = _a[1], notif = _a[2];
                        if (cancelled)
                            return [2 /*return*/];
                        // Profile
                        profileForm.reset({
                            name: (_b = profile.name) !== null && _b !== void 0 ? _b : "",
                            bio: (_c = profile.bio) !== null && _c !== void 0 ? _c : "",
                            website: (_d = profile.website) !== null && _d !== void 0 ? _d : ""
                        });
                        setEmail((_e = profile.email) !== null && _e !== void 0 ? _e : "");
                        setAvatarUrl((_f = profile.avatar) !== null && _f !== void 0 ? _f : null);
                        // Preferences
                        prefForm.reset({
                            theme: (_g = prefs.theme) !== null && _g !== void 0 ? _g : "system",
                            locale: (_h = prefs.locale) !== null && _h !== void 0 ? _h : "en",
                            density: (_j = prefs.density) !== null && _j !== void 0 ? _j : "comfortable"
                        });
                        // Notifications
                        notifForm.reset({
                            productUpdates: !!notif.productUpdates,
                            weeklyDigest: !!notif.weeklyDigest,
                            atsAlerts: !!notif.atsAlerts,
                            marketing: !!notif.marketing
                        });
                        return [3 /*break*/, 4];
                    case 2:
                        e_1 = _l.sent();
                        console.error(e_1);
                        react_hot_toast_1.toast.error((_k = e_1 === null || e_1 === void 0 ? void 0 : e_1.message) !== null && _k !== void 0 ? _k : "Failed to load settings");
                        return [3 /*break*/, 4];
                    case 3:
                        if (!cancelled)
                            setInitialLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); })();
        return function () {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    /* ------------------------ Submit handlers ----------------------- */
    var onSaveProfile = function (values) { return __awaiter(_this, void 0, void 0, function () {
        var e_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, postJSON("/api/settings/profile", values)];
                case 1:
                    _b.sent();
                    react_hot_toast_1.toast.success("Profile updated");
                    return [3 /*break*/, 3];
                case 2:
                    e_2 = _b.sent();
                    react_hot_toast_1.toast.error((_a = e_2 === null || e_2 === void 0 ? void 0 : e_2.message) !== null && _a !== void 0 ? _a : "Failed to update profile");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var onSavePref = function (values) { return __awaiter(_this, void 0, void 0, function () {
        var e_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, postJSON("/api/settings/preferences", values)];
                case 1:
                    _b.sent();
                    react_hot_toast_1.toast.success("Preferences saved");
                    return [3 /*break*/, 3];
                case 2:
                    e_3 = _b.sent();
                    react_hot_toast_1.toast.error((_a = e_3 === null || e_3 === void 0 ? void 0 : e_3.message) !== null && _a !== void 0 ? _a : "Failed to save preferences");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var onSaveNotif = function (values) { return __awaiter(_this, void 0, void 0, function () {
        var e_4;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, postJSON("/api/settings/notifications", values)];
                case 1:
                    _b.sent();
                    react_hot_toast_1.toast.success("Notification settings saved");
                    return [3 /*break*/, 3];
                case 2:
                    e_4 = _b.sent();
                    react_hot_toast_1.toast.error((_a = e_4 === null || e_4 === void 0 ? void 0 : e_4.message) !== null && _a !== void 0 ? _a : "Failed to save notifications");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var onChangePassword = function (values) { return __awaiter(_this, void 0, void 0, function () {
        var e_5;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, postJSON("/api/settings/password", values)];
                case 1:
                    _b.sent();
                    react_hot_toast_1.toast.success("Password changed");
                    pwdForm.reset();
                    return [3 /*break*/, 3];
                case 2:
                    e_5 = _b.sent();
                    react_hot_toast_1.toast.error((_a = e_5 === null || e_5 === void 0 ? void 0 : e_5.message) !== null && _a !== void 0 ? _a : "Failed to change password");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var uploadAvatar = function (file) { return __awaiter(_this, void 0, void 0, function () {
        var fd, res, _a, j, url, e_6;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!file)
                        return [2 /*return*/];
                    setSavingAvatar(true);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, 7, 8]);
                    fd = new FormData();
                    fd.set("file", file);
                    return [4 /*yield*/, fetch("/api/settings/avatar", {
                            method: "POST",
                            credentials: "include",
                            body: fd
                        })];
                case 2:
                    res = _c.sent();
                    if (!!res.ok) return [3 /*break*/, 4];
                    _a = Error.bind;
                    return [4 /*yield*/, res.text()];
                case 3: throw new (_a.apply(Error, [void 0, (_c.sent()) || "Upload failed"]))();
                case 4: return [4 /*yield*/, res.json()["catch"](function () { return ({}); })];
                case 5:
                    j = _c.sent();
                    url = (j === null || j === void 0 ? void 0 : j.url) || URL.createObjectURL(file);
                    setAvatarUrl(url);
                    react_hot_toast_1.toast.success("Avatar updated");
                    return [3 /*break*/, 8];
                case 6:
                    e_6 = _c.sent();
                    react_hot_toast_1.toast.error((_b = e_6 === null || e_6 === void 0 ? void 0 : e_6.message) !== null && _b !== void 0 ? _b : "Avatar upload failed");
                    return [3 /*break*/, 8];
                case 7:
                    setSavingAvatar(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    /* ----------------------------- UI ------------------------------- */
    return (React.createElement("div", { className: "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6" },
        React.createElement("div", { className: "mb-4 flex items-center justify-between" },
            React.createElement("div", { className: "min-w-0" },
                React.createElement("h1", { className: "text-2xl font-semibold tracking-tight" }, "Settings"),
                React.createElement("p", { className: "text-sm text-muted-foreground" }, "Manage your profile, preferences, and security.")),
            initialLoading && (React.createElement("span", { className: "text-xs text-muted-foreground" }, "Loading\u2026"))),
        React.createElement(separator_1.Separator, { className: "my-4" }),
        React.createElement(tabs_1.Tabs, { defaultValue: "profile", className: "w-full" },
            React.createElement(tabs_1.TabsList, { className: "flex flex-wrap" },
                React.createElement(tabs_1.TabsTrigger, { value: "profile", className: "gap-2" },
                    React.createElement(lucide_react_1.User, { className: "h-4 w-4" }),
                    " Profile"),
                React.createElement(tabs_1.TabsTrigger, { value: "preferences", className: "gap-2" },
                    React.createElement(lucide_react_1.Palette, { className: "h-4 w-4" }),
                    " Preferences"),
                React.createElement(tabs_1.TabsTrigger, { value: "notifications", className: "gap-2" },
                    React.createElement(lucide_react_1.Bell, { className: "h-4 w-4" }),
                    " Notifications"),
                React.createElement(tabs_1.TabsTrigger, { value: "security", className: "gap-2" },
                    React.createElement(lucide_react_1.Shield, { className: "h-4 w-4" }),
                    " Security")),
            React.createElement(tabs_1.TabsContent, { value: "profile", className: "mt-4" },
                React.createElement("div", { className: "grid gap-4 lg:grid-cols-3" },
                    React.createElement(card_1.Card, { className: "lg:col-span-1 h-full" },
                        React.createElement(card_1.CardHeader, null,
                            React.createElement(card_1.CardTitle, null, "Avatar"),
                            React.createElement(card_1.CardDescription, null, "JPG/PNG, square is best.")),
                        React.createElement(card_1.CardContent, { className: "flex flex-col items-start gap-4" },
                            React.createElement("div", { className: "flex flex-wrap items-center gap-4" },
                                React.createElement(avatar_1.Avatar, { className: "h-20 w-20" },
                                    React.createElement(avatar_1.AvatarImage, { src: avatarUrl !== null && avatarUrl !== void 0 ? avatarUrl : undefined, alt: "Avatar" }),
                                    React.createElement(avatar_1.AvatarFallback, null, getInitials(watchedName))),
                                React.createElement("div", { className: "flex flex-col gap-2" },
                                    React.createElement(label_1.Label, { htmlFor: "avatar-file", className: "sr-only" }, "Upload avatar"),
                                    React.createElement(input_1.Input, { id: "avatar-file", type: "file", accept: "image/*", onChange: function (e) { var _a; return uploadAvatar((_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]); }, disabled: savingAvatar || initialLoading }),
                                    React.createElement(button_1.Button, { size: "sm", variant: "outline", disabled: savingAvatar || initialLoading },
                                        React.createElement(lucide_react_1.Upload, { className: "mr-2 h-4 w-4 " + (savingAvatar ? "animate-pulse" : "") }),
                                        savingAvatar ? "Uploading…" : "Upload"))))),
                    React.createElement(card_1.Card, { className: "lg:col-span-2" },
                        React.createElement(card_1.CardHeader, null,
                            React.createElement(card_1.CardTitle, null, "Public Profile"),
                            React.createElement(card_1.CardDescription, null, "These details appear on shared resumes.")),
                        React.createElement(card_1.CardContent, null,
                            React.createElement(form_1.Form, __assign({}, profileForm),
                                React.createElement("form", { className: "flex flex-col gap-6", onSubmit: profileForm.handleSubmit(onSaveProfile) },
                                    React.createElement("div", { className: "grid gap-4 md:grid-cols-2" },
                                        React.createElement(form_1.FormField, { control: profileForm.control, name: "name", render: function (_a) {
                                                var field = _a.field;
                                                return (React.createElement(form_1.FormItem, null,
                                                    React.createElement(form_1.FormLabel, null, "Name"),
                                                    React.createElement(form_1.FormControl, null,
                                                        React.createElement(input_1.Input, __assign({}, field, { placeholder: "Your full name", disabled: initialLoading }))),
                                                    React.createElement(form_1.FormMessage, null)));
                                            } }),
                                        React.createElement("div", { className: "grid gap-2" },
                                            React.createElement(label_1.Label, null, "Email"),
                                            React.createElement(input_1.Input, { value: email, disabled: true }),
                                            React.createElement("p", { className: "text-xs text-muted-foreground" }, "Email is managed by your account provider."))),
                                    React.createElement(form_1.FormField, { control: profileForm.control, name: "bio", render: function (_a) {
                                            var field = _a.field;
                                            return (React.createElement(form_1.FormItem, null,
                                                React.createElement(form_1.FormLabel, null, "Bio"),
                                                React.createElement(form_1.FormControl, null,
                                                    React.createElement(textarea_1.Textarea, __assign({ rows: 4 }, field, { placeholder: "Short intro (max 280 chars)", disabled: initialLoading }))),
                                                React.createElement(form_1.FormMessage, null)));
                                        } }),
                                    React.createElement("div", { className: "grid gap-4 md:grid-cols-2" },
                                        React.createElement(form_1.FormField, { control: profileForm.control, name: "website", render: function (_a) {
                                                var field = _a.field;
                                                return (React.createElement(form_1.FormItem, null,
                                                    React.createElement(form_1.FormLabel, null, "Website"),
                                                    React.createElement(form_1.FormControl, null,
                                                        React.createElement(input_1.Input, __assign({}, field, { placeholder: "https://\u2026", disabled: initialLoading }))),
                                                    React.createElement(form_1.FormMessage, null)));
                                            } }),
                                        React.createElement("div", { className: "grid gap-2" },
                                            React.createElement(label_1.Label, null, "Links"),
                                            React.createElement("div", { className: "flex flex-wrap items-center gap-2 text-sm text-muted-foreground" },
                                                React.createElement(lucide_react_1.Link2, { className: "h-4 w-4" }),
                                                " Add GitHub/LinkedIn from your Resume editor."))),
                                    React.createElement("div", { className: "flex items-center justify-end gap-2" },
                                        React.createElement(button_1.Button, { type: "submit", disabled: initialLoading },
                                            React.createElement(lucide_react_1.Save, { className: "mr-2 h-4 w-4" }),
                                            "Save changes")))))))),
            React.createElement(tabs_1.TabsContent, { value: "preferences", className: "mt-4" },
                React.createElement("div", { className: "grid gap-4 lg:grid-cols-2" },
                    React.createElement(card_1.Card, null,
                        React.createElement(card_1.CardHeader, null,
                            React.createElement(card_1.CardTitle, null, "Display"),
                            React.createElement(card_1.CardDescription, null, "Theme and density preferences.")),
                        React.createElement(card_1.CardContent, null,
                            React.createElement(form_1.Form, __assign({}, prefForm),
                                React.createElement("form", { className: "flex flex-col gap-6", onSubmit: prefForm.handleSubmit(onSavePref) },
                                    React.createElement("div", { className: "grid gap-4 md:grid-cols-2" },
                                        React.createElement(ModeToggle_1.ModeToggle, null),
                                        React.createElement(form_1.FormField, { control: prefForm.control, name: "density", render: function (_a) {
                                                var field = _a.field;
                                                return (React.createElement(form_1.FormItem, null,
                                                    React.createElement(form_1.FormLabel, null, "Density"),
                                                    React.createElement(form_1.FormControl, null,
                                                        React.createElement(select_1.Select, { value: field.value, onValueChange: field.onChange, disabled: initialLoading },
                                                            React.createElement(select_1.SelectTrigger, null,
                                                                React.createElement(select_1.SelectValue, { placeholder: "Select density" })),
                                                            React.createElement(select_1.SelectContent, null,
                                                                React.createElement(select_1.SelectItem, { value: "comfortable" }, "Comfortable"),
                                                                React.createElement(select_1.SelectItem, { value: "compact" }, "Compact")))),
                                                    React.createElement(form_1.FormMessage, null)));
                                            } })),
                                    React.createElement(form_1.FormField, { control: prefForm.control, name: "locale", render: function (_a) {
                                            var field = _a.field;
                                            return (React.createElement(form_1.FormItem, null,
                                                React.createElement(form_1.FormLabel, null, "Language"),
                                                React.createElement(form_1.FormControl, null,
                                                    React.createElement(select_1.Select, { value: field.value, onValueChange: field.onChange, disabled: initialLoading },
                                                        React.createElement(select_1.SelectTrigger, null,
                                                            React.createElement(select_1.SelectValue, { placeholder: "Select language" })),
                                                        React.createElement(select_1.SelectContent, null,
                                                            React.createElement(select_1.SelectItem, { value: "en" }, "English"),
                                                            React.createElement(select_1.SelectItem, { value: "hi" }, "\u0939\u093F\u0928\u094D\u0926\u0940 (Hindi)"),
                                                            React.createElement(select_1.SelectItem, { value: "fr" }, "Fran\u00E7ais"),
                                                            React.createElement(select_1.SelectItem, { value: "de" }, "Deutsch"),
                                                            React.createElement(select_1.SelectItem, { value: "es" }, "Espa\u00F1ol")))),
                                                React.createElement(form_1.FormMessage, null)));
                                        } }),
                                    React.createElement("div", { className: "flex items-center justify-end" },
                                        React.createElement(button_1.Button, { type: "submit", disabled: initialLoading },
                                            React.createElement(lucide_react_1.Save, { className: "mr-2 h-4 w-4" }),
                                            "Save preferences")))))),
                    React.createElement(card_1.Card, null,
                        React.createElement(card_1.CardHeader, null,
                            React.createElement(card_1.CardTitle, null, "Regional"),
                            React.createElement(card_1.CardDescription, null, "Timezone & formatting (coming soon).")),
                        React.createElement(card_1.CardContent, null,
                            React.createElement("div", { className: "grid gap-4 md:grid-cols-2" },
                                React.createElement("div", { className: "grid gap-2" },
                                    React.createElement(label_1.Label, null, "Timezone"),
                                    React.createElement(input_1.Input, { disabled: true, value: "Auto (browser)" })),
                                React.createElement("div", { className: "grid gap-2" },
                                    React.createElement(label_1.Label, null, "Date format"),
                                    React.createElement(input_1.Input, { disabled: true, value: "Auto (locale)" }))),
                            React.createElement("p", { className: "mt-3 text-sm text-muted-foreground" }, "These are auto-detected. You will be able to override soon."))))),
            React.createElement(tabs_1.TabsContent, { value: "notifications", className: "mt-4" },
                React.createElement(card_1.Card, null,
                    React.createElement(card_1.CardHeader, null,
                        React.createElement(card_1.CardTitle, null, "Notifications"),
                        React.createElement(card_1.CardDescription, null, "Choose what updates you want to receive.")),
                    React.createElement(card_1.CardContent, null,
                        React.createElement(form_1.Form, __assign({}, notifForm),
                            React.createElement("form", { className: "flex flex-col gap-6", onSubmit: notifForm.handleSubmit(onSaveNotif) },
                                React.createElement("div", { className: "grid gap-4 sm:grid-cols-2" },
                                    React.createElement(form_1.FormField, { control: notifForm.control, name: "productUpdates", render: function (_a) {
                                            var field = _a.field;
                                            return (React.createElement(form_1.FormItem, { className: "flex items-center justify-between rounded-md border p-3" },
                                                React.createElement("div", { className: "space-y-0.5" },
                                                    React.createElement(form_1.FormLabel, { className: "flex items-center gap-2" },
                                                        React.createElement(lucide_react_1.Bell, { className: "h-4 w-4" }),
                                                        " Product updates"),
                                                    React.createElement("p", { className: "text-xs text-muted-foreground" }, "Major features and improvements.")),
                                                React.createElement(form_1.FormControl, null,
                                                    React.createElement(switch_1.Switch, { checked: field.value, onCheckedChange: field.onChange, disabled: initialLoading }))));
                                        } }),
                                    React.createElement(form_1.FormField, { control: notifForm.control, name: "weeklyDigest", render: function (_a) {
                                            var field = _a.field;
                                            return (React.createElement(form_1.FormItem, { className: "flex items-center justify-between rounded-md border p-3" },
                                                React.createElement("div", { className: "space-y-0.5" },
                                                    React.createElement(form_1.FormLabel, null, "Weekly digest"),
                                                    React.createElement("p", { className: "text-xs text-muted-foreground" }, "Summary of your activity.")),
                                                React.createElement(form_1.FormControl, null,
                                                    React.createElement(switch_1.Switch, { checked: field.value, onCheckedChange: field.onChange, disabled: initialLoading }))));
                                        } }),
                                    React.createElement(form_1.FormField, { control: notifForm.control, name: "atsAlerts", render: function (_a) {
                                            var field = _a.field;
                                            return (React.createElement(form_1.FormItem, { className: "flex items-center justify-between rounded-md border p-3 sm:col-span-2" },
                                                React.createElement("div", { className: "space-y-0.5" },
                                                    React.createElement(form_1.FormLabel, null, "ATS alerts"),
                                                    React.createElement("p", { className: "text-xs text-muted-foreground" }, "Get notified when ATS scores change.")),
                                                React.createElement(form_1.FormControl, null,
                                                    React.createElement(switch_1.Switch, { checked: field.value, onCheckedChange: field.onChange, disabled: initialLoading }))));
                                        } }),
                                    React.createElement(form_1.FormField, { control: notifForm.control, name: "marketing", render: function (_a) {
                                            var field = _a.field;
                                            return (React.createElement(form_1.FormItem, { className: "flex items-center justify-between rounded-md border p-3" },
                                                React.createElement("div", { className: "space-y-0.5" },
                                                    React.createElement(form_1.FormLabel, null, "Tips & offers"),
                                                    React.createElement("p", { className: "text-xs text-muted-foreground" }, "Occasional emails about promotions.")),
                                                React.createElement(form_1.FormControl, null,
                                                    React.createElement(switch_1.Switch, { checked: field.value, onCheckedChange: field.onChange, disabled: initialLoading }))));
                                        } })),
                                React.createElement("div", { className: "flex items-center justify-end" },
                                    React.createElement(button_1.Button, { type: "submit", disabled: initialLoading },
                                        React.createElement(lucide_react_1.Save, { className: "mr-2 h-4 w-4" }),
                                        "Save notifications"))))))),
            React.createElement(tabs_1.TabsContent, { value: "security", className: "mt-4" },
                React.createElement("div", { className: "grid gap-4 lg:grid-cols-2" },
                    React.createElement(card_1.Card, null,
                        React.createElement(card_1.CardHeader, null,
                            React.createElement(card_1.CardTitle, null, "Change Password"),
                            React.createElement(card_1.CardDescription, null, "Update your password for email/password accounts.")),
                        React.createElement(card_1.CardContent, null,
                            React.createElement(form_1.Form, __assign({}, pwdForm),
                                React.createElement("form", { className: "flex flex-col gap-6", onSubmit: pwdForm.handleSubmit(onChangePassword) },
                                    React.createElement("div", { className: "grid gap-4" },
                                        React.createElement(form_1.FormField, { control: pwdForm.control, name: "currentPassword", render: function (_a) {
                                                var field = _a.field;
                                                return (React.createElement(form_1.FormItem, null,
                                                    React.createElement(form_1.FormLabel, null, "Current password"),
                                                    React.createElement(form_1.FormControl, null,
                                                        React.createElement(input_1.Input, __assign({ type: "password", autoComplete: "current-password" }, field, { disabled: initialLoading }))),
                                                    React.createElement(form_1.FormMessage, null)));
                                            } }),
                                        React.createElement("div", { className: "grid gap-4 md:grid-cols-2" },
                                            React.createElement(form_1.FormField, { control: pwdForm.control, name: "newPassword", render: function (_a) {
                                                    var field = _a.field;
                                                    return (React.createElement(form_1.FormItem, null,
                                                        React.createElement(form_1.FormLabel, null, "New password"),
                                                        React.createElement(form_1.FormControl, null,
                                                            React.createElement(input_1.Input, __assign({ type: "password", autoComplete: "new-password" }, field, { disabled: initialLoading }))),
                                                        React.createElement(form_1.FormMessage, null)));
                                                } }),
                                            React.createElement(form_1.FormField, { control: pwdForm.control, name: "confirmNewPassword", render: function (_a) {
                                                    var field = _a.field;
                                                    return (React.createElement(form_1.FormItem, null,
                                                        React.createElement(form_1.FormLabel, null, "Confirm new password"),
                                                        React.createElement(form_1.FormControl, null,
                                                            React.createElement(input_1.Input, __assign({ type: "password", autoComplete: "new-password" }, field, { disabled: initialLoading }))),
                                                        React.createElement(form_1.FormMessage, null)));
                                                } }))),
                                    React.createElement("div", { className: "flex items-center justify-end" },
                                        React.createElement(button_1.Button, { type: "submit", disabled: initialLoading },
                                            React.createElement(lucide_react_1.Lock, { className: "mr-2 h-4 w-4" }),
                                            "Update password")))))),
                    React.createElement(card_1.Card, null,
                        React.createElement(card_1.CardHeader, null,
                            React.createElement(card_1.CardTitle, null, "Danger Zone"),
                            React.createElement(card_1.CardDescription, null, "Delete your account and all related data.")),
                        React.createElement(card_1.CardContent, { className: "space-y-4" },
                            React.createElement("p", { className: "text-sm text-muted-foreground" }, "This action is irreversible. Please proceed with caution."),
                            React.createElement(button_1.Button, { variant: "destructive", onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                                    var e_7;
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                if (!confirm("Are you sure? This cannot be undone."))
                                                    return [2 /*return*/];
                                                _b.label = 1;
                                            case 1:
                                                _b.trys.push([1, 3, , 4]);
                                                return [4 /*yield*/, postJSON("/api/settings/delete-account", {})];
                                            case 2:
                                                _b.sent();
                                                react_hot_toast_1.toast.success("Account deleted");
                                                return [3 /*break*/, 4];
                                            case 3:
                                                e_7 = _b.sent();
                                                react_hot_toast_1.toast.error((_a = e_7 === null || e_7 === void 0 ? void 0 : e_7.message) !== null && _a !== void 0 ? _a : "Failed to delete account");
                                                return [3 /*break*/, 4];
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                }); }, disabled: initialLoading },
                                React.createElement(lucide_react_1.Trash2, { className: "mr-2 h-4 w-4" }),
                                "Delete account"))))))));
}
exports["default"] = SettingsPage;
