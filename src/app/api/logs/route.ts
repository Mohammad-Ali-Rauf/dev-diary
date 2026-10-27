import { handle, readJson } from "@/lib/http";
import { createLog, listLogs } from "@/lib/logs";
import { createLogSchema, parseListQuery } from "@/lib/validation";

/** GET /api/logs — list logs, filtered by `?tag=`, `?search=` or `?date=`. */
export async function GET(request: Request) {
  return handle(async () => {
    const query = parseListQuery(
      Object.fromEntries(new URL(request.url).searchParams),
    );
    return Response.json({ logs: await listLogs(query) });
  });
}

/** POST /api/logs — create a log. */
export async function POST(request: Request) {
  return handle(async () => {
    const input = createLogSchema.parse(await readJson(request));
    return Response.json({ log: await createLog(input) }, { status: 201 });
  });
}
