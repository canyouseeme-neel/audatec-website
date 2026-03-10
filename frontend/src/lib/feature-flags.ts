const websiteMode = process.env.NEXT_PUBLIC_WEBSITE_MODE ?? "marketing_plus_demo";
const sentimentMode = process.env.NEXT_PUBLIC_SENTIMENT_MODE ?? "mock";

export const isDemoEnabled = websiteMode === "marketing_plus_demo";
export const isSentimentEnabled = sentimentMode !== "off";
