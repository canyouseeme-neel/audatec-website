import { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader, SiteContainer, SiteSection } from "@/components/site/marketing-primitives";

export type LegalSection = {
  heading: string;
  body: ReactNode;
};

export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <SiteContainer className="py-12 sm:py-14 lg:py-16">
      <SiteSection className="py-0">
        <SectionHeader title={title} description={`Last updated: ${updated}`} />
        <Badge variant="secondary" className="mt-4">
          Legal
        </Badge>
      </SiteSection>
      <SiteSection className="pt-8">
        <div className="space-y-4">
          {sections.map((section) => (
            <Card key={section.heading} className="surface-card border border-[var(--surface-border)]">
              <CardHeader>
                <CardTitle className="text-subheading font-semibold text-[var(--text-primary)]">
                  {section.heading}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-body leading-relaxed text-[var(--text-secondary)] [&_a]:text-[var(--audit-green)] [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:opacity-80 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1">
                {section.body}
              </CardContent>
            </Card>
          ))}
        </div>
      </SiteSection>
    </SiteContainer>
  );
}
