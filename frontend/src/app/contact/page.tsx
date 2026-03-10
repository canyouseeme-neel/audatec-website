import { CheckCircle2, Headset, Workflow } from "lucide-react";

import { ContactForm } from "@/components/site/contact-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SectionHeader,
  SiteContainer,
  SiteSection,
} from "@/components/site/marketing-primitives";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/site/scroll-reveal";
import { getExpertiseMap } from "@/lib/content/load-expertise-map";

export default function ContactPage() {
  const expertise = getExpertiseMap();

  return (
    <SiteContainer className="py-12 sm:py-14 lg:py-16">
      <SiteSection className="py-0">
        <Reveal>
          <SectionHeader
            badge="Contact"
            title="Build your Audatec command center"
            description={`Based in ${expertise.company.locations[0]}, we design and deploy lifecycle AI RM workflows with audit-ready operational controls.`}
          />
        </Reveal>
      </SiteSection>

      <SiteSection className="pt-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <StaggerGroup className="space-y-4">
              <StaggerItem>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Workflow className="h-4 w-4 text-audit" />
                      What you get
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-body text-soft">
                    <div className="surface-muted flex items-start gap-2 p-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-audit" />
                      BFSI persona setup for lifecycle RM workflows.
                    </div>
                    <div className="surface-muted flex items-start gap-2 p-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-audit" />
                      Zero-touch CRM tagging and post-call process automation.
                    </div>
                    <div className="surface-muted flex items-start gap-2 p-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-audit" />
                      Compliance alerting and transcript-level audit visibility.
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
              <StaggerItem>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Headset className="h-4 w-4 text-audit" />
                      Engagement options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-body text-soft">
                    <p className="surface-muted p-3">
                      Discovery call with workflow mapping and architecture fit.
                    </p>
                    <p className="surface-muted p-3">
                      Demo walkthrough using your lifecycle stage priorities.
                    </p>
                    <p className="surface-muted p-3">
                      Integration plan for CRM and post-call automation goals.
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            </StaggerGroup>
          </div>

          <Reveal delay={0.08}>
            <Card className="audit-glow h-fit">
              <CardHeader>
                <Badge>Lead Capture</Badge>
                <CardTitle className="mt-2 text-heading">Talk to the Audatec team</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </SiteSection>
    </SiteContainer>
  );
}
