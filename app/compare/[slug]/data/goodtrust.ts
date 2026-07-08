/**
 * GoodTrust comparison data.
 * Owns the specific comparative metrics and copy for GoodTrust vs Cipherwill.
 * Does NOT own UI presentation or route orchestration.
 */

import { CompetitorData } from "@/types/interfaces/compare";

export const goodTrustData: CompetitorData = {
  slug: "goodtrust",
  name: "GoodTrust",
  tagline: "Secure your digital inheritance with Zero-Knowledge, not third-party custodians.",
  metaTitle: "Cipherwill vs GoodTrust: Secure Digital Will & Handoff Comparison",
  metaDescription: "Compare Cipherwill and GoodTrust. Understand why client-side encryption and automated check-ins provide superior security for digital inheritance over manual vaults.",
  heroHeading: "Cipherwill vs GoodTrust",
  heroSubheading: "GoodTrust focuses on social media cleanup and traditional estate docs. Cipherwill is a secure, developer-friendly platform built to cryptographically hand off digital secrets automatically.",
  websiteUrl: "https://mygoodtrust.com",
  diffIntro: "GoodTrust is designed to help close online profiles after death, but it lacks the Zero-Knowledge infrastructure and automated triggers required to pass on sensitive digital assets.",
  diffCards: [
    {
      title: "Zero-Knowledge Secrets",
      description: "GoodTrust stores your vault keys and files in custodial databases, leaving them vulnerable to leaks. Cipherwill encrypts all data locally on your device—we never have access to your passwords or keys.",
      iconName: "TbLockBolt",
    },
    {
      title: "Automated Switch vs. Manual Checks",
      description: "GoodTrust requires trusted contacts to manually request access when you pass away. Cipherwill's automated Dead Man's Switch checks in with you regularly and triggers only when you are unresponsive.",
      iconName: "TbClockBolt",
    },
    {
      title: "Open-Source Infrastructure",
      description: "GoodTrust is proprietary, meaning you have to trust their closed software. Cipherwill is open source; you can verify our encryption and trigger mechanics directly on Github.",
      iconName: "TbCode",
    },
  ],

  competitorFocus: "GoodTrust is primarily geared towards digital legacy cleanup—closing social accounts, memorializing Facebook pages, and deleting online profiles—combined with generic wills.",
  cipherwillAdvantage: "Cipherwill is designed for digital asset continuity. We focus on securely preserving and transferring access to your digital wealth (crypto, domains, web hosting, codebases, private keys) through E2E client-side encryption.",

  metrics: [
    {
      featureName: "Handoff Method",
      cipherwill: "Automated Dead Man's Switch (Inactivity-driven)",
      competitor: "Manual request by contacts + company verification",
      notes: "Cipherwill triggers automatically without manual contact actions.",
    },
    {
      featureName: "Encryption Architecture",
      cipherwill: "Zero-Knowledge E2E (Decryption happens in browser)",
      competitor: "Custodial (Decryption key stored on server)",
      notes: "Cipherwill ensures absolute data privacy—not even staff can read it.",
    },
    {
      featureName: "Digital Asset Focus",
      cipherwill: "High (Crypto private keys, developer credentials, servers)",
      competitor: "Low (Mainly social media accounts, PDFs, family photos)",
      notes: "GoodTrust is built for digital cleanup; Cipherwill is for asset preservation.",
    },
    {
      featureName: "Open Source Auditability",
      cipherwill: true,
      competitor: false,
      notes: "Cipherwill is auditable, ensuring no backdoors exist in our software.",
    },
    {
      featureName: "Traditional Will/Trust Docs",
      cipherwill: "No (Focused exclusively on secure digital handoff)",
      competitor: "Yes (General templates for states wills/trusts)",
      notes: "GoodTrust focuses heavily on state paper templates.",
    },
    {
      featureName: "Self-Hostable / Customization",
      cipherwill: true,
      competitor: false,
      notes: "Cipherwill allows developers to inspect, fork, or run code for full control.",
    },
  ],

  faqs: [
    {
      question: "How does GoodTrust's digital cleanup compare to Cipherwill?",
      answer: "GoodTrust is great for closing or memorializing social media profiles like Facebook or LinkedIn. Cipherwill is a secure technical vault built for asset transfer: rather than deleting accounts, we make sure your heirs inherit actual access to your digital wealth, domains, private repositories, and databases safely.",
    },
    {
      question: "Why is open source important for digital estate planning?",
      answer: "A digital estate vault stores your most sensitive information—API keys, server configurations, and crypto seeds. With closed-source platforms like GoodTrust, you have to blindly trust that their servers are secure and that they do not have administrative backdoors. Cipherwill is open source, so anyone can inspect and verify our security protocols.",
    },
    {
      question: "Can I use Cipherwill to store cryptocurrency keys?",
      answer: "Yes. Cipherwill is built precisely for this purpose. Because we use Zero-Knowledge client-side encryption, your private keys and seed phrases are completely secure. Storing private cryptocurrency keys on closed-source, custodial platforms like GoodTrust is highly discouraged by security experts due to the risk of server breaches.",
    },
  ],
};
