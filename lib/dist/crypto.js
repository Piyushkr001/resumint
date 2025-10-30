"use strict";
exports.__esModule = true;
exports.sha256 = exports.randomJti = void 0;
var crypto_1 = require("crypto");
function randomJti() {
    return crypto_1["default"].randomBytes(32).toString("hex"); // 64-char hex
}
exports.randomJti = randomJti;
function sha256(input) {
    return crypto_1["default"].createHash("sha256").update(input).digest("hex");
}
exports.sha256 = sha256;
