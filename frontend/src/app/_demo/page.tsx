import { CommandCenter } from "@/components/demo/command-center";
import { SiteContainer, SiteSection } from "@/components/site/marketing-primitives";
import { Button } from "@/components/ui/button";
import { isDemoEnabled } from "@/lib/feature-flags";
import Link from "next/link";

export default function DemoPage() {
  if (!isDemoEnabled) {
    return (
      <SiteContainer>
        <SiteSection className="text-center">
          <div className="surface-card mx-auto max-w-3xl rounded-2xl p-8">
            <h1 className="text-3xl font-semibold">Demo Mode Disabled</h1>
            <p className="mt-3 text-soft">
              `NEXT_PUBLIC_WEBSITE_MODE` is set to marketing-only. Enable
              `marketing_plus_demo` to open the command center.
            </p>
            <Button asChild className="mt-5">
              <Link href="/">Return to home</Link>
            </Button>
          </div>
        </SiteSection>
      </SiteContainer>
    );
  }

  return <CommandCenter />;
}
