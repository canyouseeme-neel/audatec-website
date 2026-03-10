"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type TrustedByItem = {
  company: string;
  industry?: string;
};

export function TrustedByStrip({
  companies,
  items,
}: {
  companies?: string[];
  items?: TrustedByItem[];
}) {
  const list: TrustedByItem[] =
    items && items.length > 0
      ? items
      : companies && companies.length > 0
        ? companies.map((c) => ({ company: c }))
        : [
            { company: "Data Sutram", industry: "Fintech" },
            { company: "RP Infotel", industry: "Telecom" },
            { company: "Alexa Partners", industry: "Collections" },
          ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined" || list.length <= 1) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % list.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [list.length]);

  return (
    <div className="surface-card overflow-hidden rounded-2xl px-6 py-8 sm:px-10 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-caption uppercase tracking-[0.16em] text-audit">Trusted by teams</p>
          <p className="text-body-lg text-soft">
            Built for BFSI, telecom, and collections journeys.
          </p>
        </div>
        <Badge variant="secondary">Enterprise-ready</Badge>
      </div>

      <div className="relative flex min-h-[140px] flex-col items-center justify-center">
        {list.map((item, index) => (
          <div
            key={`${item.company}-${index}`}
            className={cn(
              "absolute inset-x-0 flex flex-col items-center justify-center px-4 transition-all duration-700 ease-out",
              index === activeIndex
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-2 opacity-0",
            )}
            aria-hidden={index !== activeIndex}
          >
            {item.industry && (
              <span
                className="mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]"
                style={{
                  background: "rgba(106,92,255,0.12)",
                  color: "var(--audit-green)",
                }}
              >
                {item.industry}
              </span>
            )}
            <p className="text-center text-subheading font-medium tracking-tight text-[var(--text-primary)] sm:text-heading-sm md:text-heading">
              {item.company}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {list.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300 hover:opacity-80",
              index === activeIndex ? "w-6" : "w-2",
            )}
            style={{
              background:
                index === activeIndex
                  ? "var(--audit-green)"
                  : "rgba(15,23,42,0.18)",
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
