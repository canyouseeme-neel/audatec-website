"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/#capabilities", label: "Capabilities" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/customers", label: "Customers" },
  // { href: "/demo", label: "Live Demo" }, // Disabled - will revisit later
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");

  const normalizedPath = useMemo(() => pathname ?? "/", [pathname]);
  const isDemoShell =
    normalizedPath === "/demo" ||
    normalizedPath.startsWith("/demo/") ||
    normalizedPath === "/legacy-playground";

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncHash = () => setActiveHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);

    if (normalizedPath !== "/") {
      return () => window.removeEventListener("hashchange", syncHash);
    }

    const sectionIds = [
      "home",
      "proof",
      "platform",
      "loop",
      "scenarios",
      "capabilities",
      "languages",
      "customers",
      "vision",
      "contact",
    ];

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) {
      return () => window.removeEventListener("hashchange", syncHash);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveHash(`#${visible[0].target.id}`);
        }
      },
      {
        threshold: [0.2, 0.4, 0.6],
        rootMargin: "-32% 0px -48% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", syncHash);
    };
  }, [normalizedPath]);

  const isActiveLink = (href: string) => {
    if (href.startsWith("/#")) {
      if (normalizedPath !== "/") {
        return false;
      }
      const targetHash = href.replace("/", "");
      return activeHash === targetHash;
    }
    return normalizedPath === href;
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <div
      className={cn(
        "min-h-screen audatec-grid-background",
        isDemoShell ? "theme-demo-dark" : "theme-marketing-light",
      )}
    >
      <header className="sticky top-0 z-50 border-b border-[var(--surface-border)] bg-[var(--header-bg)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-semibold tracking-[0.08em] text-audit no-underline">
            AUDATEC
          </Link>
          <nav className="hidden items-center gap-5 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-label transition-colors hover:text-[var(--text-primary)] no-underline",
                  isActiveLink(item.href)
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)]",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:block">
            <Button
              asChild
              size="lg"
              className="rounded-lg px-6 py-3 text-base font-semibold shadow-[0_4px_14px_rgba(106,92,255,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(106,92,255,0.45)]"
            >
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--surface-border-strong)] bg-[var(--surface-bg)] text-[var(--text-primary)] md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="border-t border-[var(--surface-border)] bg-[var(--footer-bg)] px-4 py-4 md:hidden">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile}
                  className={cn(
                    "block rounded-md px-3 py-2 text-label transition-colors",
                    isActiveLink(item.href)
                      ? "bg-[var(--button-secondary-bg)] text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--button-secondary-bg)] hover:text-[var(--text-primary)]",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Button
              asChild
              size="lg"
              className="mt-3 w-full rounded-lg px-6 py-3 text-base font-semibold shadow-[0_4px_14px_rgba(106,92,255,0.35)]"
            >
              <Link href="/contact" onClick={closeMobile}>
                Contact
              </Link>
            </Button>
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="border-t border-[var(--surface-border)] bg-[var(--footer-bg)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm space-y-2">
              <p className="text-caption uppercase tracking-[0.2em] text-audit">Audatec</p>
              <p className="text-label text-[var(--text-secondary)]">
                AI relationship intelligence for lead generation, sales, support, and
                collections with compliance-first visibility.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-body text-[var(--text-secondary)] sm:grid-cols-3">
              <Link href="/#proof" className="no-underline hover:text-[var(--text-primary)]">
                Proof
              </Link>
              <Link href="/#loop" className="no-underline hover:text-[var(--text-primary)]">
                Lifecycle
              </Link>
              <Link
                href="/#capabilities"
                className="no-underline hover:text-[var(--text-primary)]"
              >
                Capabilities
              </Link>
              {/* <Link href="/demo" className="no-underline hover:text-[var(--text-primary)]">
                Demo
              </Link> */}
              <Link
                href="/customers"
                className="no-underline hover:text-[var(--text-primary)]"
              >
                Customers
              </Link>
              <Link href="/contact" className="no-underline hover:text-[var(--text-primary)]">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 border-t border-[var(--surface-border)] pt-5 text-caption text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Audatec Platform</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/legal/privacy" className="no-underline hover:text-[var(--text-primary)]">
                Privacy
              </Link>
              <Link href="/legal/terms" className="no-underline hover:text-[var(--text-primary)]">
                Terms
              </Link>
              <Link
                href="/legal/disclaimer"
                className="no-underline hover:text-[var(--text-primary)]"
              >
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
