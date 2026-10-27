import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";
import { DATABASE_URL } from "@/lib/database";

const adapter = new PrismaBetterSqlite3({ url: DATABASE_URL });

const globalForDb = globalThis as unknown as { db?: PrismaClient };

/** Prisma client, cached on `globalThis` so dev hot reloads reuse one connection. */
export const db = globalForDb.db ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForDb.db = db;
