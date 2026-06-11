/**
 * What it does: Defines static records for asset categories allowed in the Cipherwill secure storage.
 * What it owns: Category title, icon components, summary texts, and encrypted key placeholders.
 * What it does NOT do: Does not render visual cards.
 */

import { TbKey, TbFileText, TbWallet, TbLock, TbNote, TbCreditCard, TbDeviceMobile } from "react-icons/tb";

export interface AssetCategory {
  title: string;
  icon: any;
  description: string;
  encryptedSample: string;
}

export const ASSET_CATEGORIES: AssetCategory[] = [
  {
    title: "Passwords & Logins",
    icon: TbLock,
    description: "Exported credential files (JSON/CSV) from standard browsers or external managers, decrypted only at the threshold.",
    encryptedSample: "U2FsdGVkX19GvR6a6+u...W3M9fA"
  },
  {
    title: "Seed Phrases & Keys",
    icon: TbWallet,
    description: "Safely transmit BIP-39 mnemonic phrases, Ethereum/Bitcoin private keys, and hardware ledger backup configurations.",
    encryptedSample: "0x8e83b42a9f112e4da...32c7b3"
  },
  {
    title: "Files & Documents",
    icon: TbFileText,
    description: "Scanned PDF inheritance documents, digital deeds, and family handoff directives up to 1GB per account encrypted in-transit.",
    encryptedSample: "enc_hash_SHA256::e3b0c442"
  },
  {
    title: "Secure Notes & Directives",
    icon: TbNote,
    description: "Granular personal messages, last instructions, digital access steps, or secret environment keys for team operations.",
    encryptedSample: "notes_key_ENC::f9a3c2b810"
  },
  {
    title: "Bank Accounts & Cards",
    icon: TbCreditCard,
    description: "Securely pass down financial institution coordinates, routing configurations, and secondary payment card credentials.",
    encryptedSample: "bank_coord_hash_7f2d3a"
  },
  {
    title: "Device Locks",
    icon: TbDeviceMobile,
    description: "Computer logins, mobile device passcode hints, or recovery verification coordinates to bypass hardware lockouts.",
    encryptedSample: "passcode_hint::82b9a7c"
  }
];
