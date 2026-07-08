/**
 * Main competitor data exporter.
 * Aggregates comparison details for all four competitors: Trust & Will, LegalZoom, Everplans, GoodTrust.
 * Does NOT contain display layouts or routing logic.
 */

import { CompetitorData } from "@/types/interfaces/compare";
import { trustAndWillData } from "./data/trust-and-will";
import { legalZoomData } from "./data/legalzoom";
import { everplansData } from "./data/everplans";
import { goodTrustData } from "./data/goodtrust";

export const competitorsData: Record<string, CompetitorData> = {
  "trust-and-will": trustAndWillData,
  "legalzoom": legalZoomData,
  "everplans": everplansData,
  "goodtrust": goodTrustData,
};
