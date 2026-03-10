import { LegalPage } from "@/components/site/legal-page";
import { disclaimerSections } from "@/content/legal/disclaimer-sections";

export default function DisclaimerLegalPage() {
  return <LegalPage title="Disclaimer" updated="2026-03-07" sections={disclaimerSections} />;
}
