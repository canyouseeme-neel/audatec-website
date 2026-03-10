import { LegalPage } from "@/components/site/legal-page";
import { termsSections } from "@/content/legal/terms-sections";

export default function TermsLegalPage() {
  return <LegalPage title="Terms and Conditions" updated="2026-03-07" sections={termsSections} />;
}
