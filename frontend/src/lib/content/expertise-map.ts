export const EXPERTISE_MAP_SCHEMA_VERSION = "1.0.0";

export type ExpertisePillar = {
  id: string;
  title: string;
  summary: string;
  sourceRefs: string[];
};

export type HowItWorksStep = {
  id: string;
  title: string;
  summary: string;
  sourceRefs: string[];
};

export type IndustryProfile = {
  id: string;
  name: string;
  isBFSI: boolean;
  priority: "high" | "medium" | "low";
  signals: string[];
  sourceRefs: string[];
};

export type Offering = {
  id: string;
  name: string;
  lifecycleStages: string[];
  summary: string;
  channels: string[];
  sourceRefs: string[];
};

export type PastWork = {
  id: string;
  company: string;
  industry: string;
  summary: string;
  highlights: string[];
  sourceRefs: string[];
};

type Claim = {
  id: string;
  category: string;
  text: string;
  confidence: "high" | "medium" | "low";
  sourceRefs: string[];
};

type Metric = {
  label: string;
  value: string;
  context: string;
  sourceRefs: string[];
};

export type ExpertiseMap = {
  schemaVersion: string;
  generatedAt: string;
  sourceFiles: string[];
  company: {
    name: string;
    positioning: string;
    about: string;
    vision: string;
    locations: string[];
    sourceRefs: string[];
  };
  expertisePillars: ExpertisePillar[];
  industries: IndustryProfile[];
  offerings: Offering[];
  rmCrmAutomationClaims: Claim[];
  complianceAuditClaims: Claim[];
  proofPoints: {
    metrics: Metric[];
    pastWorks: PastWork[];
    sourceRefs: string[];
  };
  howItWorks: {
    headline: string;
    highlights: Claim[];
    steps: HowItWorksStep[];
  };
};
