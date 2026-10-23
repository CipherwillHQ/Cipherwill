// Builds encrypted text payloads from catalog-declared allowlisted fields.
// Owns input validation and plain-text-to-HTML mapping for note fields.
// Does not decide asset categories, save plaintext, or generate keys.
import type { GuidanceAssetSchema, GuidedAssetInput } from "@/types/interfaces";
import { normalizeAnswer } from "./submission";
import { plainTextToHtml } from "@/common/security/plainTextToHtml";

export function buildGuidedAssetInput(args: Record<string, unknown>, schema: GuidanceAssetSchema): GuidedAssetInput {
  const itemId = args.itemId;
  if (typeof itemId !== "string" || !/^[\w-]{6,100}$/.test(itemId)) throw new Error("Invalid item ID");
  const answers: Record<string, string | number | boolean | null> = {};
  for (const input of schema.inputs) answers[input.key] = normalizeAnswer(input, args[input.key]);
  const metadata = Object.fromEntries(Object.entries(schema.metadata).map(([key, answer]) => {
    if (typeof answers[answer] !== "string") throw new Error("Invalid asset metadata");
    return [key, answers[answer]];
  }));
  const data = Object.fromEntries(Object.entries(schema.fields).map(([key, field]) => {
    if (!Object.hasOwn(answers, field.answer)) throw new Error("Unknown asset field");
    const value = answers[field.answer];
    return [key, field.format === "plain_text_html" ? plainTextToHtml(String(value ?? "")) : value];
  }));
  return { itemId, type: schema.type, metadata, pod: { type: schema.podType, version: schema.version, data } };
}
