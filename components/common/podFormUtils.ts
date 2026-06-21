import type { PodFieldConfig } from "./PodForm";

export function fieldHasValue(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return false;
}

export function buildGroupMap(
  fields: PodFieldConfig[]
): Map<string, PodFieldConfig[]> {
  const map = new Map<string, PodFieldConfig[]>();
  fields.forEach((f) => {
    if (f.group) {
      const existing = map.get(f.group.id) || [];
      existing.push(f);
      map.set(f.group.id, existing);
    }
  });
  return map;
}
