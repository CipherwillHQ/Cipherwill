// Supplies independent first-item fixtures for browser engine contract tests.
// Owns representative note, bank, and password questions and save mappings.
// Does not register production objectives or import another repository.
import type { GuidanceDefinition } from "@/types/interfaces";
import { testAssetSchemas } from "./assetSchemas";

export const assetCases = [
  { id: "add_first_note", type: "NOTE", fields: ["title", "content"], values: ["Family note", "Private message"] },
  { id: "add_first_bank_account", type: "BANK_ACCOUNT", fields: ["bankName", "accountNumber"], values: ["Example Bank", "00123456789"] },
  { id: "add_first_password", type: "PASSWORD", fields: ["service", "username", "password"], values: ["Email", "family@example.com", "  Secret password  "] },
];

export function firstAssetFixture(index: number): GuidanceDefinition {
  const item = assetCases[index];
  return {
    id: item.id, title: item.id, description: "Save an important item", priority: index, skippable: true,
    contexts: ["savedAssets"], completedWhen: { path: `context.savedAssets.${item.type}`, operator: "gt", value: 0 },
    steps: [
      ...item.fields.map(key => ({ id: key, title: key, subtext: "Enter the required detail",
        input: { key, type: "single_line_text" as const, minLength: 1, maxLength: 4096, sensitive: key === "password" } })),
      { id: "review", title: "Review", subtext: item.fields.filter(key => key !== "password")
        .map(key => `{{answers.${key}}}`).join("\n"), continueLabel: "Encrypt and save" },
      { id: "item_id", title: "Preparing", subtext: "Wait", effect: { id: "itemId", type: "create_item_id" } },
      { id: "save_item", title: "Saving", subtext: "Wait", effect: { id: "savedItem", type: "save_encrypted_asset", completionExports: ["itemId"],
        args: { schema: { literal: testAssetSchemas[item.type] }, itemId: { path: "effects.itemId" },
          ...Object.fromEntries(item.fields.map(key => [key, { path: `answers.${key}` }])) } } },
    ],
    completion: { mode: "server", fields: ["itemId"], values: { itemId: { path: "effects.savedItem.itemId" } },
      title: "Saved", subtext: "You can add more details later", displayForMs: 3000 },
  };
}
