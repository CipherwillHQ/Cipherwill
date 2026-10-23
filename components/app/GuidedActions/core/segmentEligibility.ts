// Checks account preferences and plan access for segment-scoped guidance.
// Owns the shared browser eligibility rule for prompts and data objectives.
// Does not update segments or validate server save permissions.
import type { GuidanceAccount, GuidanceDefinition } from "@/types/interfaces";

export function canAccessGuidanceSegment(flow: GuidanceDefinition, account: GuidanceAccount) {
  const segment = flow.segment;
  if (!segment) return true;
  if (segment.planRequired === "premium" && account.plan !== "premium") return false;
  return !segment.requireEnabled || account.preferences?.[segment.key] === true;
}
