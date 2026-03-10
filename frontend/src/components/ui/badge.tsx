import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-[color:var(--audit-green)]/45 bg-[color:var(--audit-green)]/12 text-[color:var(--audit-green)]",
        secondary:
          "border-[var(--surface-border)] bg-[var(--surface-muted-bg)] text-[var(--text-secondary)]",
        warning:
          "border-[color:var(--warning-amber)]/45 bg-[color:var(--warning-amber)]/12 text-[color:var(--warning-amber)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
