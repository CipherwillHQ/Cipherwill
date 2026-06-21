// 0.0.1
import { PodFieldMeta } from "@/types/interfaces";

export type BANK_ACCOUNT_TYPE = {
  account_number?: string;
  bank_name?: string;
};

export const BANK_ACCOUNT_MANDATORY: PodFieldMeta[] = [
  { key: "account_number", label: "Account number" },
  { key: "bank_name", label: "Bank name" },
];

export const BANK_ACCOUNT_OPTIONAL: PodFieldMeta[] = [];
