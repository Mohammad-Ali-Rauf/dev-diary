import { Search } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { EntryCard } from "@/components/entry-card";
import { SectionHeading } from "@/components/section-heading";
import { Tag } from "@/components/tag";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listLogs, listTags } from "@/lib/logs";
import { type ListLogsQuery, parseListQuery } from "@/lib/validation";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function LogsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = parseListQuery(await searchParams);
  const [logs, tags] = await Promise.all([listLogs(query), listTags()]);
  const isFiltered = Boolean(query.search || query.tag || query.date);

  return (
    <div className="shell py-12">
      <SectionHeading
        as="h1"
        title="Logs"
        description="Everything you've written, newest first."
        action={
          <Link href="/logs/new" className={buttonVariants()}>
            New entry
          </Link>
        }
      />

      <form
        method="GET"
        action="/logs"
        className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        {query.tag && <input type="hidden" name="tag" value={query.tag} />}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            defaultValue={query.search}
            placeholder="Search logs…"
            className="pl-9"
          />
        </div>
        <Input
          type="date"
          name="date"
          defaultValue={query.date}
          className="sm:w-48"
        />
        <Button type="submit" variant="outline">
          Filter
        </Button>
        {isFiltered && (
          <Link href="/logs" className={buttonVariants({ variant: "ghost" })}>
            Clear
          </Link>
        )}
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link href={filterUrl(query, { tag: undefined })}>
          <Tag selected={!query.tag}>All</Tag>
        </Link>
        {tags.map((tag) => (
          <Link key={tag} href={filterUrl(query, { tag })}>
            <Tag selected={query.tag === tag}>{tag}</Tag>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        {logs.length === 1 ? "1 log" : `${logs.length} logs`}
        {isFiltered ? " matching your filters" : ""}
      </p>

      {logs.length > 0 ? (
        <div className="mt-2">
          {logs.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <EmptyState
          action={
            <Link
              href={isFiltered ? "/logs" : "/logs/new"}
              className={buttonVariants()}
            >
              {isFiltered ? "Clear filters" : "Write your first entry"}
            </Link>
          }
        >
          {isFiltered ? "No logs match your filters." : "No logs yet."}
        </EmptyState>
      )}
    </div>
  );
}

/** The active filters with one of them swapped, as a `/logs` URL. */
function filterUrl(query: ListLogsQuery, next: Partial<ListLogsQuery>) {
  const merged = { ...query, ...next };
  const params = new URLSearchParams();
  if (merged.search) params.set("search", merged.search);
  if (merged.tag) params.set("tag", merged.tag);
  if (merged.date) params.set("date", merged.date);
  const qs = params.toString();
  return qs ? `/logs?${qs}` : "/logs";
}
