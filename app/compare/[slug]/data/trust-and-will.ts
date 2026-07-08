/**
 * Trust & Will comparison data.
 * Owns the specific comparative metrics and copy for Trust & Will vs Cipherwill.
 * Does NOT own UI presentation or route orchestration.
 */

import { CompetitorData } from "@/types/interfaces/compare";

export const trustAndWillData: CompetitorData = {
  slug: "trust-and-will",
  name: "Trust & Will",
  tagline: "Secure your digital assets with cryptographic automation, not paper bureaucracy.",
  metaTitle: "Cipherwill vs Trust & Will: The Modern Digital Will Alternative",
  metaDescription: "Compare Cipherwill and Trust & Will. Learn why Zero-Knowledge E2E encryption and automated dead man's switch are crucial for securing digital assets and Web3 holdings.",
  heroHeading: "Cipherwill vs Trust & Will",
  heroSubheading: "Trust & Will is built for traditional paper execution. Cipherwill is built to secure and automate the transfer of your digital assets and Web3 legacy.",
  
  diffIntro: "While Trust & Will is a popular tool for traditional estate planning, it falls short when it comes to the immediate, secure, and private transfer of digital secrets.",
  diffCards: [
    {
      title: "Automated Handoff",
      description: "Trust & Will relies on your executor going through the slow legal probate process. Cipherwill uses a secure, automated Dead Man's Switch to release assets directly to beneficiaries when you stop checking in.",
      iconName: "TbClockBolt",
    },
    {
      title: "Zero-Knowledge Privacy",
      description: "Trust & Will stores your sensitive information in standard custodial databases. Cipherwill encrypts everything locally on your device with Zero-Knowledge E2E encryption—we never see your keys or files.",
      iconName: "TbLockBolt",
    },
    {
      title: "Web3 & Crypto Ready",
      description: "Traditional wills are public record and can't hold seed phrases or private keys. Cipherwill is built from the ground up to handle crypto wallets, API keys, and private credentials securely.",
      iconName: "TbCoins",
    },
  ],

  competitorFocus: "Trust & Will focuses on generating legally binding paper state wills and trust packages. They help you nominate traditional guardians and distribute physical assets like houses or cars via executors.",
  cipherwillAdvantage: "Cipherwill specializes in securing your digital life. We bridge the 'digital void' by cryptographically securing and instantly transferring private data, crypto wallets, and login credentials that legal systems cannot access.",

  metrics: [
    {
      featureName: "Handoff Trigger",
      cipherwill: "Automated Dead Man's Switch (Check-in countdown)",
      competitor: "Manual legal probate (Showing death certificate to courts)",
      notes: "Cipherwill automates transmission immediately, avoiding court delays.",
    },
    {
      featureName: "Encryption Architecture",
      cipherwill: "Zero-Knowledge Client-Side E2E (AES-256-GCM)",
      competitor: "Standard Custodial Database (Server-side only)",
      notes: "Cipherwill cannot access your files. Competitor administrators theoretically can.",
    },
    {
      featureName: "Web3 / Private Key Custody",
      cipherwill: "Built-in secure fields for seed phrases & keys",
      competitor: "No support (Writing keys in a will voids security)",
      notes: "Putting crypto keys in a traditional will makes them part of public record.",
    },
    {
      featureName: "Self-Custodial & Open Source",
      cipherwill: true,
      competitor: false,
      notes: "Cipherwill's open-source codebase ensures trust and auditability.",
    },
    {
      featureName: "Probate Court Involvement",
      cipherwill: "None (Direct cryptographic transfer)",
      competitor: "Required (Takes months and is public record)",
      notes: "Court probate delays access to online assets, causing data loss.",
    },
    {
      featureName: "Pricing Model",
      cipherwill: "Affordable, value-driven plans",
      competitor: "Expensive upfront ($159 - $599) + annual fees",
      notes: "Cipherwill offers a clean, transparent pricing structure.",
    },
  ],

  faqs: [
    {
      question: "Can I use Cipherwill alongside a Trust & Will plan?",
      answer: "Yes. In fact, we recommend it. You can use Trust & Will to handle your physical assets (like real estate and guardianship of children), and use Cipherwill to protect your digital assets (like crypto private keys, source code repositories, and online accounts) which traditional legal documents cannot safely store or transfer.",
    },
    {
      question: "Why can't I put my crypto keys in a Trust & Will document?",
      answer: "Wills eventually become public record when they go through probate court. If you write your private keys, seed phrases, or master passwords in a traditional will, anyone can see and steal them. Furthermore, standard databases are vulnerable to data breaches. Cipherwill encrypts your keys client-side, ensuring only you and your chosen beneficiaries ever have access.",
    },
    {
      question: "How does the automated transfer process compare to an executor?",
      answer: "Under Trust & Will, your executor must manually go to court, receive Letters of Testamentary, and contact each website (like Google, AWS, or Coinbase) to request access, which platforms often deny. Cipherwill bypasses this bureaucracy by executing a secure cryptographic transfer automatically if you miss your check-in timeline.",
    },
  ],
};
