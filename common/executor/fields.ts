// Reuses the vault's field definitions for read-only executor details.
// Owns category field order and masking of sensitive values.
// Does not define new data fields or perform decryption.

import { BANK_ACCOUNT_MANDATORY, BANK_ACCOUNT_OPTIONAL } from "@/types/pods/BANK_ACCOUNT";
import { DEFI_STAKING_MANDATORY, DEFI_STAKING_OPTIONAL } from "@/types/pods/DEFI_STAKING";
import { DEVICE_LOCK_MANDATORY, DEVICE_LOCK_OPTIONAL } from "@/types/pods/DEVICE_LOCK";
import { EMAIL_ACCOUNT_MANDATORY, EMAIL_ACCOUNT_OPTIONAL } from "@/types/pods/EMAIL_ACCOUNT";
import { PASSWORD_MANDATORY, PASSWORD_OPTIONAL } from "@/types/pods/PASSWORD";
import { PAYMENT_CARD_MANDATORY, PAYMENT_CARD_OPTIONAL } from "@/types/pods/PAYMENT_CARD";
import { SEED_PHRASE_MANDATORY, SEED_PHRASE_OPTIONAL } from "@/types/pods/SEED_PHRASE";
import type { PodFieldMeta } from "@/types/interfaces";

export const executorFields: Record<string, PodFieldMeta[]> = {
  "bank-accounts": [...BANK_ACCOUNT_MANDATORY, ...BANK_ACCOUNT_OPTIONAL],
  "defi-staking": [...DEFI_STAKING_MANDATORY, ...DEFI_STAKING_OPTIONAL],
  "device-locks": [...DEVICE_LOCK_MANDATORY, ...DEVICE_LOCK_OPTIONAL],
  "email-accounts": [...EMAIL_ACCOUNT_MANDATORY, ...EMAIL_ACCOUNT_OPTIONAL],
  passwords: [...PASSWORD_MANDATORY, ...PASSWORD_OPTIONAL],
  "payment-cards": [...PAYMENT_CARD_MANDATORY, ...PAYMENT_CARD_OPTIONAL],
  "seed-phrases": [...SEED_PHRASE_MANDATORY, ...SEED_PHRASE_OPTIONAL],
};

const sensitiveKeys = new Set([
  "password", "pin", "totp_secret", "phrase", "cvv",
  "card_number", "account_number", "securityAnswer", "backupCodes",
]);

export function isExecutorFieldSensitive(field: PodFieldMeta) {
  return Boolean(field.sensitive || sensitiveKeys.has(field.key));
}
