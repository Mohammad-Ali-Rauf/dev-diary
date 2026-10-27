import { cn } from "cn";
import type { ComponentProps } from "react";
import { fieldClassName } from "@/components/ui/input";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        fieldClassName,
        "min-h-48 resize-y px-3 py-2 text-base md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
