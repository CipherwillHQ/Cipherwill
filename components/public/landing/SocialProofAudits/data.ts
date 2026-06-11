/**
 * What it does: Defines static testimonials and auditing credentials for the SocialProofAudits section.
 * What it owns: Client testimonial records, media outlets, and press coverage data.
 * What it does NOT do: Does not render react components.
 */

import { PressOutlet } from "@/types/interfaces";

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
    role: "Tech Entrepreneur & Mother",
    avatarText: "ER"
  },
  {
    quote: "Our family estate planning completely ignored our digital lives. Finding Cipherwill resolved everything — my wife can recover primary financial credentials and child memory files without technical stress or legal lockouts.",
    author: "Abbot Vance",
    role: "School Teacher & Father",
    avatarText: "MV"
  }
];

export const MEDIA_OUTLETS: PressOutlet[] = [
  {
    name: "AP News",
    logo: "/media-logos/apnews.png",
    url: "https://apnews.com/press-release/ein-presswire-newsmatics/cipherwill-launches-dead-mans-switch-for-the-digital-age-to-protect-online-assets-74f3cd724cf27b3628f855c167d21351"
  },
  {
    name: "Global Tech Reporter",
    logo: "/media-logos/gtr.png", 
    url: "https://www.globaltechreporter.com/article/842460948-cipherwill-launches-dead-man-s-switch-for-the-digital-age-to-protect-online-assets"
  },
  {
    name: "MENAFN",
    logo: "/media-logos/menafn.png",
    url: "https://menafn.com/1109968404/Cipherwill-Launches-Dead-Mans-Switch-For-The-Digital-Age-To-Protect-Online-Assets"
  },
  {
    name: "American Financial Tribune",
    logo: "/media-logos/aft.png",
    url: "https://www.americanfinancialtribune.com/article/842460948-cipherwill-launches-dead-man-s-switch-for-the-digital-age-to-protect-online-assets"
  },
  {
    name: "Valley Central",
    logo: "/media-logos/vc.png",
    url: "https://www.valleycentral.com/business/press-releases/ein-presswire/842460948/cipherwill-launches-dead-mans-switch-for-the-digital-age-to-protect-online-assets/"
  },
  {
    name: "WRIC ABC 8",
    logo: "/media-logos/wric.png",
    url: "https://www.wric.com/business/press-releases/ein-presswire/842460948/cipherwill-launches-dead-mans-switch-for-the-digital-age-to-protect-online-assets/"
  }
];
