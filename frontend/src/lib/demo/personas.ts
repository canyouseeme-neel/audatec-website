export type AudatecPersona = {
    id: string;
    label: string;
    agentName: string;
    metadata: {
        posture: string;
        complianceChecklist: string[];
        [key: string]: unknown;
    };
};

export const audatecPersonas: AudatecPersona[] = [
    {
        id: "bfsi-audit",
        label: "BFSI Audit Agent",
        agentName: "audatec-bfsi",
        metadata: {
            posture: "Regulatory-compliant voice agent for banking and financial services.",
            complianceChecklist: [
                "interest",
                "apr",
                "lock-in",
                "processing fee",
                "consent",
                "disclosure",
            ],
        },
    },
    {
        id: "collections",
        label: "Collections Agent",
        agentName: "audatec-collections",
        metadata: {
            posture: "Empathetic collections agent with compliance guardrails.",
            complianceChecklist: [
                "outstanding amount",
                "due date",
                "payment plan",
                "consent",
                "penalty",
            ],
        },
    },
    {
        id: "sales",
        label: "Sales Agent",
        agentName: "audatec-sales",
        metadata: {
            posture: "Consultative sales agent for financial product cross-sell.",
            complianceChecklist: [
                "interest",
                "lock-in",
                "processing fee",
                "eligibility",
                "consent",
            ],
        },
    },
];
