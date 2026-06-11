/**
 * What it does: Defines static pricing tier records for Cipherwill subscription tiers based on the actual platform pricing.
 * What it owns: Pricing tier names, prices, features lists, button text, and recommended flags.
 * What it does NOT do: Does not render visual cards or link billing callbacks.
 */

export interface PricingPlan {
  id: string;
  name: string;
  level: string;
  price: string;
  period: string;
  saving?: string;
  description: string;
  features: string[];
  ctaText: string;
  isPopular?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Lifetime Free",
    level: "Level 01",
    price: "$0",
    period: "Lifetime",
    description: "Essential digital legacy planning for passwords, notes, and core digital instructions.",
    features: [
      "Secure up to 5 Beneficiaries",
      "Notes, Passwords & Traditional Assets",
      "End-to-End Client-Side Encryption",
      "Email-only Dead Man's Switch",
      "Standard Customer Support"
    ],
    ctaText: "Create Free Will →"
  },
  {
    id: "premium",
    name: "Premium",
    level: "Level 02",
    price: "$40",
    period: "Year",
    saving: "Saving 30% - Equivalent to $3.33/Month",
    description: "Uncompromising cryptographic estate security for private keys, documents, and messaging check-ins.",
    features: [
      "Unlimited Beneficiaries",
      "Web3 Crypto Key & Seed Phrase Storage",
      "1 GB Encrypted Document Storage",
      "Per-Item Unique Beneficiary Assignment",
      "Failsafe Communications (Calls, SMS, WhatsApp)",
      "Priority Live Chat Support",
      "Lifetime Codebase Audit Access"
    ],
    ctaText: "Get Premium →",
    isPopular: true
  }
];
