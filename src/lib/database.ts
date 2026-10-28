import path from "node:path";

/**
 * Where the database lives.
 *
 * Defaults to the local SQLite file used in development and in Docker
 * (`./data/dev-diary.db`). Serverless hosts such as Vercel have no persistent
 * disk, so deployments point DATABASE_URL at a hosted SQLite database (Turso)
 * and supply DATABASE_AUTH_TOKEN.
 */
const localFile = `file:${path.join(process.cwd(), "data", "dev-diary.db")}`;

if (process.env.VERCEL && !process.env.DATABASE_URL) {
  throw new Error(
    "Vercel has no persistent disk for a SQLite file. Set DATABASE_URL to a hosted SQLite database (e.g. Turso) and DATABASE_AUTH_TOKEN — see README → Deploying to Vercel.",
  );
}

export const DATABASE_URL = process.env.DATABASE_URL ?? localFile;

export const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;
