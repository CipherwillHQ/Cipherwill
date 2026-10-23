// Evaluates catalog conditions and interpolates plain-text templates locally.
// Owns explicit scope paths and safe primitive value resolution.
// Does not evaluate JavaScript, render HTML, or send context to the server.
import type { GuidanceCondition, GuidanceScope, GuidanceText, GuidanceValue } from "@/types/interfaces";

export function conditionUsesContext(condition: GuidanceCondition): boolean {
  if ("all" in condition) return condition.all.some(conditionUsesContext);
  if ("any" in condition) return condition.any.some(conditionUsesContext);
  if ("not" in condition) return conditionUsesContext(condition.not);
  return condition.path.startsWith("context.");
}

export function readGuidancePath(scope: GuidanceScope, path: string): unknown {
  let value: unknown = scope;
  for (const key of path.split(".")) {
    if (!value || typeof value !== "object" || ["__proto__", "constructor", "prototype"].includes(key)
      || !Object.hasOwn(value, key)) return undefined;
    value = (value as Record<string, unknown>)[key];
  }
  return value;
}

export function matchesCondition(condition: GuidanceCondition | undefined, scope: GuidanceScope): boolean {
  if (!condition) return true;
  if ("all" in condition) return condition.all.every(item => matchesCondition(item, scope));
  if ("any" in condition) return condition.any.some(item => matchesCondition(item, scope));
  if ("not" in condition) return !matchesCondition(condition.not, scope);
  const value = readGuidancePath(scope, condition.path);
  const present = value !== undefined && value !== null && (typeof value !== "string" || value.trim().length > 0);
  switch (condition.operator) {
    case "present": return present;
    case "missing": return !present;
    case "equals": return value === condition.value;
    case "includes": return Array.isArray(value) && value.includes(condition.value);
    case "gt": return typeof value === "number" && typeof condition.value === "number" && value > condition.value;
    case "gte": return typeof value === "number" && typeof condition.value === "number" && value >= condition.value;
    case "lt": return typeof value === "number" && typeof condition.value === "number" && value < condition.value;
    case "lte": return typeof value === "number" && typeof condition.value === "number" && value <= condition.value;
    default: throw new Error("Unsupported guidance condition");
  }
}

export function renderGuidanceText(text: GuidanceText, scope: GuidanceScope): string {
  const template = typeof text === "string" ? text : text.find(item => matchesCondition(item.when, scope))?.text ?? "";
  return template.replace(/\{\{([\w.]+)\}\}/g, (_match, path: string) => {
    const value = readGuidancePath(scope, path);
    return ["string", "number", "boolean"].includes(typeof value) ? String(value) : "";
  });
}

export function resolveGuidanceValues(values: Record<string, GuidanceValue> | undefined, scope: GuidanceScope) {
  return Object.fromEntries(Object.entries(values ?? {}).map(([key, value]) =>
    [key, "path" in value ? readGuidancePath(scope, value.path) : value.literal]));
}
