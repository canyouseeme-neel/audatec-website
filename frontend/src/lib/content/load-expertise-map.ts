import expertiseData from "@/content/expertise-map.json";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ExpertiseMap = typeof expertiseData;

export function getExpertiseMap(): ExpertiseMap {
  return expertiseData;
}
