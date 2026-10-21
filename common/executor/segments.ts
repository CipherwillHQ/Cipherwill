// Adapts the existing data categories to the executor workspace.
// Owns recipient descriptions, category lookup, and populated group filtering.
// Does not change available routes, plans, or donor preferences.

import segments from "@/app/app/segments/segments";
import type { Divider, Segment } from "@/types/Segments";
import type { MetamodelTypeCount } from "@/types/interfaces";

const descriptions: Record<string, string> = {
  notes: "Personal notes, wishes, and important instructions.",
  "email-accounts": "Email sign-in details and recovery information.",
  "device-locks": "Passcodes and details for accessing devices.",
  passwords: "Sign-in details for accounts shared with you.",
  "seed-phrases": "Recovery phrases and details for shared wallets.",
  "defi-staking": "Platforms and details for shared DeFi investments.",
  "bank-accounts": "Bank information and account details.",
  "payment-cards": "Payment card information and related notes.",
  storage: "Documents, photos, and other files shared with you.",
};

export const executorSegments = segments.map((segment) =>
  "divider" in segment
    ? segment
    : { ...segment, description: descriptions[segment.slug] },
);

export function getExecutorSegment(slug: string): Segment {
  return executorSegments.find(
    (segment): segment is Segment => "slug" in segment && segment.slug === slug,
  )!;
}

export function getAvailableExecutorSegments(counts: MetamodelTypeCount[]): (Divider | Segment)[] {
  const populatedTypes = new Set(counts.filter((item) => item.count > 0).map((item) => item.type));
  const available: (Divider | Segment)[] = [];
  let divider: Divider | undefined;

  for (const segment of executorSegments) {
    if ("divider" in segment) {
      divider = segment;
      continue;
    }
    if (!populatedTypes.has(segment.metamodel_type)) continue;
    if (divider) {
      available.push(divider);
      divider = undefined;
    }
    available.push(segment);
  }

  return available;
}
