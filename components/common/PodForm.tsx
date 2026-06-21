// Config-driven pod form with mandatory/optional/skippable field visibility.
// Owns: field visibility logic, add/remove toggles for optional items. Does NOT own rendering or data fetching.
"use client";
import { useState, useMemo, useCallback, forwardRef, useImperativeHandle } from "react";
import PodFormRenderer from "./PodFormRenderer";
import { fieldHasValue, buildGroupMap } from "./podFormUtils";

export type PodFieldVisibility = "mandatory" | "optional" | "skippable";

export interface PodFieldConfig {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "password" | "textarea";
  visibility: PodFieldVisibility;
  group?: { id: string; label: string };
}

export interface PodCustomSectionDef {
  key: string;
  label: string;
  dataKey: string;
  visibility: PodFieldVisibility;
}

export interface PodFormHandle {
  addField: (key: string) => void;
  addGroup: (groupId: string) => void;
  addSection: (key: string) => void;
}

interface PodFormProps {
  fields: PodFieldConfig[];
  data: Record<string, any>;
  onChange: (key: string, value: string) => void;
  customSections?: PodCustomSectionDef[];
  renderCustomSection?: (key: string) => React.ReactNode;
  onRemoveCustomSection?: (key: string) => void;
}

const PodForm = forwardRef<PodFormHandle, PodFormProps>(function PodForm({
  fields,
  data,
  onChange,
  customSections = [],
  renderCustomSection,
  onRemoveCustomSection,
}, ref) {
  const mandatoryFields = useMemo(() => fields.filter((f) => f.visibility === "mandatory"), [fields]);
  const toggleableFields = useMemo(() => fields.filter((f) => f.visibility !== "mandatory"), [fields]);

  const mandatoryGroupsMap = useMemo(() => buildGroupMap(mandatoryFields), [mandatoryFields]);
  const toggleableGroupsMap = useMemo(() => buildGroupMap(toggleableFields), [toggleableFields]);

  const standaloneMandatory = useMemo(
    () => mandatoryFields.filter((f) => !f.group),
    [mandatoryFields]
  );
  const standaloneToggleable = useMemo(
    () => toggleableFields.filter((f) => !f.group),
    [toggleableFields]
  );

  const mandatorySections = useMemo(
    () => customSections.filter((s) => s.visibility === "mandatory"),
    [customSections]
  );
  const toggleableSections = useMemo(
    () => customSections.filter((s) => s.visibility !== "mandatory"),
    [customSections]
  );

  const [manuallyAdded, setManuallyAdded] = useState<Set<string>>(new Set());
  const [manuallyRemoved, setManuallyRemoved] = useState<Set<string>>(new Set());
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleFieldKeys = useMemo(() => {
    const keys = new Set<string>();
    toggleableFields.forEach((f) => {
      if (fieldHasValue(data[f.key])) keys.add(f.key);
      if (manuallyAdded.has(f.key)) keys.add(f.key);
      if (manuallyRemoved.has(f.key)) keys.delete(f.key);
    });
    return keys;
  }, [toggleableFields, data, manuallyAdded, manuallyRemoved]);

  const visibleGroupIds = useMemo(() => {
    const ids = new Set<string>();
    toggleableGroupsMap.forEach((groupFields, groupId) => {
      if (groupFields.some((f) => visibleFieldKeys.has(f.key))) ids.add(groupId);
    });
    return ids;
  }, [toggleableGroupsMap, visibleFieldKeys]);

  const visibleStandalone = useMemo(
    () => standaloneToggleable.filter((f) => visibleFieldKeys.has(f.key)),
    [standaloneToggleable, visibleFieldKeys]
  );

  const visibleGroups = useMemo(
    () =>
      Array.from(toggleableGroupsMap.entries()).filter(([groupId]) =>
        visibleGroupIds.has(groupId)
      ),
    [toggleableGroupsMap, visibleGroupIds]
  );

  const visibleSections = useMemo(() => {
    return toggleableSections.filter((s) => {
      if (fieldHasValue(data[s.dataKey])) return true;
      if (manuallyAdded.has(s.key)) return true;
      if (manuallyRemoved.has(s.key)) return false;
      return false;
    });
  }, [toggleableSections, data, manuallyAdded, manuallyRemoved]);

  const dropdownFields = useMemo(
    () =>
      standaloneToggleable
        .filter((f) => !visibleFieldKeys.has(f.key))
        .map((f) => ({ key: f.key, label: f.label })),
    [standaloneToggleable, visibleFieldKeys]
  );

  const dropdownGroups = useMemo(
    () =>
      Array.from(toggleableGroupsMap.entries())
        .filter(([groupId]) => !visibleGroupIds.has(groupId))
        .map(([groupId, groupFields]) => ({
          key: groupId,
          label: groupFields[0]!.group!.label,
        })),
    [toggleableGroupsMap, visibleGroupIds]
  );

  const dropdownSections = useMemo(
    () =>
      toggleableSections
        .filter((s) => !visibleSections.find((vs) => vs.key === s.key))
        .map((s) => ({ key: s.key, label: s.label })),
    [toggleableSections, visibleSections]
  );

  const hasAvailableItems =
    dropdownFields.length > 0 || dropdownGroups.length > 0 || dropdownSections.length > 0;

  const markAdded = useCallback((key: string) => {
    setManuallyAdded((prev) => new Set(prev).add(key));
    setManuallyRemoved((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
    setMenuOpen(false);
  }, []);

  const markRemoved = useCallback(
    (key: string) => {
      setManuallyAdded((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      setManuallyRemoved((prev) => new Set(prev).add(key));
      onChange(key, "");
    },
    [onChange]
  );

  const addGroup = useCallback(
    (groupId: string) => {
      const groupFields = toggleableGroupsMap.get(groupId) || [];
      setManuallyAdded((prev) => {
        const next = new Set(prev);
        groupFields.forEach((f) => next.add(f.key));
        return next;
      });
      setManuallyRemoved((prev) => {
        const next = new Set(prev);
        groupFields.forEach((f) => next.delete(f.key));
        return next;
      });
      setMenuOpen(false);
    },
    [toggleableGroupsMap]
  );

  const removeGroup = useCallback(
    (groupId: string) => {
      const groupFields = toggleableGroupsMap.get(groupId) || [];
      setManuallyAdded((prev) => {
        const next = new Set(prev);
        groupFields.forEach((f) => next.delete(f.key));
        return next;
      });
      setManuallyRemoved((prev) => {
        const next = new Set(prev);
        groupFields.forEach((f) => next.add(f.key));
        return next;
      });
      groupFields.forEach((f) => onChange(f.key, ""));
    },
    [toggleableGroupsMap, onChange]
  );

  const removeSection = useCallback(
    (key: string) => {
      markRemoved(key);
      onRemoveCustomSection?.(key);
    },
    [markRemoved, onRemoveCustomSection]
  );

  useImperativeHandle(ref, () => ({
    addField: markAdded,
    addGroup,
    addSection: markAdded,
  }), [markAdded, addGroup]);

  if (fields.length === 0 && customSections.length === 0) return null;

  return (
    <PodFormRenderer
      standaloneMandatory={standaloneMandatory}
      mandatoryGroups={Array.from(mandatoryGroupsMap.entries())}
      mandatorySections={mandatorySections}
      visibleStandalone={visibleStandalone}
      visibleGroups={visibleGroups}
      visibleSections={visibleSections}
      dropdownFields={dropdownFields}
      dropdownGroups={dropdownGroups}
      dropdownSections={dropdownSections}
      menuOpen={menuOpen}
      hasAvailableItems={hasAvailableItems}
      data={data}
      onChange={onChange}
      renderCustomSection={renderCustomSection}
      onRemoveField={markRemoved}
      onRemoveGroup={removeGroup}
      onRemoveSection={removeSection}
      onAddField={markAdded}
      onAddGroup={addGroup}
      onAddSection={markAdded}
      onOpenMenu={() => setMenuOpen(true)}
      onCloseMenu={() => setMenuOpen(false)}
    />
  );
});

export default PodForm;
