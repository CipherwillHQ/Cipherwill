/**
 * Types and interfaces for Cipherwill Research database pages.
 * Owns data structures for research articles, key metrics, audit matrices, and citations.
 * Does NOT own UI components, route params, or static data entries.
 */

export type PlatformAuditCategory =
  | "Email & Cloud"
  | "Social & Creator"
  | "Developer & Domains"
  | "Gaming & Media"
  | "Security & Finance";

export type LegacySupportLevel = "Native Tool" | "Partial / Offline" | "None";

export interface PlatformPolicyEntry {
  platform: string;
  category: PlatformAuditCategory;
  inactivityDeletion: string;
  inactivityRisk: "High" | "Moderate" | "Low";
  nativeLegacyTool: string;
  legacySupportLevel: LegacySupportLevel;
  heirAccessPolicy: string;
  accountTransferable: string;
  notes: string;
}

export interface ResearchStat {
  value: string;
  label: string;
  context: string;
}

export interface ResearchSection {
  id: string;
  heading: string;
  summary?: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface ResearchFAQ {
  question: string;
  answer: string;
}

export interface ResearchCitation {
  label: string;
  source: string;
  url: string;
}

export interface ResearchPiece {
  slug: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  category: string;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  sampleSize: string;
  methodology: string;
  keyFindings: ResearchStat[];
  sections: ResearchSection[];
  platformAudit?: PlatformPolicyEntry[];
  faqs: ResearchFAQ[];
  citations: ResearchCitation[];
}
