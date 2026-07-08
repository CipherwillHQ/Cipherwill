/**
 * Everplans comparison data.
 * Owns the specific comparative metrics and copy for Everplans vs Cipherwill.
 * Does NOT own UI presentation or route orchestration.
 */

import { CompetitorData } from "@/types/interfaces/compare";

export const everplansData: CompetitorData = {
  slug: "everplans",
  name: "Everplans",
  tagline: "Move beyond manual vaults. Adopt zero-knowledge, automated legacy handoff.",
  metaTitle: "Cipherwill vs Everplans: Automated Cryptographic Vault Handoff",
  metaDescription: "Compare Cipherwill and Everplans. Learn why automated dead man's switch and Zero-Knowledge client-side encryption offer superior protection for your digital secrets.",
  heroHeading: "Cipherwill vs Everplans",
  heroSubheading: "Everplans is a life organizer. Cipherwill is a Zero-Knowledge security vault with an automated Dead Man's Switch to ensure your digital legacy is delivered instantly and securely.",
  
  diffIntro: "Everplans provides a clean organizer for estate plans. However, it relies on manual verification processes by company staff and stores your vault data in a custodial format.",
  diffCards: [
    {
      title: "Automated Dead Man's Switch",
      description: "Everplans requires your deputies to manually notify them of your passing, which is then verified by Everplans staff. Cipherwill uses a secure check-in system that automatically triggers upon inactivity.",
      iconName: "TbClockBolt",
    },
    {
      title: "Zero-Knowledge Encryption",
      description: "Everplans uses standard database encryption where they control the keys. Cipherwill uses client-side, zero-knowledge encryption, meaning only you and your beneficiaries can decrypt your data.",
      iconName: "TbLockBolt",
    },
    {
      title: "Open Source Auditability",
      description: "Everplans is a proprietary, closed-source platform. Cipherwill is open source, allowing developers and security experts to audit our code and verify our cryptographic claims.",
      iconName: "TbCode",
    },
  ],

  competitorFocus: "Everplans acts as an organizer for your life details, prompting you to enter funeral preferences, scanning insurance cards, and listing bank accounts for your 'deputies' to look at later.",
  cipherwillAdvantage: "Cipherwill acts as a secure, automated payload delivery system. We focus on cryptographically protecting sensitive credentials, private repos, and Web3 keys, then executing a decentralized handoff automatically.",

  metrics: [
    {
      featureName: "Handoff Automation",
      cipherwill: "Yes (Automated Dead Man's Switch check-in loop)",
      competitor: "No (Manual deputy request + manual staff verification)",
      notes: "Cipherwill doesn't rely on staff manually verifying death certificates.",
    },
    {
      featureName: "Encryption Standard",
      cipherwill: "Zero-Knowledge Client-side (AES-256-GCM + SECP256K1)",
      competitor: "Custodial (Server-side encryption only)",
      notes: "Everplans holds the encryption keys to your vault; Cipherwill does not.",
    },
    {
      featureName: "Open Source Codebase",
      cipherwill: true,
      competitor: false,
      notes: "Cipherwill's code is public and auditable for ultimate security.",
    },
    {
      featureName: "Web3 / Crypto Wallet Focus",
      cipherwill: "Full support with E2E encrypted key fields",
      competitor: "Text fields only (insecure custodial storage)",
      notes: "Cryptocurrency credentials require zero-knowledge security to avoid theft.",
    },
    {
      featureName: "Developer / Sysadmin Tooling",
      cipherwill: "Tailored (git keys, SSH access, server credentials, domains)",
      competitor: "None (Designed for general public document storage)",
      notes: "Cipherwill is designed for technical users with digital infrastructure.",
    },
    {
      featureName: "Pricing Option",
      cipherwill: "Free tier + flexible plans",
      competitor: "Paid yearly subscription ($99.99/year) only",
      notes: "Cipherwill provides more value at a lower, transparent cost.",
    },
  ],

  faqs: [
    {
      question: "Can Everplans employees see the files I upload?",
      answer: "Since Everplans uses standard custodial encryption, their systems (and potentially their staff or administrative accounts) have access to the encryption keys. Cipherwill uses Zero-Knowledge client-side encryption. Your browser/app encrypts the data before it's sent to our servers, meaning even we cannot access your files under any circumstances.",
    },
    {
      question: "What happens if my family doesn't know I have an Everplan?",
      answer: "With Everplans, if your family is unaware of the account, they cannot trigger the manual request process, and your data may remain locked forever. Cipherwill solves this through our automated check-in system: if you fail to check in, our system initiates the secure handoff to your beneficiaries automatically.",
    },
    {
      question: "Is Cipherwill a better fit for software engineers and web3 users?",
      answer: "Absolutely. Everplans is designed for traditional life organization (documenting insurance, funeral planning, etc.). Software developers, system administrators, and crypto owners trust Cipherwill because we encrypt SSH keys, API credentials, server access details, and crypto wallets using auditable, open-source cryptographic code.",
    },
  ],
};
