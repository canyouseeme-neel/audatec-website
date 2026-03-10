import { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SiteContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function SiteSection({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("py-12 sm:py-16 lg:py-20", className)}>
      {children}
    </section>
  );
}

export function SectionHeader({
  badge,
  title,
  description,
  align = "left",
  className,
}: {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "space-y-4",
        centered && "mx-auto max-w-3xl text-center",
        className,
      )}
    >
      {badge && <Badge>{badge}</Badge>}
      <h2 className="section-title font-semibold text-[var(--text-primary)]">{title}</h2>
      {description && <p className="section-copy max-w-3xl">{description}</p>}
    </div>
  );
}

export function MetricCard({
  value,
  label,
  context,
  className,
}: {
  value: string;
  label: string;
  context?: string;
  className?: string;
}) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="text-display-sm text-audit sm:text-display">{value}</CardTitle>
        <CardDescription className="text-body font-medium text-[var(--text-primary)]">
          {label}
        </CardDescription>
      </CardHeader>
      {context && (
        <CardContent>
          <p className="text-body leading-relaxed text-soft">{context}</p>
        </CardContent>
      )}
    </Card>
  );
}

export function FeatureCard({
  title,
  description,
  icon,
  className,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="space-y-3">
        {icon && (
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--audit-green)]/30 bg-[var(--audit-green)]/10 text-audit">
            {icon}
          </div>
        )}
        <CardTitle className="text-subheading">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-body leading-relaxed text-soft">{description}</p>
      </CardContent>
    </Card>
  );
}
