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
var navigation_1 = require("next/navigation");
var axios_1 = require("axios");
var react_hot_toast_1 = require("react-hot-toast");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("zod");
var zod_2 = require("@hookform/resolvers/zod");
var passwordRules = zod_1.z.string().min(8, "At least 8 characters")
    .refine(function (v) { return /[A-Za-z]/.test(v); }, { message: "Include at least one letter" })
    .refine(function (v) { return /\d/.test(v); }, { message: "Include at least one number" });
var SignupSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Enter your full name"),
    email: zod_1.z.string().email("Enter a valid email"),
    password: passwordRules,
    confirm: zod_1.z.string(),
    accept: zod_1.z.boolean()
}).refine(function (d) { return d.password === d.confirm; }, { message: "Passwords do not match", path: ["confirm"] })
    .refine(function (d) { return d.accept === true; }, { message: "You must accept the Terms", path: ["accept"] });
function SignupClient() {
    var router = navigation_1.useRouter();
    var _a = React.useState(false), showPwd = _a[0], setShowPwd = _a[1];
    var _b = React.useState(false), showConfirm = _b[0], setShowConfirm = _b[1];
    var _c = React.useState(false), loading = _c[0], setLoading = _c[1];
    var form = react_hook_form_1.useForm({
        resolver: zod_2.zodResolver(SignupSchema),
        defaultValues: { name: "", email: "", password: "", confirm: "", accept: true },
        mode: "onTouched"
    });
    var pwd = form.watch("password");
    var strength = (function () {
        var score = (pwd.length >= 8 ? 1 : 0) + (/[A-Za-z]/.test(pwd) ? 1 : 0) + (/\d/.test(pwd) ? 1 : 0);
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
                        return [4 /*yield*/, react_hot_toast_1["default"].promise(axios_1["default"].post("/api/auth/signup", { name: values.name, email: values.email, password: values.password }, { withCredentials: true }), { loading: "Creating your account…", success: "Account created!", error: function (e) { var _a, _b; return ((_b = (_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || "Signup failed"; } })];
                    case 2:
                        _d.sent();
                        // 🔔 tell Navbar to re-fetch immediately
                        window.dispatchEvent(new Event("auth:changed"));
                        router.replace("/dashboard");
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _d.sent();
                        status = (_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _a === void 0 ? void 0 : _a.status;
                        msg = (_c = (_b = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.error;
                        if (status === 409 || (msg === null || msg === void 0 ? void 0 : msg.toLowerCase().includes("email"))) {
                            form.setError("email", { message: msg || "This email is already in use" });
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
    return (React.createElement("main", { className: "grid min-h-svh grid-cols-1 bg-background text-foreground lg:grid-cols-2" }));
}
exports["default"] = SignupClient;
