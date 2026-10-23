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
};
