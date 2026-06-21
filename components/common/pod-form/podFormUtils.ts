// PodForm utilities: value checking and group map construction.
// Owns: fieldHasValue, buildGroupMap. Does NOT own rendering or state.
import type { PodFieldConfig } from "@/types/interfaces";
import logger from "@/common/debug/logger";

export function fieldHasValue(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return !isNaN(value);
  return false;
}

export function buildGroupMap(
  fields: readonly PodFieldConfig[]
): Map<string, PodFieldConfig[]> {
  const map = new Map<string, PodFieldConfig[]>();
  for (const f of fields) {
    if (f.group) {
      const list = map.get(f.group.id);
      if (list) list.push(f);
      else map.set(f.group.id, [f]);
    }
  }

  for (const [groupId, groupFields] of map) {
    if (groupFields.length < 2) {
      map.delete(groupId);
      continue;
    }
    const vis = groupFields[0]!.visibility;
    const hasMixed = groupFields.some((f) => f.visibility !== vis);
    if (hasMixed) {
      const fieldNames = groupFields.map((g) => `"${g.key}" (${g.visibility})`).join(", ");
      logger.error(
        `Group "${groupId}" has mixed visibility: [${fieldNames}]. All fields in a group must share visibility. Dropping group.`
      );
      map.delete(groupId);
    }
  }

  return map;
}
