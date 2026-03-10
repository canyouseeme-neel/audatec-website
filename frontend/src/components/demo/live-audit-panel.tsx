"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

import { CrmTag } from "@/lib/demo/crm-tags";

export function LiveAuditPanel({
  tags,
  loading,
}: {
  tags: CrmTag[];
  loading?: boolean;
}) {
  return (
    <aside className="glass-panel flex h-full min-h-[500px] flex-col rounded-xl border border-white/15 p-4">
      <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/60">
          <ShieldCheck className="h-3.5 w-3.5 text-audit" />
          Live Audit Console
        </p>
        <span className="text-[10px] uppercase tracking-[0.12em] text-audit">
          {loading ? "listening..." : "active"}
        </span>
      </div>
      <div className="space-y-2 overflow-y-auto pr-1">
        <AnimatePresence>
          {tags.map((tag) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`rounded-md border px-3 py-2 text-xs ${
                tag.status === "success"
                  ? "border-[var(--audit-green)]/35 bg-[color:var(--audit-green)]/10 text-[var(--audit-green)]"
                  : "border-[var(--warning-amber)]/35 bg-[color:var(--warning-amber)]/10 text-[var(--warning-amber)]"
              }`}
            >
              <p className="font-mono font-semibold uppercase tracking-[0.1em]">
                {tag.key}
              </p>
              <p className="mt-1 break-words opacity-90">{tag.value}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        {tags.length === 0 && (
          <p className="rounded-md border border-dashed border-white/15 p-3 text-xs text-white/45">
            Waiting for transcript events...
          </p>
        )}
      </div>
    </aside>
  );
}
