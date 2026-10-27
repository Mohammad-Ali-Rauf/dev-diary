import path from "node:path";

/**
 * Where the SQLite database lives — `./data/dev-diary.db`, as documented in the
 * README. Resolved against the project root so the Prisma CLI and the runtime
 * client always open the same file.
 */
export const DATABASE_URL = `file:${path.join(
  process.cwd(),
  "data",
  "dev-diary.db",
)}`;
