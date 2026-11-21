/**
 * 2026 research piece: State of Post-Death Account Access & Inactivity Policies.
 * Owns the study metadata, headline findings, methodology, narrative analysis, FAQs, and citations.
 * Does NOT own UI rendering or raw per-platform audit arrays (imported from sibling data modules).
 */

import { ResearchPiece } from "@/types/interfaces";
import { consumerPlatforms2026 } from "./post-death-consumer-platforms-2026";
import { infraFinancePlatforms2026 } from "./post-death-infra-finance-2026";

export const postDeathAccountAccess2026: ResearchPiece = {
  slug: "state-of-post-death-account-access-2026",
  title:
    "What Actually Happens to Your Accounts When You Die (2026 Study of 26 Major Platforms)",
  shortTitle: "What Happens to Your Accounts When You Die (2026)",
  subtitle:
    "We checked the official rules of 26 major apps, from Gmail and Apple to Steam and Coinbase. Over 80% have no automated way to hand off your account, and some wipe your data before probate even finishes.",
  metaTitle:
    "What Happens to Your Accounts After Death (2026 Study of 26 Platforms) | Cipherwill Research",
  metaDescription:
    "We checked 26 major platforms (Google, Apple, Microsoft, Meta, GitHub, Steam, Coinbase, Proton, and more) to see when they delete inactive accounts and what families need to get access.",
  keywords: [
    "what happens to digital accounts after death",
    "inactive account deletion policy",
    "Google Inactive Account Manager vs Apple Legacy Contact",
    "post death account access study",
    "digital estate planning statistics 2026",
    "crypto exchange deceased account policy",
  ],
  category: "Account Access & Inactivity",
  publishedAt: "2026-11-21",
  updatedAt: "2026-11-21",
  readTime: "7 min read",
  sampleSize: "26 Major Platforms",
  methodology:
    "We checked the official help docs, terms of service, and executor claim forms across 26 platforms.",
  keyFindings: [
    {
      value: "19.2%",
      label: "Have a built-in legacy tool",
      context:
        "Only 5 out of 26 platforms (Google, Apple, Facebook, GitHub for public repos, and Bitwarden) let you set up an automated handoff ahead of time.",
    },
    {
      value: "26.9%",
      label: "Delete or freeze inactive accounts",
      context:
        "7 out of 26 platforms wipe or lock idle accounts, and 5 of them start freezing or deleting data within 12 months or less.",
    },
    {
      value: "50.0%",
      label: "Require probate or a court order",
      context:
        "Half of the platforms (13 of 26) make your family go through formal court paperwork or probate letters before releasing files, domains, or money.",
    },
    {
      value: "0%",
      label: "Let heirs take over social or email logins",
      context:
        "None of the email, cloud, or social apps let a family member log into and keep using a deceased person's account, even with a will.",
    },
  ],
  platformAudit: [...consumerPlatforms2026, ...infraFinancePlatforms2026],
  sections: [
    {
      id: "the-silent-inactivity-clock",
      heading: "1. Some Platforms Wipe Data Faster Than Probate Moves",
      summary:
        "Settling an estate in court often takes 6 to 18 months. By then, several major email and cloud providers have already frozen or deleted the account.",
      paragraphs: [
        "Out of the 26 services we checked, 7 (26.9%) have clear rules that freeze or erase inactive accounts. Microsoft freezes Outlook.com inboxes and OneDrive files after 1 year of no logins, then closes the Microsoft account at 2 years. Proton (on free plans), Yahoo Mail (on free plans), and Dropbox (on idle free accounts) delete content after 12 months. Google and Discord set the cutoff at 2 years.",
        "X (formerly Twitter) has the shortest window: its policy asks users to sign in at least once every 30 days and warns that long-idle accounts can be removed in periodic cleanups. Because families often don't even discover secondary email addresses until months after someone passes away, automatic deletions happen quietly while relatives are still sorting out paperwork.",
      ],
      bullets: [
        "12 months or less: Microsoft Outlook & OneDrive freeze (1 yr), Proton Free (12 mo), Yahoo Mail (12 mo), Dropbox Free (12 mo), and X's 30-day login rule.",
        "2 years: Google personal accounts, full Microsoft account closure, and Discord.",
        "Paid plans help, sometimes: Proton doesn't delete paid accounts for inactivity, and AWS keeps billing until someone cancels.",
      ],
    },
    {
      id: "legacy-contacts-are-still-rare",
      heading: "2. Only 5 of 26 Platforms Let You Name a Legacy Contact",
      summary:
        "Most apps still don't have a 'pick someone you trust' button, and the ones that do come with strict catches.",
      paragraphs: [
        "Even when a company builds a legacy feature, it rarely works like people expect. Apple's Legacy Contact is great if you set it up, because your family gets a time-limited copy of your iCloud data. But they still need both your death certificate and the special Access Key you printed or saved for them. Lose that Access Key, and your family is back to getting a court order.",
        "Facebook lets your Legacy Contact pin a final post, update profile photos, and download an archive if you turned that on, though they can never read your private messages. GitHub's Account Successor lets someone archive or move your public repositories after a 7-day wait (with a death certificate) or 21-day wait (with an obituary), yet private repos and account logins stay locked. Bitwarden is the standout: its Emergency Access feature lets a trusted contact request View or full Takeover access after a 1 to 90 day wait if you don't turn it down.",
      ],
      bullets: [
        "Google Inactive Account Manager: Triggers after 3–18 months of no logins and can notify up to 10 people to download selected data.",
        "Apple Legacy Contact: Needs both the saved Access Key and a death certificate.",
        "1Password: Doesn't have an automatic online handoff for individual accounts. Instead, it relies on your family finding your printed Emergency Kit PDF and Master Password.",
      ],
    },
    {
      id: "court-orders-and-zero-knowledge-walls",
      heading: "3. Court Orders, Non-Transferable Terms & Locked Encryption",
      summary:
        "If you didn't set anything up beforehand, families usually run into one of three brick walls.",
      paragraphs: [
        "First, paperwork: 13 of the 26 platforms (50%) ask for formal probate documents, letters of administration, or a court order before they'll hand over money, domains, or files. Microsoft is blunt about this. It says families don't need to email a death certificate because it will only consider releasing Outlook or OneDrive data if served with a valid subpoena or court order. Dropbox similarly won't unlock files with just a will and death certificate.",
        "Second, fine print: Steam's Subscriber Agreement explicitly says game libraries are personal licenses that cannot be inherited or transferred, even if you leave them to someone in your will. Third, strong encryption: Proton, Bitwarden, and 1Password use zero-knowledge encryption, so even with a court order, their support teams physically cannot unlock your data without your keys.",
      ],
    },
    {
      id: "what-digital-executors-should-do",
      heading: "4. What Actually Works if You Want Your Family Protected",
      summary:
        "Turning on a couple of legacy settings in Google or Apple helps, but it still leaves about 80% of your accounts uncovered.",
      paragraphs: [
        "Because 21 of the 26 platforms have no automated online handoff, relying on each app's settings leaves huge gaps, especially around domain registrars, crypto exchanges, cloud servers, and 2FA apps that lock your spouse or kids out of everything else.",
        "The simplest setup is two steps: turn on native legacy contacts where they exist (Google, Apple, Facebook, GitHub, Bitwarden), and keep your recovery instructions, 2FA backup codes, and wallet details inside an encrypted digital will that automatically releases to the people you trust if you stop checking in.",
      ],
    },
  ],
  faqs: [
    {
      question: "Which big platforms actually delete inactive accounts?",
      answer:
        "From our check of 26 platforms: Google (2 years), Microsoft (freezes Outlook/OneDrive at 1 year, closes account at 2 years), Proton Free (12 months), Yahoo Mail (12 months), Dropbox Free (12 months), Discord (2 years), and X (30-day login rule with periodic purges).",
    },
    {
      question: "If I mention my Apple, Microsoft, or Steam account in my will, can my family get in?",
      answer:
        "Not just from a will. Apple wants a Legacy Contact Access Key or a court order. Microsoft requires a subpoena or court order served on its legal agent. And Steam's terms explicitly block transferring accounts or game libraries, even with a will.",
    },
    {
      question: "What happens to Coinbase, Binance, or Kraken accounts when someone dies?",
      answer:
        "None of them have a simple 'add a beneficiary login' button for standard individual accounts. An executor has to contact support with a death certificate, probate or court appointment papers, photo ID, and transfer instructions so the exchange can move the funds to a verified claim account.",
    },
    {
      question: "Why can't Proton, 1Password, or Bitwarden open an account if my family sends a death certificate?",
      answer:
        "They use zero-knowledge encryption, which means they never hold your password or decryption keys. Without Bitwarden Emergency Access, a 1Password Emergency Kit, or your saved login details, support has no way to decrypt the vault.",
    },
  ],
  citations: [
    {
      label: "Google Inactive Account Policy & Inactive Account Manager",
      source: "Google Account Help",
      url: "https://support.google.com/accounts/answer/12418290",
    },
    {
      label: "Requesting access to a deceased family member's Apple Account",
      source: "Apple Support",
      url: "https://support.apple.com/en-us/102431",
    },
    {
      label: "Accessing Outlook.com & OneDrive when someone has died",
      source: "Microsoft Support",
      url: "https://support.microsoft.com/en-us/account-billing/accessing-outlook-com-onedrive-and-other-microsoft-services-when-someone-has-died-ebbd2860-917e-4b39-9913-212362da6b2f",
    },
    {
      label: "GitHub Deceased User Policy & Account Successors",
      source: "GitHub Docs",
      url: "https://docs.github.com/en/site-policy/other-site-policies/github-deceased-user-policy",
    },
    {
      label: "Proton Inactive Account Policy",
      source: "Proton Support",
      url: "https://proton.me/support/inactive-accounts",
    },
    {
      label: "Bitwarden Emergency Access",
      source: "Bitwarden Help",
      url: "https://bitwarden.com/help/emergency-access/",
    },
    {
      label: "How to claim a deceased family member's Coinbase account",
      source: "Coinbase Help",
      url: "https://help.coinbase.com/en/coinbase/managing-my-account/other/how-do-i-gain-access-to-a-deceased-family-members-coinbase-account",
    },
    {
      label: "GoDaddy Regain Access (Deceased Owner)",
      source: "GoDaddy Help",
      url: "https://www.godaddy.com/help/regain-access-to-my-account-4043",
    },
  ],
};
