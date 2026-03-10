import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--button-ring-offset)]",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] shadow-[0_10px_26px_var(--button-primary-shadow)] hover:-translate-y-0.5 hover:bg-[var(--button-primary-hover)] focus-visible:ring-[var(--button-ring)]",
        secondary:
          "border border-[var(--surface-border)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] hover:bg-[var(--button-secondary-hover)] focus-visible:ring-[var(--button-ring)]",
        ghost:
          "text-[var(--text-secondary)] hover:bg-[var(--button-secondary-bg)] hover:text-[var(--text-primary)] focus-visible:ring-[var(--button-ring)]",
        outline:
          "border border-[var(--surface-border-strong)] bg-transparent text-[var(--button-outline-text)] hover:border-[var(--audit-green)]/50 hover:text-[var(--button-outline-hover-text)] focus-visible:ring-[var(--button-ring)]",
        warning:
          "bg-[var(--warning-amber)] text-white hover:bg-[#ed8d19] focus-visible:ring-[var(--warning-amber)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
