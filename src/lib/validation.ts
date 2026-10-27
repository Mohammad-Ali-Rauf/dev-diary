import { z } from "zod";

const logFields = {
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1),
  /** ISO 8601 timestamp for the day the entry is for. Defaults to now. */
  date: z.coerce.date().optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(25),
};

export const createLogSchema = z.object({
  ...logFields,
  tags: logFields.tags.default([]),
});

/** Fields are optional — and only the ones sent are touched. */
export const updateLogSchema = z.object(logFields).partial();

export const logIdSchema = z.coerce.number().int().positive();

const listLogsQuerySchema = z.object({
  tag: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD")
    .optional(),
});

export type CreateLogInput = z.infer<typeof createLogSchema>;
export type UpdateLogInput = z.infer<typeof updateLogSchema>;
export type ListLogsQuery = z.infer<typeof listLogsQuerySchema>;

/** Query params as Next hands them to a page, or as `URLSearchParams` yields. */
type QueryParams = Record<string, string | string[] | undefined>;

/** Parses `?key=value` params, treating blank and repeated values loosely. */
export function parseListQuery(params: QueryParams): ListLogsQuery {
  const present: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    const text = Array.isArray(value) ? value[0] : value;
    if (text?.trim()) present[key] = text;
  }
  return listLogsQuerySchema.parse(present);
}

/** Reads a log form's fields into the shape the log schemas validate. */
export function logInputFromFormData(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    content: String(formData.get("content") ?? ""),
    date: String(formData.get("date") ?? "") || undefined,
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  };
}
