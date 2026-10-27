import Link from "next/link";
import { Tag } from "@/components/tag";
import { excerpt, formatDate } from "@/lib/format";
import type { LogDto } from "@/lib/logs";

export function EntryCard({
  entry,
  as: Heading = "h2",
}: {
  entry: LogDto;
  as?: "h2" | "h3";
}) {
  return (
    <article className="flex flex-col gap-2 border-b border-border py-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <time
          dateTime={entry.date}
          className="text-xs font-medium text-muted-foreground"
        >
          {formatDate(entry.date)}
        </time>
        {entry.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
      <Heading className="text-lg font-semibold tracking-tight text-foreground">
        <Link
          href={`/logs/${entry.id}`}
          className="transition-colors hover:text-primary"
        >
          {entry.title}
        </Link>
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {excerpt(entry.content)}
      </p>
    </article>
  );
}
