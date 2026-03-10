import Link from "next/link";
import {
  ArrowRight,
  Brain,
  BrainCircuit,
  CheckCircle2,
  Globe2,
  LineChart,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AudatecOrb } from "@/components/site/audatec-orb";
import { HomeDemoPreview } from "@/components/site/home-demo-preview";
import {
  FeatureCard,
  MetricCard,
  SectionHeader,
  SiteContainer,
  SiteSection,
} from "@/components/site/marketing-primitives";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/site/scroll-reveal";
import { TrustedByStrip } from "@/components/site/trusted-by-strip";
import { CallRecordingsShowcase } from "@/components/site/call-recordings-showcase";
import { getExpertiseMap } from "@/lib/content/load-expertise-map";
import { isDemoEnabled } from "@/lib/feature-flags";

export default function HomePage() {
  const expertiseMap = getExpertiseMap();
  const heroMetrics = expertiseMap.proofPoints.metrics.slice(0, 3);
  const topWorks = expertiseMap.proofPoints.pastWorks.slice(0, 3);
  const integrations = expertiseMap.rmCrmAutomationClaims
    .filter((c) => c.category !== "crm")
    .slice(0, 2);
  const compliance = expertiseMap.complianceAuditClaims
    .filter((c) => c.category !== "legal")
    .slice(0, 2);
  const ctaPrimaryHref = isDemoEnabled ? "/demo" : "/contact";
  const ctaPrimaryText = isDemoEnabled ? "Open Live Demo" : "Book a Strategy Call";
  const lifecycleStages = [
    {
      id: "lead-gen",
      title: "Lead Gen",
      summary: "Outbound, inbound, referrals - capture every opportunity.",
    },
    {
      id: "qualification",
      title: "Qualification",
      summary: "Score, segment, and nurture until each lead is sales-ready.",
    },
    {
      id: "sales",
      title: "Sales",
      summary: "Present, negotiate, and close with context-aware intelligence.",
    },
    {
      id: "support",
      title: "Support",
      summary: "Resolve and retain with the same relationship memory layer.",
    },
    {
      id: "collection",
      title: "Collection",
      summary: "Recover payments with empathy, policy controls, and continuity.",
    },
  ];

  const stageComparisons = [
    {
      title: "Lead Gen -> Qualification",
      traditional: "Cold calls, fragmented CRM updates, and stale lead queues.",
      aiRm: "Continuous engagement, scoring, and nurturing with full history.",
    },
    {
      title: "Sales -> Support",
      traditional: "Context loss at handoff; customers repeat their story.",
      aiRm: "Same intelligence handles post-sale with complete relationship memory.",
    },
    {
      title: "Support -> Collection",
      traditional: "Collections starts from zero and tone often degrades trust.",
      aiRm: "Adaptive tone with payment and support history carried forward.",
    },
  ];

  const scenarioBlocks = [
    {
      id: "sales",
      title: "Sales",
      lead: "Convert more leads efficiently without cold-call fatigue.",
      points: [
        "Multi-channel outreach across voice, SMS, and WhatsApp.",
        "Objection handling trained on your playbook.",
        "Real-time CRM logging with escalation to human reps.",
      ],
    },
    {
      id: "support",
      title: "Support",
      lead: "Resolve issues faster with full customer context.",
      points: [
        "Prior interactions and purchase history remain available.",
        "Proactive outreach for at-risk customers.",
        "CSAT capture and structured resolution tracking.",
      ],
    },
    {
      id: "collections",
      title: "Collections",
      lead: "Recover payments with context-aware conversations.",
      points: [
        "Adaptive tone for hardship and commitment follow-up.",
        "Automated reminders across preferred channels.",
        "Negotiation and promise-to-pay tracking in one loop.",
      ],
    },
  ];

  const languageCards = [
    ["हिन्दी", "Hindi"],
    ["తెలుగు", "Telugu"],
    ["தமிழ்", "Tamil"],
    ["বাংলা", "Bengali"],
    ["मराठी", "Marathi"],
    ["ಕನ್ನಡ", "Kannada"],
  ];

  return (
    <div className="pb-20">
      <SiteContainer>
        <SiteSection id="home" className="pt-14 sm:pt-16 lg:pt-20">
          <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
            <Reveal className="space-y-6">
              <p className="inline-flex items-center rounded-full border border-[var(--audit-green)]/35 bg-[var(--audit-green)]/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-audit">
                AI Relationship Managers
              </p>
              <h1 className="hero-title max-w-4xl font-semibold text-[var(--text-primary)]">
                One AI RM.
                <span className="hero-accent-text block">The Entire Customer Loop.</span>
              </h1>
              <p className="hero-subtitle max-w-2xl">
                From first touch to payment collection, Audatec runs lead generation,
                qualification, sales, support, and collections as one context-aware
                system.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href={ctaPrimaryHref}>{ctaPrimaryText}</Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/how-it-works">See How It Works</Link>
                </Button>
              </div>
              <StaggerGroup className="grid gap-3 sm:grid-cols-3">
                {heroMetrics.map((metric) => {
                  const heroOverrides: Record<
                    string,
                    { value: string; label: string }
                  > = {
                    "Lifecycle Coverage": {
                      value: metric.value,
                      label: "Entire customer lifecycle coverage",
                    },
                    "Context Lost in Handoffs": {
                      value: "Zero",
                      label: "Context lost in handoffs—same RM",
                    },
                    "Language Coverage": {
                      value: metric.value,
                      label: "Regional Language expertise",
                    },
                  };
                  const o = heroOverrides[metric.label];
                  const displayValue = o?.value ?? metric.value;
                  const displayLabel = o?.label ?? metric.label;
                  return (
                    <StaggerItem key={metric.label} className="h-full">
                      <div className="surface-muted flex h-full min-h-[110px] flex-col rounded-xl p-4">
                        <p className="text-display-sm font-semibold text-[var(--text-primary)]">
                          {displayValue}
                        </p>
                        <p className="mt-1 min-h-[2.75em] text-caption uppercase leading-relaxed tracking-[0.12em] text-muted">
                          {displayLabel}
                        </p>
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerGroup>
              <StaggerGroup className="flex flex-wrap gap-2">
                {lifecycleStages.map((stage) => (
                  <StaggerItem key={stage.id}>
                    <span className="feature-chip inline-flex items-center rounded-full px-3 py-1 text-caption font-medium">
                      {stage.title}
                    </span>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </Reveal>

            <Reveal delay={0.08} className="space-y-4">
              <HomeDemoPreview />
              <AudatecOrb className="h-[240px] w-full animate-float-up-soft" pulse={0.32} />
            </Reveal>
          </div>
        </SiteSection>

        <SiteSection id="proof" className="pt-3">
          <Reveal>
            <TrustedByStrip
              items={topWorks.map((w) => ({
                company: w.company,
                industry: w.industry,
              }))}
            />
          </Reveal>
          <Reveal delay={0.08} className="mt-10">
            <SectionHeader
              badge="Proof"
              title="Trusted outcomes from real customer loops"
              description="Track lifecycle coverage, continuity, and multilingual quality with production-grade observability."
            />
          </Reveal>
          {(() => {
            const metrics = expertiseMap.proofPoints.metrics.filter(
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

            const topRow = [
              lifecycle,
              contextLost,
              language,
            ].filter(Boolean) as (typeof metrics)[0][];
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
                <StaggerGroup className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {topRow.map((metric) => {
                    const m = applyOverrides(metric);
                    return (
                      <StaggerItem key={m.label}>
                        <MetricCard
                          value={m.value}
                          label={m.label}
                          context={m.context}
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
                      />
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>
            );
          })()}
        </SiteSection>

        <SiteSection id="platform" className="pt-4">
          <Reveal>
            <SectionHeader
              badge="Platform"
              title="Two surfaces, one relationship intelligence core"
              description="Audatec combines lifecycle execution and command center observability so teams can deploy and monitor with confidence."
            />
          </Reveal>
          <StaggerGroup className="mt-8 grid gap-4 md:grid-cols-2">
            <StaggerItem>
              <Card className="h-full">
                <CardHeader className="space-y-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--button-secondary-bg)] text-audit">
                    <Workflow className="h-5 w-5" />
                  </span>
                  <CardTitle className="text-heading-sm">Lifecycle RM Engine</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-body-lg text-soft">
                  <p>
                    Run lead generation, qualification, sales, support, and collections
                    as one context-preserving workflow.
                  </p>
                  <ul className="space-y-2">
                    <li className="surface-muted rounded-lg p-3">
                      One memory thread across every customer stage.
                    </li>
                    <li className="surface-muted rounded-lg p-3">
                      Stage-aware tone for consultative to recovery journeys.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </StaggerItem>
            <StaggerItem>
              <Card className="h-full">
                <CardHeader className="space-y-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--button-secondary-bg)] text-audit">
                    <LineChart className="h-5 w-5" />
                  </span>
                  <CardTitle className="text-heading-sm">Command Center</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-body-lg text-soft">
                  <p>
                    Monitor transcript quality, compliance coverage, and post-call CRM
                    outcomes from a single operational surface.
                  </p>
                  <ul className="space-y-2">
                    <li className="surface-muted rounded-lg p-3">
                      Real-time transcript and sentiment surfaces.
                    </li>
                    <li className="surface-muted rounded-lg p-3">
                      Compliance and audit-ready event visibility.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </StaggerItem>
          </StaggerGroup>
        </SiteSection>

        <SiteSection id="loop" className="pt-4">
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
            <Reveal className="lg:sticky lg:top-24 lg:h-fit">
              <SectionHeader
                badge="The Complete Loop"
                title="One RM. End-to-End."
                description="Unlike point solutions that fragment your customer journey, Audatec keeps same context, same relationship, and zero handoff friction."
              />
              <div className="mt-5 space-y-3">
                <Button asChild>
                  <Link href={ctaPrimaryHref}>See It In Action</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/expertise">Explore Lifecycle Details</Link>
                </Button>
              </div>
            </Reveal>
            <StaggerGroup className="space-y-3">
              {lifecycleStages.map((stage, index) => (
                <StaggerItem key={stage.id}>
                  <Card className="gloss-highlight lifecycle-stage-card">
                    <CardContent className="flex items-start gap-4 p-5">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--button-secondary-bg)] text-label font-semibold text-audit">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-subheading font-semibold text-[var(--text-primary)]">
                          {stage.title}
                        </h3>
                        <p className="mt-1 text-body-lg text-soft">{stage.summary}</p>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </SiteSection>

        <SiteSection id="scenarios" className="pt-4">
          <Reveal>
            <SectionHeader
              badge="Scenarios"
              title="Where traditional handoffs break and AI RM continuity wins"
              description="Use-case depth from sales, support, and collections shows how full-loop context changes outcomes."
            />
          </Reveal>
          <StaggerGroup className="mt-8 grid gap-4 lg:grid-cols-3">
            {stageComparisons.map((comparison) => (
              <StaggerItem key={comparison.title}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-subheading">{comparison.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-body-lg">
                    <div className="surface-muted rounded-lg p-3">
                      <p className="text-caption uppercase tracking-[0.12em] text-muted">
                        Traditional
                      </p>
                      <p className="mt-1 text-soft">{comparison.traditional}</p>
                    </div>
                    <div className="surface-muted rounded-lg border border-[var(--audit-green)]/35 p-3">
                      <p className="text-caption uppercase tracking-[0.12em] text-audit">AI RM</p>
                      <p className="mt-1 text-soft">{comparison.aiRm}</p>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </SiteSection>

        <SiteSection id="situations" className="pt-4">
          <Reveal>
            <SectionHeader
              badge="How we handle it"
              title="How we handle situations better"
              description="Sales, support, and collections powered by one context-aware AI RM—no handoffs, no dropped context."
            />
          </Reveal>
          <StaggerGroup className="mt-8 grid gap-4 md:grid-cols-3">
            {scenarioBlocks.map((scenario) => (
              <StaggerItem key={scenario.id}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-subheading">{scenario.title}</CardTitle>
                    <p className="text-body-lg text-soft">{scenario.lead}</p>
                  </CardHeader>
                  <CardContent className="space-y-2 text-body-lg text-soft">
                    {scenario.points.map((point) => (
                      <div key={point} className="surface-muted flex items-start gap-2 rounded-lg p-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-audit" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </SiteSection>

        <SiteSection id="ai-in-action" className="pt-4">
          <Reveal>
            <CallRecordingsShowcase />
          </Reveal>
        </SiteSection>

        <SiteSection id="capabilities" className="pt-4">
          <Reveal>
            <SectionHeader
              badge="Capabilities"
              title="Built for your stack and your compliance posture"
              description="Integrations, memory, observability, omnichannel reach, and enterprise controls in one operating layer."
            />
          </Reveal>
          <StaggerGroup className="mt-8 grid gap-4 lg:grid-cols-2">
            {integrations.map((claim) => (
              <StaggerItem key={claim.id}>
                <FeatureCard
                  title={claim.category.toUpperCase()}
                  description={claim.text}
                  icon={<BrainCircuit className="h-4 w-4" />}
                />
              </StaggerItem>
            ))}
            {compliance.map((claim) => (
              <StaggerItem key={claim.id}>
                <FeatureCard
                  title={claim.category.toUpperCase()}
                  description={claim.text}
                  icon={<ShieldCheck className="h-4 w-4" />}
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal delay={0.08} className="mt-8">
            <div className="surface-card rounded-2xl p-6">
              <p className="text-caption uppercase tracking-[0.15em] text-audit">
                Integrations
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "Salesforce",
                  "Zoho",
                  "Freshdesk",
                  "REST APIs",
                  "Voice",
                  "WhatsApp",
                  "SMS",
                  "Chat",
                ].map((item) => (
                  <span key={item} className="feature-chip px-3 py-1 text-caption font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </SiteSection>

        <SiteSection id="languages" className="pt-4">
          <Reveal>
            <SectionHeader
              badge="Languages"
              title="Fluent in Indian languages and regional nuance"
              description="From lead calls to collections follow-up, conversations adapt to language, context, and emotional tone."
            />
          </Reveal>
          <StaggerGroup className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { value: "6+", label: "Languages" },
              { value: "2.5M+", label: "Calls" },
              { value: "99%", label: "Accuracy" },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="surface-card rounded-xl p-5 text-center">
                  <p className="text-display-sm font-semibold text-audit">{stat.value}</p>
                  <p className="mt-1 text-caption uppercase tracking-[0.14em] text-muted">
                    {stat.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <StaggerGroup className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {languageCards.map(([native, english]) => (
              <StaggerItem key={english}>
                <div className="surface-muted rounded-xl p-4">
                  <p className="text-subheading font-semibold text-[var(--text-primary)]">{native}</p>
                  <p className="mt-1 text-body-lg text-soft">{english}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </SiteSection>

        <SiteSection id="customers" className="pt-4">
          <Reveal>
            <SectionHeader
              badge="Customers"
              title="Trusted by leading enterprises"
              description="Industry leaders across fintech, telecom, and debt recovery deploy Audatec to close the full customer loop."
            />
          </Reveal>
          <StaggerGroup className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {topWorks.map((work) => (
              <StaggerItem key={work.id}>
                <Card className="h-full">
                  <CardHeader className="space-y-2">
                    <p className="text-caption uppercase tracking-[0.14em] text-audit">
                      {work.industry}
                    </p>
                    <CardTitle>{work.company}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-body-lg text-soft">
                    <p>{work.summary}</p>
                    <ul className="space-y-2">
                      {work.highlights.slice(0, 2).map((highlight) => (
                        <li key={highlight} className="surface-muted rounded-lg p-3">
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </SiteSection>

        <SiteSection id="vision" className="pt-4">
          <Reveal>
            <SectionHeader
              badge="Vision"
              title="One relationship from first call to final payment"
              description="Scale without sprawl while keeping the human quality of every customer interaction."
            />
          </Reveal>
          <StaggerGroup className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: <Globe2 className="h-5 w-5" />,
                title: "Scale without sprawl",
                text: "Handle significantly more customer journeys without fragmented tooling.",
              },
              {
                icon: <Sparkles className="h-5 w-5" />,
                title: "Zero slippage",
                text: "No leads lost in handoffs and no context drops across lifecycle transitions.",
              },
              {
                icon: <Brain className="h-5 w-5" />,
                title: "Consistent experience",
                text: "Maintain quality from first outreach to support and collection follow-up.",
              },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <Card className="h-full">
                  <CardHeader className="space-y-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--button-secondary-bg)] text-audit">
                      {item.icon}
                    </span>
                    <CardTitle className="text-subheading">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body-lg text-soft">{item.text}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal delay={0.08} className="mt-8">
            <div className="surface-card rounded-3xl p-8 text-center sm:p-12">
              <p className="text-caption uppercase tracking-[0.16em] text-audit">Ready to close the loop?</p>
              <h2 className="mt-3 text-display-sm font-semibold tracking-tight text-[var(--text-primary)] sm:text-display">
                Build your Audatec relationship workflow
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-body-lg leading-relaxed text-soft sm:text-subheading">
                Connect voice, memory, compliance visibility, and CRM execution into one
                reliable operating system.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg">
                  <Link href="/contact">Talk to Audatec</Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/expertise">
                    Explore expertise
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </SiteSection>
      </SiteContainer>
    </div>
  );
}
