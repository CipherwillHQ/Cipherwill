// Validates local submissions and strips drafts down to save-command fields.
// Owns answer normalization and the outbound data allowlist.
// Does not include decrypted asset context or server-derived person objects.
import type { GuidanceAnswers, GuidanceDefinition, GuidanceFileAnswer, GuidanceScope, ObjectiveInputSpec } from "@/types/interfaces";
import { isInputValid } from "./inputValidation";
import { prepareGuidanceInput } from "./inputValue";
import { resolveGuidanceValues } from "./ruleEvaluation";
import { normalizeGuidanceFile } from "./fileAnswer";

export function normalizeAnswer(input: ObjectiveInputSpec, value: unknown): string | number | boolean | GuidanceFileAnswer | null {
  if (value === null && input.skippable) return null;
  if (input.type === "file") return normalizeGuidanceFile(value);
  if (input.type === "boolean") {
    if (typeof value !== "boolean") throw new Error("Please choose Yes or No.");
    return value;
  }
  const raw = typeof value === "string" ? prepareGuidanceInput(input, value) : typeof value === "number" ? String(value) : "";
  if (!isInputValid(input, raw)) throw new Error("Please enter a valid answer.");
  if (input.type === "number") return Number(raw);
  return input.type === "email" ? raw.toLowerCase() : raw;
}

export function buildCompletionAnswers(flow: GuidanceDefinition, answers: GuidanceAnswers, scope?: GuidanceScope): GuidanceAnswers {
  const values = scope ? resolveGuidanceValues(flow.completion.values, scope) : {};
  const sources = { ...answers, ...values };
  return Object.fromEntries(flow.completion.fields.filter(field => Object.hasOwn(sources, field))
    .map(field => [field, sources[field]]));
}

export function coerceValueForInput(input: ObjectiveInputSpec, value: string) {
  return input.type === "number" ? Number(value) : value;
}
