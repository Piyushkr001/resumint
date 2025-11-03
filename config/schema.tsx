// config/schema.ts
import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  pgEnum,
  boolean,
  serial,
  uniqueIndex,
  integer,
  index,
  smallint,
  date,
} from "drizzle-orm/pg-core";

/* -------------------- Enums -------------------- */
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const authProviderEnum = pgEnum("auth_provider", ["password", "google"]);

// ⬇️ NEW: settings-related enums
export const themeEnum = pgEnum("theme", ["system", "light", "dark"]);
export const densityEnum = pgEnum("density", ["comfortable", "compact"]);
export const localeEnum = pgEnum("locale", ["en", "hi", "fr", "de", "es"]);

/* -------------------- Users -------------------- */
export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(), // keep unique via index below

    // For password users this is set; for Google it can be null
    passwordHash: varchar("password_hash", { length: 255 }),

    // Social auth
    provider: authProviderEnum("provider").default("password").notNull(),
    // Google "sub" claim; unique when present
    providerId: varchar("provider_id", { length: 255 }),

    role: userRoleEnum("role").default("user").notNull(),

    imageUrl: varchar("image_url", { length: 255 }),
    emailVerifiedAt: timestamp("email_verified_at"),
    lastLoginAt: timestamp("last_login_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    // email unique (case-insensitive logic handled in code; we store lowercased)
    emailUnique: uniqueIndex("users_email_unique").on(t.email),
    // provider + providerId uniqueness (only for social accounts)
    providerIdUnique: uniqueIndex("users_provider_id_unique").on(t.providerId),
  })
);

/* -------------------- Refresh Tokens -------------------- */
export const refreshTokensTable = pgTable("refresh_tokens", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  jtiHash: varchar("jti_hash", { length: 64 }).notNull(),
  userAgent: text("user_agent"),
  ip: varchar("ip", { length: 45 }),
  revoked: boolean("revoked").default(false).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* -------------------- NEW: Settings tables -------------------- */

// Basic profile info (bio, website)
export const userProfilesTable = pgTable("user_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  bio: text("bio"),
  website: varchar("website", { length: 512 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$defaultFn(() => sql`now()`),
});

// Theme / language / density
export const userPreferencesTable = pgTable("user_preferences", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  theme: themeEnum("theme").notNull().default("system"),
  locale: localeEnum("locale").notNull().default("en"),
  density: densityEnum("density").notNull().default("comfortable"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$defaultFn(() => sql`now()`),
});

// Email / product notification toggles
export const userNotificationsTable = pgTable("user_notifications", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  productUpdates: boolean("product_updates").notNull().default(true),
  weeklyDigest: boolean("weekly_digest").notNull().default(true),
  atsAlerts: boolean("ats_alerts").notNull().default(true),
  marketing: boolean("marketing").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$defaultFn(() => sql`now()`),
});

/* -------------------- Resumes -------------------- */
export const resumeTemplateEnum = pgEnum("resume_template", [
  "clean",
  "modern",
  "minimal",
  "elegant",
]);

export const resumesTable = pgTable(
  "resumes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    title: varchar("title", { length: 255 }).notNull(),
    role: varchar("role", { length: 120 }).notNull(),
    template: resumeTemplateEnum("template").notNull().default("clean"),

    summary: text("summary"),
    // Store skills as TEXT[] for easy filter & simple JSON-less usage
    skills: text("skills").array(),

    jobDescription: text("job_description"),

    isPublic: boolean("is_public").notNull().default(false),
    atsScore: integer("ats_score").notNull().default(0),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      // keep updated_at fresh on updates (works if you later add a trigger)
      .$defaultFn(() => sql`now()`),
  },
  (table) => ({
    userIdx: index("resumes_user_idx").on(table.userId),
    publicIdx: index("resumes_public_idx").on(table.isPublic),
    updatedIdx: index("resumes_updated_idx").on(table.updatedAt),
  })
);

// Experience rows (work history)
export const resumeExperiencesTable = pgTable(
  "resume_experiences",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    resumeId: uuid("resume_id")
      .notNull()
      .references(() => resumesTable.id, { onDelete: "cascade" }),

    company: varchar("company", { length: 160 }).notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    location: varchar("location", { length: 160 }),

    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    isCurrent: boolean("is_current").notNull().default(false),

    bullets: text("bullets").array(), // optional list of bullet points

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$defaultFn(() => sql`now()`),
  },
  (t) => ({
    resumeIdx: index("resume_experiences_resume_idx").on(t.resumeId),
    periodIdx: index("resume_experiences_period_idx").on(
      t.startDate,
      t.endDate,
    ),
  })
);

// Education rows
export const resumeEducationsTable = pgTable(
  "resume_educations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    resumeId: uuid("resume_id")
      .notNull()
      .references(() => resumesTable.id, { onDelete: "cascade" }),

    school: varchar("school", { length: 160 }).notNull(),
    degree: varchar("degree", { length: 160 }).notNull(),
    field: varchar("field", { length: 160 }),
    location: varchar("location", { length: 160 }),
    gradeType: text("grade_type"), // "percentage" | "cgpa10" | "cgpa4" | "gpa" | "letter"
    gradeValue: text("grade_value"),

    startYear: smallint("start_year"),
    endYear: smallint("end_year"),

    achievements: text("achievements").array(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$defaultFn(() => sql`now()`),
  },
  (t) => ({
    resumeIdx: index("resume_educations_resume_idx").on(t.resumeId),
    yearIdx: index("resume_educations_year_idx").on(t.startYear, t.endYear),
  })
);

// Links (portfolio, GitHub, LinkedIn…)
export const resumeLinksTable = pgTable(
  "resume_links",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    resumeId: uuid("resume_id")
      .notNull()
      .references(() => resumesTable.id, { onDelete: "cascade" }),

    label: varchar("label", { length: 80 }).notNull(),
    url: varchar("url", { length: 512 }).notNull(),
    order: smallint("order").notNull().default(0),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$defaultFn(() => sql`now()`),
  },
  (t) => ({
    resumeIdx: index("resume_links_resume_idx").on(t.resumeId),
    orderIdx: index("resume_links_order_idx").on(t.order),
  })
);

export const atsAnalysesTable = pgTable("ats_analyses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 128 }).notNull(), // keep flexible if your users.id isn't uuid
  resumeId: uuid("resume_id").references(() => resumesTable.id, {
    onDelete: "set null",
  }),
  jdHash: varchar("jd_hash", { length: 64 }).notNull(), // sha256 hex
  score: smallint("score").notNull(), // 0..100
  matched: text("matched").array().notNull().default([]),
  missing: text("missing").array().notNull().default([]),
  extras: text("extras").array().notNull().default([]),
  issues: text("issues").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/* -------------------- Analytics: per-day metrics -------------------- */
/**
 * Aggregates daily counters per resume so your analytics API
 * can build time-series (views/downloads) and filter by template.
 *
 * Note: we keep userId as varchar (like atsAnalysesTable) for consistency.
 */
export const resumeMetricsDailyTable = pgTable(
  "resume_metrics_daily",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Keep in sync with your auth "sub" type. Using varchar for flexibility.
    userId: varchar("user_id", { length: 128 }).notNull(),

    resumeId: uuid("resume_id")
      .notNull()
      .references(() => resumesTable.id, { onDelete: "cascade" }),

    // Store date as DATE (UTC day bucket)
    date: date("date").notNull(),

    views: integer("views").notNull().default(0),
    downloads: integer("downloads").notNull().default(0),
  },
  (t) => ({
    // Fast lookups
    userIdx: index("resume_metrics_user_idx").on(t.userId),
    resumeIdx: index("resume_metrics_resume_idx").on(t.resumeId),
    dateIdx: index("resume_metrics_date_idx").on(t.date),

    // Ensure only one row per resume per day
    uniqueByResumeDay: uniqueIndex("uniq_metrics_resume_day").on(
      t.resumeId,
      t.date,
    ),
  })
);

/* -------------------- Relations (additive, no table changes) -------------------- */
export const resumeMetricsDailyRelations = relations(
  resumeMetricsDailyTable,
  ({ one }) => ({
    resume: one(resumesTable, {
      fields: [resumeMetricsDailyTable.resumeId],
      references: [resumesTable.id],
    }),
  })
);

// Optional relation for your existing atsAnalysesTable
export const atsAnalysesRelations = relations(
  atsAnalysesTable,
  ({ one }) => ({
    resume: one(resumesTable, {
      fields: [atsAnalysesTable.resumeId],
      references: [resumesTable.id],
    }),
  })
);


// -------------------- Password reset tokens (OTP-based) --------------------
export const passwordResetTokensTable = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    // We denormalize the email here for convenience/debugging
    email: varchar("email", { length: 255 }).notNull(),

    // Hashed OTP (we don't store the raw code)
    otpHash: varchar("otp_hash", { length: 128 }).notNull(),

    // When this code expires
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),

    // When it was consumed; null = not used yet
    usedAt: timestamp("used_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    userIdx: index("password_reset_user_idx").on(t.userId),
    emailIdx: index("password_reset_email_idx").on(t.email),
    expiresIdx: index("password_reset_expires_idx").on(t.expiresAt),
  }),
);

export const passwordResetTokensRelations = relations(
  passwordResetTokensTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [passwordResetTokensTable.userId],
      references: [usersTable.id],
    }),
  }),
);


export const contactTopicEnum = pgEnum("contact_topic", [
  "general",
  "support",
  "bug",
  "billing",
  "feedback",
]);

export const contactStatusEnum = pgEnum("contact_status", [
  "new",
  "in_progress",
  "closed",
]);

export const contactMessagesTable = pgTable(
  "contact_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Logged-in user is optional: null for guests
    userId: uuid("user_id").references(() => usersTable.id, {
      onDelete: "set null",
    }),

    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),

    topic: contactTopicEnum("topic").default("general").notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    message: text("message").notNull(),

    status: contactStatusEnum("status").default("new").notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$defaultFn(() => sql`now()`),
  },
  (t) => ({
    userIdx: index("contact_messages_user_idx").on(t.userId),
    topicIdx: index("contact_messages_topic_idx").on(t.topic),
    statusIdx: index("contact_messages_status_idx").on(t.status),
    createdIdx: index("contact_messages_created_idx").on(t.createdAt),
  })
);

export const contactMessagesRelations = relations(
  contactMessagesTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [contactMessagesTable.userId],
      references: [usersTable.id],
    }),
  })
);
