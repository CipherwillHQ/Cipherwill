// Supplies independent examples for first-item section guidance regression tests.
// Owns sample encrypted records, input fixtures, and file upload declarations.
// Does not import the backend catalog or upload real vault data.
import type { GuidanceDefinition } from "@/types/interfaces";
import { testAssetSchemas } from "./assetSchemas";

export const segmentAssetCases = [
  { id: "add_first_email_account", type: "EMAIL_ACCOUNT", key: "segment_email_accounts", plan: "free",
    answers: { accountName: "Personal email", email: "sita@example.com", password: "  secret-email-password  " },
    data: { email: "sita@example.com", password: "  secret-email-password  " } },
  { id: "add_first_device_lock", type: "DEVICE_LOCK", key: "segment_device_locks", plan: "free",
    answers: { deviceName: "My phone", password: "001234" }, data: { password: "001234" } },
  { id: "add_first_seed_phrase", type: "SEED_PHRASE", key: "segment_seed_phrases", plan: "premium",
    answers: { walletName: "My wallet", phrase: "  apple\n  bridge cloud  " }, data: { phrase: ["apple", "bridge", "cloud"] } },
  { id: "add_first_defi_staking", type: "DEFI_STAKING", key: "segment_defi_staking", plan: "premium",
    answers: { platform: "Aave", assetName: "USDC", amount: "100.50" },
    data: { platform: "Aave", asset_name: "USDC", asset_amount: "100.50" } },
  { id: "add_first_payment_card", type: "PAYMENT_CARD", key: "segment_payment_cards", plan: "free",
    answers: { cardName: "Debit card", holderName: "Sita Shah", cardNumber: "0011223344556677", expiryDate: "12/2030" },
    data: { card_holder_name: "Sita Shah", card_number: "0011223344556677", expiry_date: "12/2030" } },
] as const;

export const firstFileFixture: GuidanceDefinition = {
  id: "add_first_file", title: "Upload your first file", description: "Save a file.", priority: 31, skippable: true,
  contexts: ["savedAssets"], segment: { key: "segment_storage", planRequired: "premium", requireEnabled: true },
  completedWhen: { path: "context.savedAssets.FILE", operator: "gt", value: 0 },
  steps: [
    { id: "file", title: "Choose a file", subtext: "From your device.", input: { key: "file", type: "file", sensitive: true } },
    { id: "review", title: "Review", subtext: "File: {{answers.file.name}}", continueLabel: "Encrypt and save" },
    { id: "item_id", title: "Prepare", subtext: "Wait", effect: { id: "itemId", type: "create_item_id" } },
    { id: "save_item", title: "Upload", subtext: "Wait", effect: { id: "savedItem", type: "save_encrypted_file", completionExports: ["itemId"],
      args: { itemId: { path: "effects.itemId" }, file: { path: "answers.file" } } } },
  ],
  completion: { mode: "server", fields: ["itemId"], values: { itemId: { path: "effects.savedItem.itemId" } }, title: "Saved", subtext: "Done" },
};

export function firstSegmentAssetFixture(index: number): GuidanceDefinition {
  const item = segmentAssetCases[index];
  const schema = testAssetSchemas[item.type];
  return { ...firstFileFixture, id: item.id, title: item.id, priority: 25 + index,
    segment: { key: item.key, planRequired: item.plan, requireEnabled: true },
    completedWhen: { path: `context.savedAssets.${item.type}`, operator: "gt", value: 0 },
    steps: [
      ...schema.inputs.map(input => ({ id: input.key, title: input.key, subtext: "Enter value.", input })),
      { id: "review", title: "Review", subtext: "Confirm saving.", continueLabel: "Encrypt and save" },
      firstFileFixture.steps[2],
      { ...firstFileFixture.steps[3], effect: { id: "savedItem", type: "save_encrypted_asset", completionExports: ["itemId"],
        args: { schema: { literal: schema }, itemId: { path: "effects.itemId" },
          ...Object.fromEntries(schema.inputs.map(input => [input.key, { path: `answers.${input.key}` }])) } } },
    ],
  };
}
