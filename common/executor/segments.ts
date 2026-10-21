// Adapts the existing data categories to the executor workspace.
// Owns recipient-facing descriptions and shared category lookup.
// Does not change available routes, plans, or donor preferences.

import segments from "@/app/app/segments/segments";
import type { Segment } from "@/types/Segments";

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
