import { LogForm } from "@/components/log-form";
import { SectionHeading } from "@/components/section-heading";
import { createLogAction } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function NewLogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const error = typeof query.error === "string" ? query.error : undefined;

  return (
    <div className="shell max-w-2xl py-12">
      <SectionHeading
        as="h1"
        title="New entry"
        description="One entry a day is enough."
      />
      <div className="mt-8">
        <LogForm
          action={createLogAction}
          submitLabel="Save entry"
          error={error}
        />
      </div>
    </div>
  );
}
