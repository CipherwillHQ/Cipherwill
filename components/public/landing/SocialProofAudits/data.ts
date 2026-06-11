/**
 * What it does: Defines static testimonials and auditing credentials for the SocialProofAudits section.
 * What it owns: Client testimonial records, auditor titles, stamps, and credential summaries.
 * What it does NOT do: Does not render react components.
 */

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatarText: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Cipherwill gave me immense mental relief. I run a remote software agency with dozens of domain accounts and cold crypto ledger wallets. Now my family has a guaranteed offline decryption path if something happens.",
    author: "Elena Rostov",
    role: "DevOps Founder",
    avatarText: "ER"
  },
  {
    quote: "Our family estate planning completely ignored our digital lives. Finding Cipherwill resolved everything — my husband can recover primary financial credentials and child memory files without technical stress or legal lockouts.",
    author: "Marcus Vance",
    role: "Family Estate Planner",
    avatarText: "MV"
  }
];

// Removed unused AUDIT_STAMPS and AuditStamp interface to prevent orphans and avoid displaying placeholder audits.
