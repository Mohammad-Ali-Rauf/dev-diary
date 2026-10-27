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

## Data Storage

All logs are stored in a SQLite database at `./data/dev-diary.db`, managed by
Prisma (schema in `prisma/schema.prisma`). With Docker the database lives in the
`dev-diary-data` volume, and migrations are applied automatically on
`docker compose up`.

## License

Apache 2.0
