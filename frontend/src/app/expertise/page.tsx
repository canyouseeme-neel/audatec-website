import { Braces, DatabaseZap, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExpertiseTimeline } from "@/components/site/expertise-timeline";
import {
  FeatureCard,
  MetricCard,
  SectionHeader,
  SiteContainer,
  SiteSection,
} from "@/components/site/marketing-primitives";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/site/scroll-reveal";
import { getExpertiseMap } from "@/lib/content/load-expertise-map";

export default function ExpertisePage() {
  const expertise = getExpertiseMap();

  return (
    <SiteContainer className="py-12 sm:py-14 lg:py-16">
      <SiteSection className="py-0">
        <Reveal>
          <SectionHeader
            badge="Expertise"
            title="Audit-grade RM intelligence for growth and compliance"
            description={expertise.company.about}
          />
        </Reveal>
      </SiteSection>

      <SiteSection className="pt-10">
        <StaggerGroup className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {expertise.proofPoints.metrics.slice(0, 4).map((metric) => (
            <StaggerItem key={metric.label}>
              <MetricCard value={metric.value} label={metric.label} context={metric.context} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </SiteSection>

      <SiteSection className="pt-6">
        <Reveal>
          <SectionHeader
            title="Relationship intelligence timeline"
            description="The timeline below captures how Audatec creates continuity from first touch to downstream collections and compliance checks."
          />
        </Reveal>
        <Reveal delay={0.05} className="mt-8">
          <ExpertiseTimeline
            items={expertise.expertisePillars.map((pillar) => ({
              id: pillar.id,
              title: pillar.title,
              summary: pillar.summary,
            }))}
          />
        </Reveal>
      </SiteSection>

      <SiteSection className="pt-6">
        <Reveal>
          <SectionHeader
            title="Offerings and channels"
            description="Deploy channel-specific experiences while keeping a single customer memory layer."
          />
        </Reveal>
        <StaggerGroup className="mt-8 grid gap-4 md:grid-cols-3">
          {expertise.offerings.map((offering) => (
            <StaggerItem key={offering.id}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{offering.name}</CardTitle>
                  <CardDescription>{offering.lifecycleStages.join(" -> ")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-body text-soft">
                  <p>{offering.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {offering.channels.map((channel) => (
                      <Badge key={channel} variant="secondary">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </SiteSection>

      <SiteSection className="pt-6">
        <Reveal>
          <SectionHeader
            title="Automation and compliance claims"
            description="Build operational confidence with explicit controls, transparent audit paths, and CRM-linked outcomes."
          />
        </Reveal>
        <StaggerGroup className="mt-8 grid gap-4 lg:grid-cols-2">
          {expertise.rmCrmAutomationClaims.map((claim) => (
            <StaggerItem key={claim.id}>
              <FeatureCard
                title={claim.category.toUpperCase()}
                description={claim.text}
                icon={<DatabaseZap className="h-4 w-4" />}
              />
            </StaggerItem>
          ))}
          {expertise.complianceAuditClaims.map((claim) => (
            <StaggerItem key={claim.id}>
              <FeatureCard
                title={claim.category.toUpperCase()}
                description={claim.text}
                icon={
                  claim.category === "security" ? (
                    <ShieldCheck className="h-4 w-4" />
                  ) : (
                    <Braces className="h-4 w-4" />
                  )
                }
              />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </SiteSection>
    </SiteContainer>
  );
}
