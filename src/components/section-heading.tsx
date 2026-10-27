import { cn } from "cn";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  as?: "h1" | "h2";
}) {
  const isPageTitle = Heading === "h1";

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl space-y-3">
        {eyebrow && (
          <p className="text-sm font-semibold tracking-widest text-primary uppercase">
            {eyebrow}
          </p>
        )}
        <Heading
          className={cn(
            "font-semibold tracking-tight text-foreground",
            isPageTitle ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl",
          )}
        >
          {title}
        </Heading>
        {description && (
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
