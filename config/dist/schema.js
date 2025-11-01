"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
exports.resumeLinksTable = exports.resumeEducationsTable = exports.resumeExperiencesTable = exports.resumesTable = exports.resumeTemplateEnum = exports.refreshTokensTable = exports.usersTable = exports.authProviderEnum = exports.userRoleEnum = void 0;
// config/schema.ts
var drizzle_orm_1 = require("drizzle-orm");
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
exports.resumeTemplateEnum = pg_core_1.pgEnum("resume_template", [
    "clean",
    "modern",
    "minimal",
    "elegant",
]);
exports.resumesTable = pg_core_1.pgTable("resumes", {
    id: pg_core_1.uuid("id").defaultRandom().primaryKey(),
    userId: pg_core_1.uuid("user_id")
        .notNull()
        .references(function () { return exports.usersTable.id; }, { onDelete: "cascade" }),
    title: pg_core_1.varchar("title", { length: 255 }).notNull(),
    role: pg_core_1.varchar("role", { length: 120 }).notNull(),
    template: exports.resumeTemplateEnum("template").notNull()["default"]("clean"),
    summary: pg_core_1.text("summary"),
    // Store skills as TEXT[] for easy filter & simple JSON-less usage
    skills: pg_core_1.text("skills").array(),
    jobDescription: pg_core_1.text("job_description"),
    isPublic: pg_core_1.boolean("is_public").notNull()["default"](false),
    atsScore: pg_core_1.integer("ats_score").notNull()["default"](0),
    createdAt: pg_core_1.timestamp("created_at").notNull().defaultNow(),
    updatedAt: pg_core_1.timestamp("updated_at")
        .notNull()
        .defaultNow()
        // keep updated_at fresh on updates (works if you later add a trigger)
        .$defaultFn(function () { return drizzle_orm_1.sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["now()"], ["now()"]))); })
}, function (table) { return ({
    userIdx: pg_core_1.index("resumes_user_idx").on(table.userId),
    publicIdx: pg_core_1.index("resumes_public_idx").on(table.isPublic),
    updatedIdx: pg_core_1.index("resumes_updated_idx").on(table.updatedAt)
}); });
// Experience rows (work history)
exports.resumeExperiencesTable = pg_core_1.pgTable("resume_experiences", {
    id: pg_core_1.uuid("id").defaultRandom().primaryKey(),
    resumeId: pg_core_1.uuid("resume_id")
        .notNull()
        .references(function () { return exports.resumesTable.id; }, { onDelete: "cascade" }),
    company: pg_core_1.varchar("company", { length: 160 }).notNull(),
    title: pg_core_1.varchar("title", { length: 160 }).notNull(),
    location: pg_core_1.varchar("location", { length: 160 }),
    startDate: pg_core_1.date("start_date").notNull(),
    endDate: pg_core_1.date("end_date"),
    isCurrent: pg_core_1.boolean("is_current").notNull()["default"](false),
    bullets: pg_core_1.text("bullets").array(),
    createdAt: pg_core_1.timestamp("created_at").notNull().defaultNow(),
    updatedAt: pg_core_1.timestamp("updated_at").notNull().defaultNow().$defaultFn(function () { return drizzle_orm_1.sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["now()"], ["now()"]))); })
}, function (t) { return ({
    resumeIdx: pg_core_1.index("resume_experiences_resume_idx").on(t.resumeId),
    periodIdx: pg_core_1.index("resume_experiences_period_idx").on(t.startDate, t.endDate)
}); });
// Education rows
exports.resumeEducationsTable = pg_core_1.pgTable("resume_educations", {
    id: pg_core_1.uuid("id").defaultRandom().primaryKey(),
    resumeId: pg_core_1.uuid("resume_id")
        .notNull()
        .references(function () { return exports.resumesTable.id; }, { onDelete: "cascade" }),
    school: pg_core_1.varchar("school", { length: 160 }).notNull(),
    degree: pg_core_1.varchar("degree", { length: 160 }).notNull(),
    field: pg_core_1.varchar("field", { length: 160 }),
    location: pg_core_1.varchar("location", { length: 160 }),
    startYear: pg_core_1.smallint("start_year"),
    endYear: pg_core_1.smallint("end_year"),
    achievements: pg_core_1.text("achievements").array(),
    createdAt: pg_core_1.timestamp("created_at").notNull().defaultNow(),
    updatedAt: pg_core_1.timestamp("updated_at").notNull().defaultNow().$defaultFn(function () { return drizzle_orm_1.sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["now()"], ["now()"]))); })
}, function (t) { return ({
    resumeIdx: pg_core_1.index("resume_educations_resume_idx").on(t.resumeId),
    yearIdx: pg_core_1.index("resume_educations_year_idx").on(t.startYear, t.endYear)
}); });
// Links (portfolio, GitHub, LinkedIn…)
exports.resumeLinksTable = pg_core_1.pgTable("resume_links", {
    id: pg_core_1.uuid("id").defaultRandom().primaryKey(),
    resumeId: pg_core_1.uuid("resume_id")
        .notNull()
        .references(function () { return exports.resumesTable.id; }, { onDelete: "cascade" }),
    label: pg_core_1.varchar("label", { length: 80 }).notNull(),
    url: pg_core_1.varchar("url", { length: 512 }).notNull(),
    order: pg_core_1.smallint("order").notNull()["default"](0),
    createdAt: pg_core_1.timestamp("created_at").notNull().defaultNow(),
    updatedAt: pg_core_1.timestamp("updated_at").notNull().defaultNow().$defaultFn(function () { return drizzle_orm_1.sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["now()"], ["now()"]))); })
}, function (t) { return ({
    resumeIdx: pg_core_1.index("resume_links_resume_idx").on(t.resumeId),
    orderIdx: pg_core_1.index("resume_links_order_idx").on(t.order)
}); });
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
