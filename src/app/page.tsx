import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { EntryCard } from "@/components/entry-card";
import { buttonVariants } from "@/components/ui/button";
import { listLogs } from "@/lib/logs";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const recent = (await listLogs({})).slice(0, 3);

  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="shell flex flex-col items-start gap-6 py-20">
          <p className="text-sm font-medium text-primary">
            Daily logs for developers
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Remember <span className="text-primary">what you built</span>, every
            day.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            A plain, fast journal for your engineering days. Write one entry a
            day, tag it, and find it again months later.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/logs/new" className={buttonVariants({ size: "lg" })}>
              Write today's log
            </Link>
            <Link
              href="/logs"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Browse logs
            </Link>
          </div>
        </div>
      </section>

      <section className="shell py-16">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            Recent entries
          </h2>
          <Link
            href="/logs"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all logs
          </Link>
        </div>

        {recent.length > 0 ? (
          <div className="mt-2">
            {recent.map((entry) => (
              <EntryCard key={entry.id} entry={entry} as="h3" />
            ))}
          </div>
        ) : (
          <EmptyState
            action={
              <Link href="/logs/new" className={buttonVariants()}>
                Write your first entry
              </Link>
            }
          >
            No logs yet.
          </EmptyState>
        )}
      </section>
    </>
  );
}
