import { handle, readJson } from "@/lib/http";
import { deleteLog, updateLog } from "@/lib/logs";
import { logIdSchema, updateLogSchema } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

/** PATCH /api/logs/:id — update a log's title, content, date or tags. */
export async function PATCH(request: Request, { params }: RouteContext) {
  return handle(async () => {
    const id = logIdSchema.parse((await params).id);
    const input = updateLogSchema.parse(await readJson(request));
    return Response.json({ log: await updateLog(id, input) });
  });
}

/** DELETE /api/logs/:id — delete a log. */
export async function DELETE(_request: Request, { params }: RouteContext) {
  return handle(async () => {
    const id = logIdSchema.parse((await params).id);
    return Response.json({ log: await deleteLog(id) });
  });
}
