# Dev Diary

A simple web app for developers to log daily work, track progress, and remember what they did.

## Features

- 📝 Write daily logs with title and content
- 🏷️ Tag entries by project or topic
- 🔍 Search and filter through old logs
- 📅 View logs by date
- 🐳 One-command Docker setup

## Tech Stack

- **Next.js** (App Router)
- **Prisma + SQLite** (database)
- **Docker** (containerization)
- **Tailwind CSS** (styling)

## Quick Start

### With Docker (Recommended)

```bash
docker compose up -d
```

Then open http://localhost:3000

### Without Docker

```bash
pnpm install             # installs deps and generates the Prisma client
pnpm prisma migrate dev  # creates ./data/dev-diary.db
pnpm dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/logs` | List logs (supports `?tag=`, `?search=`, `?date=`) |
| POST | `/api/logs` | Create a new log |
| PATCH | `/api/logs/:id` | Update a log |
| DELETE | `/api/logs/:id` | Delete a log |

Logs are returned in a `{ "log": … }` or `{ "logs": […] }` envelope, errors as
`{ "error": "message" }`:

```json
{
  "id": 1,
  "title": "Shipped the auth refactor",
  "content": "Rotated the session layer…",
  "tags": ["nextjs", "auth"],
  "date": "2026-10-28T00:00:00.000Z",
  "createdAt": "2026-10-28T08:12:03.000Z",
  "updatedAt": "2026-10-28T08:12:03.000Z"
}
```

`POST` requires `title` and `content`; `date` (ISO 8601) and `tags` are optional.
`PATCH` accepts any subset of those fields — only the fields you send are touched.

## Deploying to Vercel

Vercel's serverless functions have a read-only, ephemeral filesystem, so the
SQLite file cannot live there — the database has to be hosted. The schema and
queries stay exactly as they are; [Turso](https://turso.tech) hosts the same
SQLite database in the cloud.

1. Create a database and copy its credentials:

   ```bash
   turso db create dev-diary
   turso db show dev-diary --url      # → DATABASE_URL (libsql://…)
   turso db tokens create dev-diary   # → DATABASE_AUTH_TOKEN
   ```

2. Add `DATABASE_URL` and `DATABASE_AUTH_TOKEN` as environment variables in the
   Vercel project settings.

3. Deploy. `vercel-build` applies `prisma/migrations` to the database
   automatically, so `git push` is all you need.

Local development and Docker keep using the file at `./data/dev-diary.db`.

## Data Storage

All logs are stored in a SQLite database at `./data/dev-diary.db`, managed by
Prisma (schema in `prisma/schema.prisma`). With Docker the database lives in the
`dev-diary-data` volume, and migrations are applied automatically on
`docker compose up`. On Vercel the same schema lives in a hosted Turso database.

## License

Apache 2.0
