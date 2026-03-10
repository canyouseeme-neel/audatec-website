type SessionRecord = {
  sessionId: string;
  persona: string;
  channel: string;
  metadata: Record<string, unknown>;
  startedAt: string;
};

type AuditReport = {
  session_id: string;
  generated_at: string;
  summary: Record<string, unknown>;
  compliance: Record<string, unknown>;
};

type DemoStore = {
  sessions: Record<string, SessionRecord>;
  reports: Record<string, AuditReport>;
};

declare global {
  var __audatecStore: DemoStore | undefined;
}

const store =
  globalThis.__audatecStore ||
  (globalThis.__audatecStore = {
    sessions: {},
    reports: {},
  });

export const demoStore = store;
