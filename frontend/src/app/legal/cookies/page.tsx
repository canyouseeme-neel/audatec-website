import { LegalPage } from "@/components/site/legal-page";

const sections = [
  {
    heading: "Cookie Usage",
    body: "Audatec uses cookies and similar technologies to maintain session behavior, improve performance, and understand product interaction patterns.",
  },
  {
    heading: "Preference Controls",
    body: "Users may manage cookie behavior through browser controls. Some platform features can be degraded when core cookies are disabled.",
  },
  {
    heading: "Analytics",
    body: "Aggregated analytics may be captured to improve product quality, usability, and reliability.",
  },
];

export default function CookiesLegalPage() {
  return <LegalPage title="Cookie Policy" updated="February 2026" sections={sections} />;
}
