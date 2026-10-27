import { NotebookPen } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="shell flex flex-col gap-2 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2">
          <NotebookPen className="size-4" />
          Dev Diary — daily logs for developers.
        </p>
        <p>© 2026 Dev Diary</p>
      </div>
    </footer>
  );
}
