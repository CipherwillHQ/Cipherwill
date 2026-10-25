// Converts the account facts displayed by the Guide overview.
// Owns score totals, account counts, and key-count-based factor sync status.
// Does not calculate server score awards or unused storage/profile metrics.
import type { GuidanceOverview, GuidanceOverviewData } from "@/types/interfaces";
export function buildGuidanceOverview(data: GuidanceOverviewData): GuidanceOverview {
  const scoreValues: unknown = JSON.parse(data.getUserScore);
  if (!scoreValues || typeof scoreValues !== "object" || Array.isArray(scoreValues)) throw new Error("Score unavailable");
  const values = Object.values(scoreValues);
  if (values.some(value => typeof value !== "number" || !Number.isFinite(value))) throw new Error("Invalid score");
  const maxKeyCount = Math.max(0, ...data.getAllKeyCount.map(item => item.count));
  return {
    firstName: data.me.first_name?.trim() || null,
    emailVerified: data.me.email_verified === true,
    score: (values as number[]).reduce((total, value) => total + value, 0),
    itemCount: data.getMetamodelTypeCounts.reduce((total, item) => total + item.count, 0),
    typeCounts: data.getMetamodelTypeCounts,
    beneficiaryCount: data.getSmartWillBeneficiaries.length, factorCount: data.getFactors.length,
    factorsInSync: data.getAllKeyCount.length > 1 && data.getAllKeyCount.every(item =>
      item.publicKey === "null" || item.count === maxKeyCount),
  };
}
