"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var pool = global.pgPool ||
    new pg_1.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });
if (process.env.NODE_ENV !== "production") {
    global.pgPool = pool;
}
exports.default = pool;
/**
 * Singleton Postgres Connection Pool
 *
 * Why?
 * - In Next.js (and other serverless/hot-reload environments),
 *   modules are reloaded frequently during development.
 * - Without a singleton, each reload would create a new Pool instance,
 *   eventually exhausting database connections.
 *
 * How?
 * - We attach the Pool to `global.pgPool`.
 * - On the first run, a new Pool is created and assigned.
 * - On subsequent imports or hot reloads, the existing Pool is reused.
 *
 * Result:
 * - Only one Pool instance per application lifecycle.
 * - Prevents "too many connections" errors in Postgres.
 */
