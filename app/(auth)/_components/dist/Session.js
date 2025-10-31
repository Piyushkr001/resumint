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
exports.notifyAuthChanged = exports.useAuth = exports.AuthProvider = void 0;
var React = require("react");
var swr_1 = require("swr");
var fetcher = function (url) {
    return fetch(url, { credentials: "include", cache: "no-store" })
        .then(function (r) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, (r.ok ? r.json() : { user: null })];
    }); }); })["catch"](function () { return ({ user: null }); });
};
var AuthCtx = React.createContext(null);
function AuthProvider(_a) {
    var _this = this;
    var _b;
    var children = _a.children;
    var _c = swr_1["default"]("/api/auth/me", fetcher, {
        revalidateOnFocus: false,
        shouldRetryOnError: false
    }), data = _c.data, isLoading = _c.isLoading, mutate = _c.mutate;
    var _d = React.useState((_b = data === null || data === void 0 ? void 0 : data.user) !== null && _b !== void 0 ? _b : null), user = _d[0], setUserState = _d[1];
    // sync when /api/auth/me changes
    React.useEffect(function () {
        var _a;
        setUserState((_a = data === null || data === void 0 ? void 0 : data.user) !== null && _a !== void 0 ? _a : null);
    }, [data === null || data === void 0 ? void 0 : data.user]);
    var setUser = React.useCallback(function (u) {
        setUserState(u);
        // Optimistic SWR cache update so other consumers see it too
        mutate({ user: u }, false);
        // also poke any consumers not using context but hitting SWR directly
        swr_1.mutate("/api/auth/me", { user: u }, false);
    }, [mutate]);
    var refresh = React.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mutate()];
                case 1:
                    _a.sent(); // refetch /api/auth/me
                    return [2 /*return*/];
            }
        });
    }); }, [mutate]);
    return (React.createElement(AuthCtx.Provider, { value: { user: user, loading: isLoading, setUser: setUser, refresh: refresh } }, children));
}
exports.AuthProvider = AuthProvider;
function useAuth() {
    var ctx = React.useContext(AuthCtx);
    if (!ctx)
        throw new Error("useAuth must be used inside <AuthProvider />");
    return ctx;
}
exports.useAuth = useAuth;
// Optional: helper if you still want a window event
function notifyAuthChanged() {
    swr_1.mutate("/api/auth/me");
    window.dispatchEvent(new Event("auth:changed"));
}
exports.notifyAuthChanged = notifyAuthChanged;
