// config/schema.ts
import { relations, sql } from "drizzle-orm";
import {
  pgTable, uuid, varchar, timestamp, text, pgEnum, boolean, serial, uniqueIndex,
  integer,
  index,
  smallint,
  date,
} from "drizzle-orm/pg-core";

/* -------------------- Enums -------------------- */
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const authProviderEnum = pgEnum("auth_provider", ["password", "google"]);

/* -------------------- Users -------------------- */
export const usersTable = pgTable("users", {
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
}, (t) => ({
  // email unique (case-insensitive logic handled in code; we store lowercased)
  emailUnique: uniqueIndex("users_email_unique").on(t.email),
  // provider + providerId uniqueness (only for social accounts)
  providerIdUnique: uniqueIndex("users_provider_id_unique").on(t.providerId),
}));

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
    updatedAt: timestamp("updated_at").notNull().defaultNow().$defaultFn(() => sql`now()`),
  },
  (t) => ({
    resumeIdx: index("resume_experiences_resume_idx").on(t.resumeId),
    periodIdx: index("resume_experiences_period_idx").on(t.startDate, t.endDate),
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

    startYear: smallint("start_year"),
    endYear: smallint("end_year"),

    achievements: text("achievements").array(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$defaultFn(() => sql`now()`),
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
    updatedAt: timestamp("updated_at").notNull().defaultNow().$defaultFn(() => sql`now()`),
  },
  (t) => ({
    resumeIdx: index("resume_links_resume_idx").on(t.resumeId),
    orderIdx: index("resume_links_order_idx").on(t.order),
  })
);