"use strict";
exports.__esModule = true;
exports.db = void 0;
// config/db.ts
var serverless_1 = require("@neondatabase/serverless");
var neon_http_1 = require("drizzle-orm/neon-http");
var schema = require("./schema");
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
}
var sql = serverless_1.neon(process.env.DATABASE_URL);
// Export a singleton Drizzle client (typed with your schema)
exports.db = neon_http_1.drizzle(sql, { schema: schema });
// (No getDb function needed)
// export type DB = typeof db;
