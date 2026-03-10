import { CheckCircle2, Mic, ShieldCheck, Waves } from "lucide-react";

export function HomeDemoPreview() {
  return (
    <div className="surface-card gloss-highlight overflow-hidden rounded-2xl p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-caption uppercase tracking-[0.14em] text-audit">Live Preview</p>
          <h3 className="mt-1 text-subheading font-semibold text-[var(--text-primary)] sm:text-heading-sm">
            Command Center Snapshot
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--audit-green)]/30 bg-[var(--audit-green)]/10 px-2.5 py-1 text-[11px] font-semibold text-audit">
          <Mic className="h-3.5 w-3.5" />
          Live
        </span>
      </div>

      <div className="space-y-3">
        <div className="surface-muted flex items-start gap-2 p-3 text-body text-soft">
          <Waves className="mt-0.5 h-4 w-4 shrink-0 text-audit" />
          Waveform and transcript stream in real-time while the conversation runs.
        </div>
        <div className="surface-muted flex items-start gap-2 p-3 text-body text-soft">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-audit" />
          Compliance alerts and disclosure checkpoints are surfaced as they occur.
        </div>
        <div className="surface-muted flex items-start gap-2 p-3 text-body text-soft">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-audit" />
          Post-call entities sync directly to CRM with auditable records.
        </div>
      </div>
    </div>
  );
}
