// Manages pod form add/remove field and group actions, plus field visibility helpers.
// Owns: markAdded, markRemoved, addGroup, removeGroup, isSkippable, isAddable, isGroupSkippable. Does NOT own data or save logic.
"use client";
import { useCallback, useMemo } from "react";
import type { PodFieldConfig } from "@/types/interfaces";
import { buildGroupMap } from "./podFormUtils";

interface UsePodFormActionsParams<T> {
  fields: PodFieldConfig[];
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  manuallyAdded: Set<string>;
  setManuallyAdded: React.Dispatch<React.SetStateAction<Set<string>>>;
  manuallyRemoved: Set<string>;
  setManuallyRemoved: React.Dispatch<React.SetStateAction<Set<string>>>;
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UsePodFormActionsReturn {
  markAdded: (key: string) => void;
  markRemoved: (key: string) => void;
  addGroup: (groupId: string) => void;
  removeGroup: (groupId: string) => void;
  isSkippable: (key: string) => boolean;
  isAddable: (key: string) => boolean;
  isGroupSkippable: (groupId: string) => boolean;
}

export function usePodFormActions<T extends Record<string, any>>(
  params: UsePodFormActionsParams<T>,
): UsePodFormActionsReturn {
  const {
    fields, data, setData,
    manuallyAdded, setManuallyAdded,
    manuallyRemoved, setManuallyRemoved,
    setIsDirty,
  } = params;

  const fieldIndex = useMemo(() => {
    const m = new Map<string, PodFieldConfig>();
    for (const f of fields) m.set(f.key, f);
    return m;
  }, [fields]);

  const toggleableGroupsMap = useMemo(
    () => buildGroupMap(fields.filter((f) => f.visibility !== "mandatory")),
    [fields],
  );

  const markAdded = useCallback((key: string) => {
    setManuallyAdded((prev) => new Set(prev).add(key));
    setManuallyRemoved((prev) => { const n = new Set(prev); n.delete(key); return n; });
    setIsDirty(true);
  }, [setManuallyAdded, setManuallyRemoved, setIsDirty]);

  const markRemoved = useCallback((key: string) => {
    setManuallyAdded((prev) => { const n = new Set(prev); n.delete(key); return n; });
    setManuallyRemoved((prev) => new Set(prev).add(key));
    setData((prev) => ({ ...prev, [key]: "" }));
    setIsDirty(true);
  }, [setManuallyAdded, setManuallyRemoved, setData, setIsDirty]);

  const addGroup = useCallback((groupId: string) => {
    const g = toggleableGroupsMap.get(groupId) || [];
    setManuallyAdded((prev) => { const n = new Set(prev); g.forEach((f) => n.add(f.key)); return n; });
    setManuallyRemoved((prev) => { const n = new Set(prev); g.forEach((f) => n.delete(f.key)); return n; });
    setIsDirty(true);
  }, [toggleableGroupsMap, setManuallyAdded, setManuallyRemoved, setIsDirty]);

  const removeGroup = useCallback((groupId: string) => {
    const g = toggleableGroupsMap.get(groupId) || [];
    setManuallyAdded((prev) => { const n = new Set(prev); g.forEach((f) => n.delete(f.key)); return n; });
    setManuallyRemoved((prev) => { const n = new Set(prev); g.forEach((f) => n.add(f.key)); return n; });
    setData((prev) => {
      const next = { ...prev } as T;
      g.forEach((f) => { (next as Record<string, any>)[f.key] = ""; });
      return next;
    });
    setIsDirty(true);
  }, [toggleableGroupsMap, setManuallyAdded, setManuallyRemoved, setData, setIsDirty]);

  const isSkippable = useCallback(
    (key: string) => fieldIndex.get(key)?.visibility === "skippable",
    [fieldIndex],
  );

  const isAddable = useCallback(
    (key: string) => fieldIndex.get(key)?.visibility !== "mandatory",
    [fieldIndex],
  );

  const isGroupSkippable = useCallback(
    (groupId: string) =>
      fields.filter((f) => f.group?.id === groupId).every((f) => f.visibility === "skippable"),
    [fields],
  );

  return { markAdded, markRemoved, addGroup, removeGroup, isSkippable, isAddable, isGroupSkippable };
}
