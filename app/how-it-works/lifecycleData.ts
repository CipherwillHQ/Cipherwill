/**
 * lifecycleData.ts
 * Manages the structured metadata, copy, and icons for the 8-phase Cipherwill Lifecycle.
 * Decouples content from layout mechanics.
 */

import { IconType } from "react-icons";
import { MdSecurity } from "react-icons/md";
import { GrSecure } from "react-icons/gr";
import { BiNotepad } from "react-icons/bi";
import { GiTimeTrap } from "react-icons/gi";

import onboarding_img from "./lifecycle_assets/onboarding.png";
import data_img from "./lifecycle_assets/data.png";
import security_img from "./lifecycle_assets/security.png";
import encryption_img from "./lifecycle_assets/encryption.png";
import schedule_img from "./lifecycle_assets/schedule.png";
import activity_img from "./lifecycle_assets/activity.png";
import time_capsule_img from "./lifecycle_assets/timelock.png";
import beneficiary_img from "./lifecycle_assets/beneficiary.png";

export interface LifecyclePhase {
  id: string;
  tag: string;
  title: string;
  points: string[];
  image: any;
  btnHref?: string;
  btnTitle?: string;
  btnIcon?: IconType;
}

export const lifecyclePhases: LifecyclePhase[] = [
  {
    id: "onboarding",
    tag: "01. Onboarding",
    title: "Your First Steps with Cipherwill",
    points: [
      "Create your secure profile using a verified email address.",
      "Complete your account setup by filling in basic identification tags (name, birthday).",
      "Gain full, intuitive visibility over your personal protection timeline.",
      "Explore security configurations directly on your default dashboard."
    ],
    image: onboarding_img,
  },
  {
    id: "data",
    tag: "02. Segment Organization",
    title: "How Your Data is Structured?",
    points: [
      "Data is split into segments like login credentials, passwords, wallets, seed phrases, and notes.",
      "Metadata (titles, tags, versions) remains unencrypted for rapid searching and sorting.",
      "The actual payload is wrapped in highly secure, local end-to-end encryption.",
      "Supports secure object file storage for uploading private documents, photos, and media."
    ],
    image: data_img,
  },
  {
    id: "security",
    tag: "03. Security Factors",
    title: "Your Keys, Your Full Control",
    points: [
      "Choose from an array of encryption layers (passwords, FIDO2 keys, on-device biometrics, or wallets).",
      "Creates isolated cryptographic public/private key pairs directly on your secure hardware.",
      "Public keys encrypt data on our clouds, while the private key is held exclusively by you.",
      "Guarantees that no data is accessible without the proper designated physical factors."
    ],
    image: security_img,
    btnHref: "/how-factors-work",
    btnTitle: "More about Security Factors",
    btnIcon: MdSecurity,
  },
  {
    id: "encryption",
    tag: "04. Multi-Layer",
    title: "Cascade Encryption Wrapping",
    points: [
      "Leverages AES-256 block encryption combined with Elliptic Curve Cryptography.",
      "Applies multiple separate encryption shells onto the same payload (Cascade Encryption).",
      "Each datapod key is wrapped with a time capsule key and the beneficiary's public key.",
      "Ensures absolute security: even if one layer is broken, the outer layers keep the data secure."
    ],
    image: encryption_img,
    btnHref: "/i/cascade-encryption",
    btnTitle: "Learn more about Encryption",
    btnIcon: GrSecure,
  },
  {
    id: "schedule",
    tag: "05. Triggers",
    title: "How Cipherwill Knows When to Act",
    points: [
      "Your dead man's switch triggers after a designated period of inactivity.",
      "Starts a scheduled execution flow, delivering three separate sequential check-in reminders.",
      "Reminders are sent through multi-channel networks (Email, SMS, and Voice Calls).",
      "If you respond to any check-in, the schedule immediately resets to normal monitor mode."
    ],
    image: schedule_img,
    btnHref: "/i/how-execution-timeline-works",
    btnTitle: "See how will execution works",
    btnIcon: BiNotepad,
  },
  {
    id: "activity",
    tag: "06. Verification",
    title: "Preventing Accidental Check-Ins",
    points: [
      "Add secondary backup contacts (SMS numbers, alternative emails) to secure alerts.",
      "Cipherwill logs standard dashboard activity like updates, edits, or logins.",
      "Any organic platform action automatically updates your timeline, resetting the countdown timer.",
      "Ensures you always remain in absolute command of the monitoring switch."
    ],
    image: activity_img,
  },
  {
    id: "timelock",
    tag: "07. Timelock",
    title: "Keeping Wills Secure Until Needed",
    points: [
      "Time Capsule Encryption (TCE) physically locks payload keys behind cryptographic timelines.",
      "Time keys are dynamically refreshed every 90-180 days by high-integrity nodes.",
      "Prevents any premature decryption before the designated schedule is officially completed.",
      "Requires both the completed time-unlocked key and the beneficiary's private key to decrypt."
    ],
    image: time_capsule_img,
    btnHref: "/i/time-capsule-encryption",
    btnTitle: "Time Capsule Encryption",
    btnIcon: GiTimeTrap,
  },
  {
    id: "beneficiary",
    tag: "08. Handoff",
    title: "Managing Beneficiary Data Access",
    points: [
      "Designate specific recipients and map customized data payloads to each beneficiary.",
      "Upon validated switch execution, beneficiaries receive credentials via secure notification channels.",
      "Beneficiaries inspect and download their delegated pods directly from a custom dashboard.",
      "Access is open for a fixed 100-day window, after which all data is permanently and securely deleted."
    ],
    image: beneficiary_img,
  },
];
