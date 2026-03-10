import fs from "node:fs";
import path from "node:path";

import {
  EXPERTISE_MAP_SCHEMA_VERSION,
  ExpertiseMap,
  ExpertisePillar,
  HowItWorksStep,
  IndustryProfile,
  Offering,
  PastWork,
} from "../src/lib/content/expertise-map";

const playgroundRoot = path.resolve(__dirname, "..");
const demoRoot = path.resolve(playgroundRoot, "..", "demo");
const outputPath = path.resolve(
  playgroundRoot,
  "src",
  "content",
  "expertise-map.json",
);

const sourceFiles = [
  "index.html",
  "use-cases.html",
  "customers.html",
  "contact.html",
  "privacy.html",
  "terms.html",
  "disclaimer.html",
];

const readDemo = (file: string) =>
  fs.readFileSync(path.resolve(demoRoot, file), "utf8");

const stripTags = (raw: string) =>
  raw
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const matchOne = (input: string, matcher: RegExp, fallback = "") => {
  const match = input.match(matcher);
  if (!match) {
    return fallback;
  }
  return stripTags(match[1] ?? "");
};

const matchAll = (input: string, matcher: RegExp) => {
  return Array.from(input.matchAll(matcher)).map((match) =>
    stripTags(match[1] ?? ""),
  );
};

const toId = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const indexHtml = readDemo("index.html");
const useCasesHtml = readDemo("use-cases.html");
const customersHtml = readDemo("customers.html");
const contactHtml = readDemo("contact.html");
const privacyHtml = readDemo("privacy.html");
const termsHtml = readDemo("terms.html");
const disclaimerHtml = readDemo("disclaimer.html");

const expertisePillars: ExpertisePillar[] = [];
for (const match of Array.from(
  indexHtml.matchAll(
    /<div class="diff-item">[\s\S]*?<h5>([\s\S]*?)<\/h5>[\s\S]*?<p>([\s\S]*?)<\/p>[\s\S]*?<\/div>/g,
  ),
)) {
  const title = stripTags(match[1] ?? "");
  const summary = stripTags(match[2] ?? "");
  if (!title || !summary) {
    continue;
  }
  expertisePillars.push({
    id: toId(title),
    title,
    summary,
    sourceRefs: ["demo/index.html"],
  });
}

const howItWorksSteps: HowItWorksStep[] = [];
for (const match of Array.from(
  indexHtml.matchAll(
    /<div class="process-step">[\s\S]*?<h4>([\s\S]*?)<\/h4>[\s\S]*?<p>([\s\S]*?)<\/p>[\s\S]*?<\/div>/g,
  ),
)) {
  const title = stripTags(match[1] ?? "");
  const summary = stripTags(match[2] ?? "");
  if (!title || !summary) {
    continue;
  }
  howItWorksSteps.push({
    id: toId(title),
    title,
    summary,
    sourceRefs: ["demo/index.html"],
  });
}

const offerings: Offering[] = [];
for (const match of Array.from(
  useCasesHtml.matchAll(
    /<section class="use-case(?: use-case-alt)?" id="([\s\S]*?)">([\s\S]*?)<\/section>/g,
  ),
)) {
  const sectionId = stripTags(match[1] ?? "");
  const sectionContent = match[2] ?? "";
  const name = matchOne(sectionContent, /<h2>([\s\S]*?)<\/h2>/);
  const summary = matchOne(
    sectionContent,
    /<p class="use-case-lead">([\s\S]*?)<\/p>/,
  );
  const bullets = matchAll(sectionContent, /<li>([\s\S]*?)<\/li>/g);
  const channels = ["Voice", "SMS", "WhatsApp", "Email", "Chat"].filter(
    (channel) =>
      sectionContent.toLowerCase().includes(channel.toLowerCase()) ||
      bullets.some((item) => item.toLowerCase().includes(channel.toLowerCase())),
  );

  const stageMap: Record<string, string[]> = {
    sales: ["Lead Gen", "Qualification", "Sales"],
    support: ["Support"],
    collections: ["Collection"],
  };

  offerings.push({
    id: sectionId || toId(name),
    name,
    lifecycleStages: stageMap[sectionId] ?? [name],
    summary,
    channels,
    sourceRefs: ["demo/use-cases.html"],
  });
}

const industries: IndustryProfile[] = [
  {
    id: "bfsi",
    name: "BFSI",
    isBFSI: true,
    priority: "high",
    signals: [
      "Lenders, fintechs, and financial platforms",
      "Profile-based underwriting and fraud detection",
      "Collections and cross-selling workflows",
    ],
    sourceRefs: ["demo/customers.html"],
  },
  {
    id: "telecom-contact-center",
    name: "Telecom / Contact Center",
    isBFSI: false,
    priority: "medium",
    signals: [
      "IVR, IP-PBX, and contact center software",
      "Inbound and outbound campaign scale",
    ],
    sourceRefs: ["demo/customers.html"],
  },
  {
    id: "debt-recovery",
    name: "Debt Recovery / Collections",
    isBFSI: false,
    priority: "high",
    signals: [
      "Ethical debt recovery and legal collections",
      "Context-aware negotiations and reminders",
    ],
    sourceRefs: ["demo/customers.html", "demo/use-cases.html"],
  },
];

const pastWorks: PastWork[] = [];
for (const match of Array.from(
  customersHtml.matchAll(
    /<section class="customer-section(?: customer-section-alt)?" id="([\s\S]*?)">([\s\S]*?)<\/section>/g,
  ),
)) {
  const id = stripTags(match[1] ?? "");
  const content = match[2] ?? "";
  const company = matchOne(content, /<h2>([\s\S]*?)<\/h2>/);
  const summary = matchOne(
    content,
    /<p class="customer-tagline">[\s\S]*?<\/p>\s*<p>([\s\S]*?)<\/p>/,
  );
  const highlights = matchAll(content, /<li>([\s\S]*?)<\/li>/g);
  const industry = id.includes("sutram")
    ? "BFSI / Financial Intelligence"
    : id.includes("infotel")
      ? "Telecom / Contact Center"
      : "Debt Recovery";

  pastWorks.push({
    id,
    company,
    industry,
    summary,
    highlights,
    sourceRefs: ["demo/customers.html"],
  });
}

const output = {
  schemaVersion: EXPERTISE_MAP_SCHEMA_VERSION,
  generatedAt: new Date().toISOString(),
  sourceFiles: sourceFiles.map((file) => `demo/${file}`),
  company: {
    name: "YourBrand",
    positioning: matchOne(indexHtml, /<p class="hero-tagline">([\s\S]*?)<\/p>/),
    about: matchOne(indexHtml, /<p class="hero-desc">([\s\S]*?)<\/p>/),
    vision: matchOne(
      indexHtml,
      /<h3 class="section-title">([\s\S]*?)<\/h3>\s*<p class="section-desc">AI RMs that close the loop/,
      "One Relationship. From First Call to Final Payment.",
    ),
    locations: [matchOne(contactHtml, /Based in ([\s\S]*?)\./, "Mumbai, India")],
    sourceRefs: ["demo/index.html", "demo/contact.html"],
  },
  expertisePillars,
  industries,
  offerings,
  rmCrmAutomationClaims: [
    {
      id: "crm-realtime-logging",
      category: "crm",
      text: "CRM integration with activities logged in real time.",
      confidence: "high",
      sourceRefs: ["demo/use-cases.html"],
    },
    {
      id: "stack-integrations",
      category: "integrations",
      text: "Connect AI RMs to CRM, ERP, billing, and communication platforms with pre-built and custom APIs.",
      confidence: "high",
      sourceRefs: ["demo/index.html"],
    },
    {
      id: "omnichannel-thread",
      category: "omnichannel",
      text: "One conversation thread across voice, SMS, WhatsApp, email, and chat.",
      confidence: "high",
      sourceRefs: ["demo/index.html"],
    },
    {
      id: "zero-touch-crm",
      category: "rm-crm",
      text: "Zero-Touch CRM updates from transcript-aware conversation workflows.",
      confidence: "medium",
      sourceRefs: ["demo/use-cases.html", "demo/index.html"],
    },
  ],
  complianceAuditClaims: [
    {
      id: "enterprise-security",
      category: "security",
      text: "Enterprise-grade encryption, access controls, and compliance-by-design operation.",
      confidence: "high",
      sourceRefs: ["demo/index.html"],
    },
    {
      id: "audit-logs",
      category: "audit",
      text: "Conversation monitoring and report export enable continuous auditability.",
      confidence: "high",
      sourceRefs: ["demo/index.html"],
    },
    {
      id: "regulatory-obligation",
      category: "legal",
      text: "Customers remain responsible for telecom, data-protection, and consumer-protection compliance.",
      confidence: "high",
      sourceRefs: ["demo/terms.html", "demo/disclaimer.html"],
    },
    {
      id: "privacy-controls",
      category: "privacy",
      text: "Policy-defined data retention, deletion rights, and international transfer safeguards.",
      confidence: "high",
      sourceRefs: ["demo/privacy.html"],
    },
  ],
  proofPoints: {
    metrics: [
      {
        label: "Lifecycle Coverage",
        value: "5 Stages",
        context: "Lead Gen, Qualification, Sales, Support, Collection",
        sourceRefs: ["demo/index.html"],
      },
      {
        label: "Context Lost in Handoffs",
        value: "Zero",
        context: "Marketing claim from loop section",
        sourceRefs: ["demo/index.html"],
      },
      {
        label: "Language Coverage",
        value: "6+",
        context: "Indian language support",
        sourceRefs: ["demo/index.html"],
      },
      {
        label: "Voice Call Capacity",
        value: "2.5M+ calls daily",
        context: "Regional language audience with native-level fluency and cultural nuance.",
        sourceRefs: ["demo/index.html"],
      },
      {
        label: "Known customer scale",
        value: "500K+ registered users",
        context: "RP Infotel profile",
        sourceRefs: ["demo/customers.html"],
      },
    ],
    pastWorks,
    sourceRefs: ["demo/index.html", "demo/customers.html"],
  },
  howItWorks: {
    headline: "Zero-Touch CRM + 100% Compliance Audit",
    highlights: [
      {
        id: "zero-touch",
        category: "automation",
        text: "AI RM workflows auto-capture relationship context from first touch to final payment without manual CRM cleanup.",
        confidence: "medium",
        sourceRefs: ["demo/index.html", "demo/use-cases.html"],
      },
      {
        id: "compliance-audit",
        category: "audit",
        text: "Every interaction is structured for compliance visibility with audit-ready logs and legal controls.",
        confidence: "high",
        sourceRefs: ["demo/index.html", "demo/terms.html", "demo/privacy.html"],
      },
    ],
    steps: howItWorksSteps,
  },
} satisfies ExpertiseMap;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

const legalSignals = [
  matchOne(termsHtml, /<h2>4\. Acceptable Use<\/h2>[\s\S]*?<p>([\s\S]*?)<\/p>/),
  matchOne(privacyHtml, /<h2>6\. Data Security<\/h2>\s*<p>([\s\S]*?)<\/p>/),
  matchOne(
    disclaimerHtml,
    /<h2>AI and Automation<\/h2>\s*<p>([\s\S]*?)<\/p>/,
  ),
].filter(Boolean);

console.log("ExpertiseMap generated:", outputPath);
console.log("Pillars:", output.expertisePillars.length);
console.log("Offerings:", output.offerings.length);
console.log("Past works:", output.proofPoints.pastWorks.length);
console.log("Compliance references:", legalSignals.length);
