import { BarChart3, Building2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MetricCard,
  SectionHeader,
  SiteContainer,
  SiteSection,
} from "@/components/site/marketing-primitives";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/site/scroll-reveal";
import { getExpertiseMap } from "@/lib/content/load-expertise-map";

export default function CustomersPage() {
  const expertise = getExpertiseMap();

  return (
    <SiteContainer className="py-12 sm:py-14 lg:py-16">
      <SiteSection className="py-0">
        <Reveal>
          <SectionHeader
            badge="Customers"
            title="Trusted across BFSI, telecom, and collections ecosystems"
            description="Audatec combines AI relationship workflows with policy-safe operations across every lifecycle stage."
          />
        </Reveal>
      </SiteSection>

      <SiteSection className="pt-10">
        <StaggerGroup className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {expertise.proofPoints.pastWorks.map((work) => (
            <StaggerItem key={work.id}>
              <Card className="h-full">
                <CardHeader className="space-y-2">
                  <span className="inline-flex items-center gap-2 text-caption uppercase tracking-[0.14em] text-audit">
                    <Building2 className="h-3.5 w-3.5" />
                    {work.industry}
                  </span>
                  <CardTitle>{work.company}</CardTitle>
                  <CardDescription>{work.summary}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-body text-soft">
                  {work.highlights.map((highlight, idx) => (
                    <div key={`${work.id}-${idx}`} className="surface-muted p-3">
                      {highlight}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </SiteSection>

      <SiteSection className="pt-6">
        <Reveal>
          <SectionHeader
            title="Proof metrics"
            description="Operational signals you can track as you scale AI workflows."
            align="center"
          />
        </Reveal>
        {(() => {
          const metrics = expertise.proofPoints.metrics.filter(
            (m) => m.label !== "Market Reach",
          );
          const contextLost = metrics.find((m) => m.label === "Context Lost in Handoffs");
          const lifecycle = metrics.find((m) => m.label === "Lifecycle Coverage");
          const language = metrics.find((m) => m.label === "Language Coverage");
          const knownCustomer = metrics.find((m) => m.label === "Known customer scale");

          const proofOverrides: Record<
            string,
            { value?: string; label?: string; context?: string }
          > = {
            "Lifecycle Coverage": {
              label: "Entire lifecycle coverage",
              context:
                "Lead Gen, Qualification, Sales, Support, and Collection—one continuous flow with full context preserved.",
            },
            "Context Lost in Handoffs": {
              value: "Zero",
              label: "Context lost in handoffs",
              context:
                "Same AI RM across every stage. No handoffs, no dropped context, no repeated stories.",
            },
            "Language Coverage": {
              label: "Regional linguistic expertise",
              context:
                "Indian language support with cultural nuance, regional context, and emotional tone built in.",
            },
          };

          const applyOverrides = (m: (typeof metrics)[0]) => {
            const o = proofOverrides[m.label];
            return o ? { ...m, ...o } : m;
          };

          const topRow = [lifecycle, contextLost, language].filter(
            Boolean,
          ) as (typeof metrics)[0][];
          const bottomRow = [
            {
              value: "2.5M+",
              label: "Calls per Day",
              context:
                "Can support 2.5M+ voice calls daily across Indian languages with native-level fluency and cultural nuance.",
            },
            knownCustomer
              ? {
                  ...knownCustomer,
                  context:
                    "Trusted by enterprises like RP Infotel with 500K+ registered users and production-scale deployments.",
                }
              : null,
          ].filter(Boolean) as Array<{ value: string; label: string; context?: string }>;

          return (
            <div className="mt-8 space-y-6">
              <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {topRow.map((metric) => {
                  const m = applyOverrides(metric);
                  return (
                    <StaggerItem key={m.label}>
                      <MetricCard
                        value={m.value}
                        label={m.label}
                        context={m.context}
                        className="h-full"
                      />
                    </StaggerItem>
                  );
                })}
              </StaggerGroup>
              <StaggerGroup className="flex flex-wrap justify-center gap-4">
                {bottomRow.map((metric) => (
                  <StaggerItem key={metric.label} className="w-full max-w-sm sm:max-w-xs">
                    <MetricCard
                      value={metric.value}
                      label={metric.label}
                      context={metric.context}
                      className="h-full"
                    />
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          );
        })()}
      </SiteSection>

      <SiteSection className="pt-6">
        <Reveal>
          <div className="surface-card rounded-2xl p-6 sm:p-8">
          <p className="inline-flex items-center gap-2 text-caption uppercase tracking-[0.14em] text-audit">
            <BarChart3 className="h-4 w-4" />
            Customer impact
          </p>
          <h3 className="mt-3 text-heading font-semibold tracking-tight sm:text-display-sm">
            Strong AI adoption starts with measurable outcomes
          </h3>
          <p className="mt-3 max-w-3xl text-body leading-relaxed text-soft sm:text-body-lg">
            From conversion to collections, teams deploy Audatec where the cost of
            poor handoffs is high. We keep context persistent and reporting visible
            so operations can improve every cycle.
          </p>
          </div>
        </Reveal>
      </SiteSection>
    </SiteContainer>
  );
}
