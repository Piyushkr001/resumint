"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
exports.contactMessagesRelations = exports.contactMessagesTable = exports.contactStatusEnum = exports.contactTopicEnum = exports.passwordResetTokensRelations = exports.passwordResetTokensTable = exports.atsAnalysesRelations = exports.resumeMetricsDailyRelations = exports.resumeMetricsDailyTable = exports.atsAnalysesTable = exports.resumeLinksTable = exports.resumeEducationsTable = exports.resumeExperiencesTable = exports.resumesTable = exports.resumeTemplateEnum = exports.userNotificationsTable = exports.userPreferencesTable = exports.userProfilesTable = exports.refreshTokensTable = exports.usersTable = exports.localeEnum = exports.densityEnum = exports.themeEnum = exports.authProviderEnum = exports.userRoleEnum = void 0;
// config/schema.ts
var drizzle_orm_1 = require("drizzle-orm");
var pg_core_1 = require("drizzle-orm/pg-core");
/* -------------------- Enums -------------------- */
exports.userRoleEnum = pg_core_1.pgEnum("user_role", ["user", "admin"]);
exports.authProviderEnum = pg_core_1.pgEnum("auth_provider", ["password", "google"]);
// ⬇️ NEW: settings-related enums
exports.themeEnum = pg_core_1.pgEnum("theme", ["system", "light", "dark"]);
exports.densityEnum = pg_core_1.pgEnum("density", ["comfortable", "compact"]);
exports.localeEnum = pg_core_1.pgEnum("locale", ["en", "hi", "fr", "de", "es"]);
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
/* -------------------- NEW: Settings tables -------------------- */
// Basic profile info (bio, website)
exports.userProfilesTable = pg_core_1.pgTable("user_profiles", {
    userId: pg_core_1.uuid("user_id")
        .primaryKey()
        .references(function () { return exports.usersTable.id; }, { onDelete: "cascade" }),
    bio: pg_core_1.text("bio"),
    website: pg_core_1.varchar("website", { length: 512 }),
    createdAt: pg_core_1.timestamp("created_at").notNull().defaultNow(),
    updatedAt: pg_core_1.timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$defaultFn(function () { return drizzle_orm_1.sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["now()"], ["now()"]))); })
});
// Theme / language / density
exports.userPreferencesTable = pg_core_1.pgTable("user_preferences", {
    userId: pg_core_1.uuid("user_id")
        .primaryKey()
        .references(function () { return exports.usersTable.id; }, { onDelete: "cascade" }),
    theme: exports.themeEnum("theme").notNull()["default"]("system"),
    locale: exports.localeEnum("locale").notNull()["default"]("en"),
    density: exports.densityEnum("density").notNull()["default"]("comfortable"),
    createdAt: pg_core_1.timestamp("created_at").notNull().defaultNow(),
    updatedAt: pg_core_1.timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$defaultFn(function () { return drizzle_orm_1.sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["now()"], ["now()"]))); })
});
// Email / product notification toggles
exports.userNotificationsTable = pg_core_1.pgTable("user_notifications", {
    userId: pg_core_1.uuid("user_id")
        .primaryKey()
        .references(function () { return exports.usersTable.id; }, { onDelete: "cascade" }),
    productUpdates: pg_core_1.boolean("product_updates").notNull()["default"](true),
    weeklyDigest: pg_core_1.boolean("weekly_digest").notNull()["default"](true),
    atsAlerts: pg_core_1.boolean("ats_alerts").notNull()["default"](true),
    marketing: pg_core_1.boolean("marketing").notNull()["default"](false),
    createdAt: pg_core_1.timestamp("created_at").notNull().defaultNow(),
    updatedAt: pg_core_1.timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$defaultFn(function () { return drizzle_orm_1.sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["now()"], ["now()"]))); })
});
/* -------------------- Resumes -------------------- */
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
        .$defaultFn(function () { return drizzle_orm_1.sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["now()"], ["now()"]))); })
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
    updatedAt: pg_core_1.timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$defaultFn(function () { return drizzle_orm_1.sql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["now()"], ["now()"]))); })
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
    gradeType: pg_core_1.text("grade_type"),
    gradeValue: pg_core_1.text("grade_value"),
    startYear: pg_core_1.smallint("start_year"),
    endYear: pg_core_1.smallint("end_year"),
    achievements: pg_core_1.text("achievements").array(),
    createdAt: pg_core_1.timestamp("created_at").notNull().defaultNow(),
    updatedAt: pg_core_1.timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$defaultFn(function () { return drizzle_orm_1.sql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["now()"], ["now()"]))); })
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
    updatedAt: pg_core_1.timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$defaultFn(function () { return drizzle_orm_1.sql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["now()"], ["now()"]))); })
}, function (t) { return ({
    resumeIdx: pg_core_1.index("resume_links_resume_idx").on(t.resumeId),
    orderIdx: pg_core_1.index("resume_links_order_idx").on(t.order)
}); });
exports.atsAnalysesTable = pg_core_1.pgTable("ats_analyses", {
    id: pg_core_1.uuid("id").defaultRandom().primaryKey(),
    userId: pg_core_1.varchar("user_id", { length: 128 }).notNull(),
    resumeId: pg_core_1.uuid("resume_id").references(function () { return exports.resumesTable.id; }, {
        onDelete: "set null"
    }),
    jdHash: pg_core_1.varchar("jd_hash", { length: 64 }).notNull(),
    score: pg_core_1.smallint("score").notNull(),
    matched: pg_core_1.text("matched").array().notNull()["default"]([]),
    missing: pg_core_1.text("missing").array().notNull()["default"]([]),
    extras: pg_core_1.text("extras").array().notNull()["default"]([]),
    issues: pg_core_1.text("issues").array().notNull()["default"]([]),
    createdAt: pg_core_1.timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull()
});
/* -------------------- Analytics: per-day metrics -------------------- */
/**
 * Aggregates daily counters per resume so your analytics API
 * can build time-series (views/downloads) and filter by template.
 *
 * Note: we keep userId as varchar (like atsAnalysesTable) for consistency.
 */
exports.resumeMetricsDailyTable = pg_core_1.pgTable("resume_metrics_daily", {
    id: pg_core_1.uuid("id").defaultRandom().primaryKey(),
    // Keep in sync with your auth "sub" type. Using varchar for flexibility.
    userId: pg_core_1.varchar("user_id", { length: 128 }).notNull(),
    resumeId: pg_core_1.uuid("resume_id")
        .notNull()
        .references(function () { return exports.resumesTable.id; }, { onDelete: "cascade" }),
    // Store date as DATE (UTC day bucket)
    date: pg_core_1.date("date").notNull(),
    views: pg_core_1.integer("views").notNull()["default"](0),
    downloads: pg_core_1.integer("downloads").notNull()["default"](0)
}, function (t) { return ({
    // Fast lookups
    userIdx: pg_core_1.index("resume_metrics_user_idx").on(t.userId),
    resumeIdx: pg_core_1.index("resume_metrics_resume_idx").on(t.resumeId),
    dateIdx: pg_core_1.index("resume_metrics_date_idx").on(t.date),
    // Ensure only one row per resume per day
    uniqueByResumeDay: pg_core_1.uniqueIndex("uniq_metrics_resume_day").on(t.resumeId, t.date)
}); });
/* -------------------- Relations (additive, no table changes) -------------------- */
exports.resumeMetricsDailyRelations = drizzle_orm_1.relations(exports.resumeMetricsDailyTable, function (_a) {
    var one = _a.one;
    return ({
        resume: one(exports.resumesTable, {
            fields: [exports.resumeMetricsDailyTable.resumeId],
            references: [exports.resumesTable.id]
        })
    });
});
// Optional relation for your existing atsAnalysesTable
exports.atsAnalysesRelations = drizzle_orm_1.relations(exports.atsAnalysesTable, function (_a) {
    var one = _a.one;
    return ({
        resume: one(exports.resumesTable, {
            fields: [exports.atsAnalysesTable.resumeId],
            references: [exports.resumesTable.id]
        })
    });
});
// -------------------- Password reset tokens (OTP-based) --------------------
exports.passwordResetTokensTable = pg_core_1.pgTable("password_reset_tokens", {
    id: pg_core_1.uuid("id").defaultRandom().primaryKey(),
    userId: pg_core_1.uuid("user_id")
        .notNull()
        .references(function () { return exports.usersTable.id; }, { onDelete: "cascade" }),
    // We denormalize the email here for convenience/debugging
    email: pg_core_1.varchar("email", { length: 255 }).notNull(),
    // Hashed OTP (we don't store the raw code)
    otpHash: pg_core_1.varchar("otp_hash", { length: 128 }).notNull(),
    // When this code expires
    expiresAt: pg_core_1.timestamp("expires_at", { withTimezone: true }).notNull(),
    // When it was consumed; null = not used yet
    usedAt: pg_core_1.timestamp("used_at", { withTimezone: true }),
    createdAt: pg_core_1.timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull()
}, function (t) { return ({
    userIdx: pg_core_1.index("password_reset_user_idx").on(t.userId),
    emailIdx: pg_core_1.index("password_reset_email_idx").on(t.email),
    expiresIdx: pg_core_1.index("password_reset_expires_idx").on(t.expiresAt)
}); });
exports.passwordResetTokensRelations = drizzle_orm_1.relations(exports.passwordResetTokensTable, function (_a) {
    var one = _a.one;
    return ({
        user: one(exports.usersTable, {
            fields: [exports.passwordResetTokensTable.userId],
            references: [exports.usersTable.id]
        })
    });
});
exports.contactTopicEnum = pg_core_1.pgEnum("contact_topic", [
    "general",
    "support",
    "bug",
    "billing",
    "feedback",
]);
exports.contactStatusEnum = pg_core_1.pgEnum("contact_status", [
    "new",
    "in_progress",
    "closed",
]);
exports.contactMessagesTable = pg_core_1.pgTable("contact_messages", {
    id: pg_core_1.uuid("id").defaultRandom().primaryKey(),
    // Logged-in user is optional: null for guests
    userId: pg_core_1.uuid("user_id").references(function () { return exports.usersTable.id; }, {
        onDelete: "set null"
    }),
    name: pg_core_1.varchar("name", { length: 255 }).notNull(),
    email: pg_core_1.varchar("email", { length: 255 }).notNull(),
    topic: exports.contactTopicEnum("topic")["default"]("general").notNull(),
    subject: pg_core_1.varchar("subject", { length: 255 }).notNull(),
    message: pg_core_1.text("message").notNull(),
    status: exports.contactStatusEnum("status")["default"]("new").notNull(),
    createdAt: pg_core_1.timestamp("created_at").notNull().defaultNow(),
    updatedAt: pg_core_1.timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$defaultFn(function () { return drizzle_orm_1.sql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["now()"], ["now()"]))); })
}, function (t) { return ({
    userIdx: pg_core_1.index("contact_messages_user_idx").on(t.userId),
    topicIdx: pg_core_1.index("contact_messages_topic_idx").on(t.topic),
    statusIdx: pg_core_1.index("contact_messages_status_idx").on(t.status),
    createdIdx: pg_core_1.index("contact_messages_created_idx").on(t.createdAt)
}); });
exports.contactMessagesRelations = drizzle_orm_1.relations(exports.contactMessagesTable, function (_a) {
    var one = _a.one;
    return ({
        user: one(exports.usersTable, {
            fields: [exports.contactMessagesTable.userId],
            references: [exports.usersTable.id]
        })
    });
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
