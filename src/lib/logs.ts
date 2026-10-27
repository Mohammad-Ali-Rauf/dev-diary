import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { ApiError } from "@/lib/http";
import type {
  CreateLogInput,
  ListLogsQuery,
  UpdateLogInput,
} from "@/lib/validation";

/** A log as the API returns it — also the shape the UI consumes. */
export type LogDto = {
  id: number;
  title: string;
  content: string;
  tags: string[];
  date: string;
  createdAt: string;
  updatedAt: string;
};

type LogWithTags = Prisma.LogGetPayload<{ include: { tags: true } }>;

export async function listLogs(query: ListLogsQuery): Promise<LogDto[]> {
  const logs = await db.log.findMany({
    where: whereClause(query),
    include: { tags: true },
    orderBy: { date: "desc" },
  });
  return logs.map(toLogDto);
}

export async function getLog(id: number): Promise<LogDto | null> {
  const log = await db.log.findUnique({
    where: { id },
    include: { tags: true },
  });
  return log ? toLogDto(log) : null;
}

/** Tag names in use, for the filter chips. */
export async function listTags(): Promise<string[]> {
  const tags = await db.tag.findMany({
    where: { logs: { some: {} } },
    orderBy: { name: "asc" },
    select: { name: true },
  });
  return tags.map((tag) => tag.name);
}

export async function createLog(input: CreateLogInput): Promise<LogDto> {
  const log = await db.log.create({
    data: {
      title: input.title,
      content: input.content,
      date: input.date,
      tags: { connectOrCreate: connectTags(input.tags) },
    },
    include: { tags: true },
  });
  return toLogDto(log);
}

export async function updateLog(
  id: number,
  input: UpdateLogInput,
): Promise<LogDto> {
  if (Object.keys(input).length === 0) {
    throw new ApiError(400, "No fields to update");
  }

  const { tags, ...fields } = input;
  const log = await db.log.update({
    where: { id },
    data: {
      ...fields,
      ...(tags
        ? { tags: { set: [], connectOrCreate: connectTags(tags) } }
        : {}),
    },
    include: { tags: true },
  });
  return toLogDto(log);
}

export async function deleteLog(id: number): Promise<LogDto> {
  const log = await db.log.delete({ where: { id }, include: { tags: true } });
  return toLogDto(log);
}

export function toLogDto(log: LogWithTags): LogDto {
  return {
    id: log.id,
    title: log.title,
    content: log.content,
    tags: log.tags.map((tag) => tag.name),
    date: log.date.toISOString(),
    createdAt: log.createdAt.toISOString(),
    updatedAt: log.updatedAt.toISOString(),
  };
}

function whereClause(query: ListLogsQuery): Prisma.LogWhereInput {
  return {
    ...(query.tag ? { tags: { some: { name: query.tag } } } : {}),
    ...(query.search
      ? {
          OR: [
            { title: { contains: query.search } },
            { content: { contains: query.search } },
          ],
        }
      : {}),
    ...(query.date ? { date: dayRange(query.date) } : {}),
  };
}

/** The UTC day `YYYY-MM-DD` covers, as an inclusive/exclusive range. */
function dayRange(date: string) {
  const start = new Date(`${date}T00:00:00.000Z`);
  return { gte: start, lt: new Date(start.getTime() + 86_400_000) };
}

function connectTags(names: string[]) {
  return [...new Set(names)].map((name) => ({
    where: { name },
    create: { name },
  }));
}
