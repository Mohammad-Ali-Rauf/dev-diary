#!/usr/bin/env node
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
/**
 * Applies the SQL in `prisma/migrations` to the database in DATABASE_URL.
 *
 * Deployments use this instead of `prisma migrate deploy` because hosted libsql
 * databases (Turso) cannot be reached by the Prisma CLI. It is safe to re-run:
 * migrations already recorded — by this script or by the Prisma CLI on a file
 * database — are skipped.
 */
import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!url) {
  console.error(
    "DATABASE_URL is not set. Point it at your database (see README → Deploying to Vercel).",
  );
  process.exit(1);
}

const db = createClient({ url, authToken });

await db.execute(`CREATE TABLE IF NOT EXISTS schema_migrations (
  name TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL DEFAULT (datetime('now'))
)`);

const applied = new Set(
  (await db.execute("SELECT name FROM schema_migrations")).rows.map(
    (row) => row.name,
  ),
);

// The Prisma CLI records file-database migrations in its own table — skip those too.
const cliApplied = await db
  .execute("SELECT migration_name FROM _prisma_migrations")
  .catch(() => ({ rows: [] }));
for (const row of cliApplied.rows) applied.add(row.migration_name);

const migrationsDir = path.join(process.cwd(), "prisma", "migrations");
const migrations = readdirSync(migrationsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const name of migrations) {
  if (applied.has(name)) continue;
  const sql = readFileSync(
    path.join(migrationsDir, name, "migration.sql"),
    "utf8",
  );
  await db.executeMultiple(sql);
  await db.execute({
    sql: "INSERT INTO schema_migrations (name) VALUES (?)",
    args: [name],
  });
  console.log(`applied ${name}`);
}

db.close();
