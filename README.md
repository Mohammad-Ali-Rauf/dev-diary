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
- **SQLite** (database)
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
nub install
nub run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/logs` | List logs (supports `?tag=`, `?search=`, `?date=`) |
| POST | `/api/logs` | Create a new log |
| PATCH | `/api/logs/:id` | Update a log |
| DELETE | `/api/logs/:id` | Delete a log |

## Data Storage

All logs are stored in a SQLite database at `./data/dev-diary.db`.

## License

Apache 2.0
