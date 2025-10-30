"use strict";
exports.__esModule = true;
exports.refreshTokensTable = exports.usersTable = exports.authProviderEnum = exports.userRoleEnum = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
/* -------------------- Enums -------------------- */
exports.userRoleEnum = pg_core_1.pgEnum("user_role", ["user", "admin"]);
exports.authProviderEnum = pg_core_1.pgEnum("auth_provider", ["password", "google"]);
/* -------------------- Users -------------------- */
exports.usersTable = pg_core_1.pgTable("users", {
    id: pg_core_1.uuid("id").defaultRandom().primaryKey(),
    name: pg_core_1.varchar("name", { length: 255 }).notNull(),
    email: pg_core_1.varchar("email", { length: 255 }).notNull(),
    // For password users this is set; for Google it can be null
    passwordHash: pg_core_1.varchar("password_hash", { length: 255 }),
    // Social auth
    provider: exports.authProviderEnum("provider")["default"]("password").notNull(),
    // Google "sub" claim; unique when present
    providerId: pg_core_1.varchar("provider_id", { length: 255 }),
    role: exports.userRoleEnum("role")["default"]("user").notNull(),
    imageUrl: pg_core_1.varchar("image_url", { length: 255 }),
    emailVerifiedAt: pg_core_1.timestamp("email_verified_at"),
    lastLoginAt: pg_core_1.timestamp("last_login_at"),
    createdAt: pg_core_1.timestamp("created_at").defaultNow().notNull(),
    updatedAt: pg_core_1.timestamp("updated_at").defaultNow().notNull()
}, function (t) { return ({
    // email unique (case-insensitive logic handled in code; we store lowercased)
    emailUnique: pg_core_1.uniqueIndex("users_email_unique").on(t.email),
    // provider + providerId uniqueness (only for social accounts)
    providerIdUnique: pg_core_1.uniqueIndex("users_provider_id_unique").on(t.providerId)
}); });
/* -------------------- Refresh Tokens -------------------- */
exports.refreshTokensTable = pg_core_1.pgTable("refresh_tokens", {
    id: pg_core_1.serial("id").primaryKey(),
    userId: pg_core_1.uuid("user_id")
        .notNull()
        .references(function () { return exports.usersTable.id; }, { onDelete: "cascade" }),
    jtiHash: pg_core_1.varchar("jti_hash", { length: 64 }).notNull(),
    userAgent: pg_core_1.text("user_agent"),
    ip: pg_core_1.varchar("ip", { length: 45 }),
    revoked: pg_core_1.boolean("revoked")["default"](false).notNull(),
    expiresAt: pg_core_1.timestamp("expires_at").notNull(),
    createdAt: pg_core_1.timestamp("created_at").defaultNow().notNull()
});
