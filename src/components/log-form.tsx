import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { LogDto } from "@/lib/logs";

export function LogForm({
  action,
  log,
  submitLabel,
  error,
}: {
  action: (formData: FormData) => Promise<void>;
  log?: LogDto;
  submitLabel: string;
  error?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-6">
      {log && <input type="hidden" name="id" value={log.id} />}

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      <Field label="Title" htmlFor="title">
        <Input
          id="title"
          name="title"
          defaultValue={log?.title}
          placeholder="Shipped the auth refactor"
          required
          autoFocus={!log}
        />
      </Field>

      <Field label="Content" htmlFor="content">
        <Textarea
          id="content"
          name="content"
          defaultValue={log?.content}
          placeholder="What did you work on? What broke? What did you learn?"
          required
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Date" htmlFor="date">
          <Input
            id="date"
            type="date"
            name="date"
            defaultValue={log?.date.slice(0, 10) ?? todayIso()}
          />
        </Field>
        <Field label="Tags" htmlFor="tags">
          <Input
            id="tags"
            name="tags"
            defaultValue={log?.tags.join(", ")}
            placeholder="nextjs, auth"
          />
        </Field>
      </div>

      <div>
        <Button type="submit" size="lg">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
