import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader, SiteContainer, SiteSection } from "@/components/site/marketing-primitives";

const legalRoutes = [
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/cookies", label: "Cookie Policy" },
  { href: "/legal/disclaimer", label: "Disclaimer" },
  { href: "/legal/accessibility", label: "Accessibility" },
];

export default function LegalIndexPage() {
  return (
    <SiteContainer className="py-12 sm:py-14 lg:py-16">
      <SiteSection className="py-0">
        <SectionHeader
          title="Legal and policy pages"
          description="Browse the latest legal documents, policy disclosures, and compliance references."
        />
        <Badge variant="secondary" className="mt-4">
          Legal
        </Badge>
      </SiteSection>
      <SiteSection className="pt-8">
        <Card>
          <CardHeader>
            <CardTitle>Policy Center</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {legalRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="block rounded-md border border-[var(--surface-border)] bg-[var(--surface-muted-bg)] px-3 py-2 text-[var(--text-secondary)] no-underline hover:border-[var(--audit-green)]/35 hover:text-[var(--text-primary)]"
              >
                {route.label}
              </Link>
            ))}
          </CardContent>
        </Card>
      </SiteSection>
    </SiteContainer>
  );
}
