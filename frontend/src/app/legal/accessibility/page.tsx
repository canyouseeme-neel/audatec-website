import { LegalPage } from "@/components/site/legal-page";

const sections = [
  {
    heading: "Accessibility Commitment",
    body: "Audatec aims to provide a usable experience across assistive technologies and modern browsers.",
  },
  {
    heading: "Continuous Improvement",
    body: "Accessibility checks are integrated into release cycles and user feedback is used to prioritize remediations.",
  },
  {
    heading: "Support",
    body: "If you face accessibility barriers, contact the team and include the affected page and assistive setup.",
  },
];

export default function AccessibilityLegalPage() {
  return <LegalPage title="Accessibility Statement" updated="February 2026" sections={sections} />;
}
