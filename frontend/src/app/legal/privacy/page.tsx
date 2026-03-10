import { LegalPage } from "@/components/site/legal-page";
import { privacySections } from "@/content/legal/privacy-sections";

export default function PrivacyLegalPage() {
  return <LegalPage title="Privacy Policy" updated="2026-03-07" sections={privacySections} />;
}
