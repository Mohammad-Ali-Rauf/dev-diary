import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";
import { DATABASE_AUTH_TOKEN, DATABASE_URL } from "@/lib/database";

const adapter = new PrismaLibSql({
  url: DATABASE_URL,
  authToken: DATABASE_AUTH_TOKEN,
});

const globalForDb = globalThis as unknown as { db?: PrismaClient };

/** Prisma client, cached on `globalThis` so dev hot reloads reuse one connection. */
export const db = globalForDb.db ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForDb.db = db;
