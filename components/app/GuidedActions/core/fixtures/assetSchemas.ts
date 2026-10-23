// Supplies independent schemas for encrypted asset mapping regression tests.
// Owns examples of catalog-declared categories and model field mappings.
// Does not register objectives or import backend production definitions.
import type { GuidanceAssetSchema } from "@/types/interfaces";

export const testAssetSchemas: Record<string, GuidanceAssetSchema> = {
  NOTE: { type: "NOTE", podType: "note", version: "0.0.2", metadata: { title: "title" },
    fields: { content: { answer: "content", format: "plain_text_html" } },
    inputs: [{ key: "title", type: "single_line_text", minLength: 1 }, { key: "content", type: "multi_line_text", minLength: 1 }] },
  BANK_ACCOUNT: { type: "BANK_ACCOUNT", podType: "bank_account", version: "0.0.1", metadata: { name: "bankName" },
    fields: { bank_name: { answer: "bankName" }, account_number: { answer: "accountNumber" } },
    inputs: [{ key: "bankName", type: "single_line_text", minLength: 1 }, { key: "accountNumber", type: "single_line_text", minLength: 1 }] },
  PASSWORD: { type: "PASSWORD", podType: "password", version: "0.0.1", metadata: { name: "service" },
    fields: { username: { answer: "username" }, password: { answer: "password" } },
    inputs: [{ key: "service", type: "single_line_text", minLength: 1 }, { key: "username", type: "single_line_text", minLength: 1 },
      { key: "password", type: "single_line_text", minLength: 1, sensitive: true }] },
  EMAIL_ACCOUNT: { type: "EMAIL_ACCOUNT", podType: "email_account", version: "0.0.1", metadata: { name: "accountName" },
    fields: { email: { answer: "email" }, password: { answer: "password" } },
    inputs: [{ key: "accountName", type: "single_line_text", minLength: 1 }, { key: "email", type: "email" },
      { key: "password", type: "single_line_text", minLength: 1, sensitive: true }] },
  DEVICE_LOCK: { type: "DEVICE_LOCK", podType: "device_lock", version: "0.0.1", metadata: { name: "deviceName" },
    fields: { password: { answer: "password" } },
    inputs: [{ key: "deviceName", type: "single_line_text", minLength: 1 }, { key: "password", type: "single_line_text", minLength: 1, sensitive: true }] },
  SEED_PHRASE: { type: "SEED_PHRASE", podType: "seed_phrase", version: "0.0.1", metadata: { name: "walletName" },
    fields: { phrase: { answer: "phrase", format: "word_list" } },
    inputs: [{ key: "walletName", type: "single_line_text", minLength: 1 }, { key: "phrase", type: "single_line_text", minLength: 1, sensitive: true }] },
  DEFI_STAKING: { type: "DEFI_STAKING", podType: "defi_staking", version: "0.0.1", metadata: { name: "platform" },
    fields: { platform: { answer: "platform" }, asset_name: { answer: "assetName" }, asset_amount: { answer: "amount" } },
    inputs: [{ key: "platform", type: "single_line_text", minLength: 1 }, { key: "assetName", type: "single_line_text", minLength: 1 },
      { key: "amount", type: "single_line_text", minLength: 1 }] },
  PAYMENT_CARD: { type: "PAYMENT_CARD", podType: "payment_card", version: "0.0.1", metadata: { name: "cardName" },
    fields: { card_holder_name: { answer: "holderName" }, card_number: { answer: "cardNumber" }, expiry_date: { answer: "expiryDate" } },
    inputs: [{ key: "cardName", type: "single_line_text", minLength: 1 }, { key: "holderName", type: "single_line_text", minLength: 1 },
      { key: "cardNumber", type: "single_line_text", minLength: 1, sensitive: true }, { key: "expiryDate", type: "single_line_text", pattern: "^(0[1-9]|1[0-2])/\\d{4}$" }] },
};
