import type { ReactNode } from "react";

export function EmptyState({
  children,
  action,
}: {
  children: ReactNode;
  action: ReactNode;
}) {
  return (
    <div className="mt-6 rounded-xl border border-dashed border-border px-6 py-12 text-center">
      <p className="text-muted-foreground">{children}</p>
      <div className="mt-4 flex justify-center">{action}</div>
    </div>
  );
}
