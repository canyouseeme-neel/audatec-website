import { ArrowRight, Sparkles, Workflow } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FeatureCard,
  SectionHeader,
  SiteContainer,
  SiteSection,
} from "@/components/site/marketing-primitives";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/site/scroll-reveal";
import { getExpertiseMap } from "@/lib/content/load-expertise-map";

export default function HowItWorksPage() {
  const expertise = getExpertiseMap();

  return (
    <SiteContainer className="py-12 sm:py-14 lg:py-16">
      <SiteSection className="py-0">
        <Reveal>
          <SectionHeader
            badge="How It Works"
            title={expertise.howItWorks.headline}
            description="The Audatec lifecycle combines conversation orchestration, compliance visibility, and automatic CRM traceability in one loop."
          />
        </Reveal>
      </SiteSection>

      <SiteSection className="pt-10">
        <StaggerGroup className="grid gap-4 md:grid-cols-3">
          {expertise.howItWorks.steps.map((step, index) => (
            <StaggerItem key={step.id}>
              <Card className="h-full">
                <CardHeader className="space-y-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--audit-green)]/40 bg-[var(--audit-green)]/10 text-caption font-semibold text-audit">
                    {index + 1}
                  </span>
                  <CardTitle className="text-heading-sm">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-soft">
                  <p>{step.summary}</p>
                  {index < expertise.howItWorks.steps.length - 1 && (
                    <div className="inline-flex items-center gap-1 text-caption uppercase tracking-[0.12em] text-muted">
                      Next <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </SiteSection>

      <SiteSection className="pt-6">
        <Reveal>
          <SectionHeader
            title="System highlights"
            description="These controls keep the workflow measurable, policy-safe, and production-ready."
          />
        </Reveal>
        <StaggerGroup className="mt-8 grid gap-4 md:grid-cols-2">
          {expertise.howItWorks.highlights.map((highlight, index) => (
            <StaggerItem key={highlight.id}>
              <FeatureCard
                title={highlight.category.toUpperCase()}
                description={highlight.text}
                icon={
                  index === 0 ? (
                    <Workflow className="h-4 w-4" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )
                }
              />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </SiteSection>

      <SiteSection className="pt-6">
        <Reveal>
          <div className="surface-card rounded-2xl p-6 sm:p-8">
          <Badge>Execution Principle</Badge>
          <h3 className="mt-4 text-heading font-semibold tracking-tight sm:text-display-sm">
            Keep the same context from first conversation to final action
          </h3>
          <p className="mt-3 max-w-3xl text-body leading-relaxed text-soft sm:text-body-lg">
            Strong AI voice systems are not only about model quality. They are about
            continuity: same memory layer, same compliance posture, and clear
            operator visibility across every lifecycle stage.
          </p>
          </div>
        </Reveal>
      </SiteSection>
    </SiteContainer>
  );
}
