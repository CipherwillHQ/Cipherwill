/**
 * What it does: Defines static universal digital asset pillars and setups for the UserPersonaMatrix.
 * What it owns: Profile records containing name, role, recommended checklists, and target quotes.
 * What it does NOT do: Does not render react components.
 */

export interface PersonaProfile {
  id: string;
  name: string;
  quote: string;
  iconLabel: string;
  setupBrief: string;
  checklist: string[];
  badgeLabel: string;
}

export const PERSONA_PROFILES: PersonaProfile[] = [
  {
    id: "passwords",
    name: "Primary Passwords & Accounts",
    quote: "My entire online existence—personal emails, domain registrations, work dashboards, and social profiles—is secured behind passwords. If I am locked out, my family loses access to everything.",
    iconLabel: "🔑 Secure Logins",
    setupBrief: "Requires establishing a baseline handoff for primary browser logins, password manager backup configurations, and central communication accounts.",
    checklist: [
      "Secured primary master passwords",
      "Set up automatic secondary account transition",
      "Nominated family administrator as executor",
      "Included critical recovery codes"
    ],
    badgeLabel: "Logins"
  },
  {
    id: "finance",
    name: "Financial Credentials & Wealth",
    quote: "I manage our family's online banking accounts, tax logins, and crypto/Web3 keys. Without a structured contingency plan, my funds and digital assets are lost on-chain or frozen forever.",
    iconLabel: "💳 Financial Estate",
    setupBrief: "Enables secure transmission of bank routing coords, credit card pins, offline ledger BIP-39 mnemonic phrases, or crypto keys with failsafe timers.",
    checklist: [
      "Secured central bank logins and routing",
      "Set up hardware ledger BIP-39 mnemonic backups",
      "Nominated direct beneficiary for specific crypto keys",
      "Configured automatic check-in reset reminders"
    ],
    badgeLabel: "Finance"
  },
  {
    id: "memories",
    name: "Personal Memories & Directives",
    quote: "I have decades of family photos, legal documents, and digital memories stored in our cloud drives. If inactive policies trigger, all those memories disappear forever.",
    iconLabel: "📂 Personal Archives",
    setupBrief: "Supports secure encrypted attachments of scanned legal deeds, last messages to loved ones, family drive folders, and specific instructions.",
    checklist: [
      "Encrypted scanned copies of traditional estate deeds",
      "Uploaded final letters and directives",
      "Nominated spouse and children as beneficiaries",
      "Set up 1 GB premium cloud document storage links"
    ],
    badgeLabel: "Archives"
  },
  {
    id: "business",
    name: "Business Operations & Domains",
    quote: "I run a business with critical cloud subscriptions, domain ownerships, hosting servers, and stripe merchant accounts. If I am suddenly incapacitated, our company operations will freeze, blocking employees and clients.",
    iconLabel: "💼 Business Continuity",
    setupBrief: "Provides a secure transition plan for critical server SSH keys, operational passwords, SaaS admin accounts, and registrar configurations to designated business partners.",
    checklist: [
      "Secured cloud platform admin credentials",
      "Set up registrar & domain ownership delegation",
      "Nominated business partner/co-founder as executor",
      "Documented server SSH and API key recovery paths"
    ],
    badgeLabel: "Business"
  },
  {
    id: "creators",
    name: "Digital IP & Content Creators",
    quote: "My livelihood and assets exist as YouTube channels, blogs, intellectual property, and monetized media accounts. If I don't set up a transition path, my channels and digital assets will become orphaned.",
    iconLabel: "🎬 Digital IP",
    setupBrief: "Enables smooth transition of media publishing platforms, brand contracts, content archives, and social media handles to next-of-kin or team members.",
    checklist: [
      "Secured primary publishing channel logins",
      "Set up brand contract & partnership documentation",
      "Nominated creative successor/manager as executor",
      "Shared digital media master archives and access"
    ],
    badgeLabel: "Creators"
  }
];
