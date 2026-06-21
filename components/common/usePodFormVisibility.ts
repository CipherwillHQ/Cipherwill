// Computes which fields, groups, and sections are visible based on data, manual add/remove state.
// Owns: visibility derivation. Does NOT own rendering or animation.
import { useMemo } from "react";
import type { PodFieldConfig, PodCustomSectionDef, VisibilityState } from "@/types/interfaces";
import { fieldHasValue, buildGroupMap } from "./podFormUtils";

export function usePodFormVisibility(
  fields: PodFieldConfig[],
  customSections: PodCustomSectionDef[],
  data: Record<string, any>,
  manuallyAdded: Set<string>,
  manuallyRemoved: Set<string>,
): VisibilityState {
  return useMemo(() => {
    const mandatoryFields = fields.filter((f) => f.visibility === "mandatory");
    const toggleableFields = fields.filter((f) => f.visibility !== "mandatory");
    const mandatoryGroupsMap = buildGroupMap(mandatoryFields);
    const toggleableGroupsMap = buildGroupMap(toggleableFields);
    const standaloneMandatory = mandatoryFields.filter((f) => !f.group);
    const standaloneToggleable = toggleableFields.filter((f) => !f.group);
    const mandatorySections = customSections.filter((s) => s.visibility === "mandatory");
    const toggleableSections = customSections.filter((s) => s.visibility !== "mandatory");

    const visibleFieldKeys = new Set<string>();
    toggleableFields.forEach((f) => {
      if (fieldHasValue(data[f.key])) visibleFieldKeys.add(f.key);
      if (manuallyAdded.has(f.key)) visibleFieldKeys.add(f.key);
      if (manuallyRemoved.has(f.key)) visibleFieldKeys.delete(f.key);
    });

    const visibleGroupIds = new Set<string>();
    toggleableGroupsMap.forEach((groupFields, groupId) => {
      if (groupFields.some((f) => visibleFieldKeys.has(f.key))) visibleGroupIds.add(groupId);
    });

    const visibleStandalone = standaloneToggleable.filter((f) => visibleFieldKeys.has(f.key));
    const visibleGroups = Array.from(toggleableGroupsMap.entries()).filter(([id]) => visibleGroupIds.has(id));
    const visibleSections = toggleableSections.filter((s) => {
      if (fieldHasValue(data[s.dataKey])) return true;
      if (manuallyAdded.has(s.key)) return true;
      if (manuallyRemoved.has(s.key)) return false;
      return false;
    });

    const dropdownFields = standaloneToggleable
      .filter((f) => !visibleFieldKeys.has(f.key))
      .map((f) => ({ key: f.key, label: f.label }));
    const dropdownGroups = Array.from(toggleableGroupsMap.entries())
      .filter(([id]) => !visibleGroupIds.has(id))
      .map(([id, groupFields]) => ({ key: id, label: groupFields[0]!.group!.label }));
    const dropdownSections = toggleableSections
      .filter((s) => !visibleSections.some((vs) => vs.key === s.key))
      .map((s) => ({ key: s.key, label: s.label }));
    const hasAvailableItems = dropdownFields.length > 0 || dropdownGroups.length > 0 || dropdownSections.length > 0;

    return {
      mandatoryFields,
      mandatoryGroupsMap,
      toggleableGroupsMap,
      standaloneMandatory,
      mandatorySections,
      visibleStandalone,
      visibleGroups,
      visibleSections,
      dropdownFields,
      dropdownGroups,
      dropdownSections,
      hasAvailableItems,
    };
  }, [fields, customSections, data, manuallyAdded, manuallyRemoved]);
}
