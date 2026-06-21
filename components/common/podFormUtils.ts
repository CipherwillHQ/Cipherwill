// PodForm utilities: value checking and group map construction.
// Owns: fieldHasValue, buildGroupMap. Does NOT own rendering or state.
import type { PodFieldConfig } from "./PodForm";

export function fieldHasValue(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return !isNaN(value);
  if (typeof value === "boolean") return value === true;
  return typeof value === "object" && Object.keys(value as object).length > 0;
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

  for (const [groupId, groupFields] of map) {
    if (groupFields.length < 2) {
      map.delete(groupId);
      groupFields.forEach((f) => {
        delete f.group;
      });
      continue;
    }
    const vis = groupFields[0]!.visibility;
    for (const f of groupFields) {
      if (f.visibility !== vis) {
        const fieldNames = groupFields.map((g) => `"${g.key}" (${g.visibility})`).join(", ");
        throw new Error(
          `Group "${groupId}" has mixed visibility: [${fieldNames}]. All fields in a group must have the same visibility value.`
        );
      }
    }
  }

  return map;
}
