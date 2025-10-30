// config/schema.ts
import { relations } from "drizzle-orm";
import {
  pgTable, uuid, varchar, timestamp, text, pgEnum, boolean, serial, uniqueIndex,
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
