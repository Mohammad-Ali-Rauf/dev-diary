import { notFound } from "next/navigation";
import { LogForm } from "@/components/log-form";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { deleteLogAction, updateLogAction } from "@/lib/actions";
import { formatDate } from "@/lib/format";
import { getLog } from "@/lib/logs";
import { logIdSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export default async function LogPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const parsedId = logIdSchema.safeParse((await params).id);
  if (!parsedId.success) notFound();

  const log = await getLog(parsedId.data);
  if (!log) notFound();

  const query = await searchParams;
  const error = typeof query.error === "string" ? query.error : undefined;

  return (
    <div className="shell max-w-2xl py-12">
      <SectionHeading
        as="h1"
        title="Edit entry"
        description={describe(log.date, log.tags)}
      />
      <div className="mt-8">
        <LogForm
          action={updateLogAction}
          log={log}
          submitLabel="Save changes"
          error={error}
        />
      </div>

      <form
        action={deleteLogAction}
        className="mt-12 border-t border-border pt-6"
      >
        <input type="hidden" name="id" value={log.id} />
        <Button type="submit" variant="destructive">
          Delete entry
        </Button>
      </form>
    </div>
  );
}

function describe(date: string, tags: string[]): string {
  return [formatDate(date), ...tags].join(" · ");
}
