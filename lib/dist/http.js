"use strict";
exports.__esModule = true;
exports.http = void 0;
// lib/http.ts
var axios_1 = require("axios");
exports.http = axios_1["default"].create({ withCredentials: true });
