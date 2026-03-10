export type CrmTag = {
    id: string;
    key: string;
    value: string;
    status: "success" | "warning";
};

const budgetPattern = /(?:budget|ticket|limit)\s*(?:is|around|about|=|:)?\s*(?:inr|rs\.?|₹)?\s*([\d,]+)/i;
const productPattern = /(?:loan|card|overdraft|insurance|term plan|credit line|product)\s*[:\-]?\s*([a-zA-Z0-9 \-]+)?/i;
const nextStepPattern = /(?:next step|follow up|call back|callback|send docs|share statement|kyc)\s*[:\-]?\s*([a-zA-Z0-9 ,\-]+)?/i;

export function extractCrmTags(
    latestLine: string,
    allLines: string[],
    complianceChecklist: string[],
): CrmTag[] {
    const tags: CrmTag[] = [];
    const lowered = latestLine.toLowerCase();

    // Budget detection
    const budgetMatch = latestLine.match(budgetPattern);
    if (budgetMatch) {
        tags.push({
            id: `budget-${Date.now()}`,
            key: "Budget",
            value: `₹${budgetMatch[1]}`,
            status: "success",
        });
    }

    // Product detection
    const productMatch = latestLine.match(productPattern);
    if (productMatch) {
        const product = (productMatch[1] || productMatch[0] || "").trim();
        if (product) {
            tags.push({
                id: `product-${Date.now()}`,
                key: "Product Interest",
                value: product,
                status: "success",
            });
        }
    }

    // Next step detection
    const nextStepMatch = latestLine.match(nextStepPattern);
    if (nextStepMatch) {
        tags.push({
            id: `next-step-${Date.now()}`,
            key: "Next Steps",
            value: nextStepMatch[0].trim(),
            status: "success",
        });
    }

    // Compliance checks
    const allText = allLines.join(" ").toLowerCase();
    for (const term of complianceChecklist) {
        if (lowered.includes(term)) {
            tags.push({
                id: `compliance-${term}-${Date.now()}`,
                key: "Compliance",
                value: `"${term}" disclosed`,
                status: "success",
            });
        }
    }

    // Missing disclosure warnings
    const missingTerms = complianceChecklist.filter((term) => !allText.includes(term));
    if (missingTerms.length > 0 && allLines.length > 5) {
        tags.push({
            id: `missing-disclosure-${Date.now()}`,
            key: "Compliance Gap",
            value: `Missing: ${missingTerms.slice(0, 3).join(", ")}`,
            status: "warning",
        });
    }

    return tags;
}
