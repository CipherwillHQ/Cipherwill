// 0.0.1
import { PodFieldMeta } from "@/types/interfaces";

export type DEFI_STACKING = {
  platform?: string;
  asset_amount?: string;
  asset_name?: string;
  lock_period?: string;
  wallet_address?: string;
  username?: string;
  password?: string;
  note?: string;
};

export const DEFI_STAKING_MANDATORY: PodFieldMeta[] = [
  { key: "platform", label: "Platform", placeholder: "AAVE, Compound, etc." },
  { key: "asset_amount", label: "Amount" },
  { key: "asset_name", label: "Asset Name", placeholder: "e.g., USDC" },
];

export const DEFI_STAKING_OPTIONAL: PodFieldMeta[] = [
  { key: "lock_period", label: "Lock Period", placeholder: "e.g., 1 month" },
  { key: "wallet_address", label: "Wallet Address" },
  { key: "username", label: "Username", group: "Credentials" },
  { key: "password", label: "Password", sensitive: true, group: "Credentials" },
  { key: "note", label: "Note", type: "textarea" },
];
