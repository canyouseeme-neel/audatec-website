"use client";

import { useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type TimelineItem = {
  id: string;
  title: string;
  summary: string;
};

export function ExpertiseTimeline({ items }: { items: TimelineItem[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      const cards = rootRef.current.querySelectorAll<HTMLElement>("[data-timeline-item]");
      const line = rootRef.current.querySelector<HTMLElement>("[data-timeline-line]");
      cards.forEach((card) => {
        card.style.opacity = "1";
        card.style.transform = "none";
      });
      if (line) {
        line.style.transform = "none";
      }
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const cards = rootRef.current.querySelectorAll<HTMLElement>("[data-timeline-item]");
    const line = rootRef.current.querySelector<HTMLElement>("[data-timeline-line]");

    const context = gsap.context(() => {
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "power1.out",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 75%",
              end: "bottom 70%",
              scrub: true,
            },
          },
        );
      }

      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          },
        );
      });
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative grid gap-4 pl-8 md:grid-cols-2 md:pl-10">
      <div
        data-timeline-line
        className="absolute bottom-0 left-2 top-0 w-px bg-gradient-to-b from-[var(--audit-green)] via-[var(--text-secondary)] to-transparent md:left-4"
      />
      {items.map((item) => (
        <article
          key={item.id}
          data-timeline-item
          className="surface-card relative rounded-xl p-4"
        >
          <div className="absolute -left-[29px] top-5 h-3 w-3 rounded-full border border-[var(--audit-green)]/60 bg-[var(--audit-green)]/20 md:-left-[41px]" />
          <h3 className="text-body font-semibold text-[var(--text-primary)]">{item.title}</h3>
          <p className="mt-2 text-body text-soft">{item.summary}</p>
        </article>
      ))}
    </div>
  );
}
