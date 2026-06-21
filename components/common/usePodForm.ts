// Shared hook for pod forms: data, dirty tracking, save, visibility, add/remove, preview toggle.
// Owns: state, save orchestration, visibility derivation, add/remove handlers, mobile preview open. Does NOT own rendering.
"use client";
import { useState, useCallback, useRef, useMemo } from "react";
import { usePod } from "@/contexts/PodHelper";
import { useMetamodelData } from "@/common/useMetamodelData";
import type { POD_TYPE } from "@/types/POD";
import type { PodFieldConfig, PodCustomSectionDef, VisibilityState } from "@/types/interfaces";
import { usePodFormVisibility } from "./usePodFormVisibility";
import toast from "react-hot-toast";

interface UsePodFormConfig {
  podType: POD_TYPE;
  version: string;
  refId: string;
  fields: PodFieldConfig[];
  customSections?: PodCustomSectionDef[];
}

export interface UsePodFormReturn<T> {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  loading: boolean;
  error: string | null;
  isUpdating: boolean;
  handleSave: () => Promise<void>;
  isDirty: boolean;
  previewOpen: boolean;
  setPreviewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  metamodel: ReturnType<typeof useMetamodelData>;
  vis: VisibilityState;
  onChange: (key: string, value: string) => void;
  markAdded: (key: string) => void;
  markRemoved: (key: string) => void;
  addGroup: (groupId: string) => void;
  removeGroup: (groupId: string) => void;
  isSkippable: (key: string) => boolean;
  isAddable: (key: string) => boolean;
  isGroupSkippable: (groupId: string) => boolean;
  addAndClose: (key: string) => void;
}

export function usePodForm<T extends Record<string, any>>(
  sample: T,
  config: UsePodFormConfig,
): UsePodFormReturn<T> {
  const { podType, version, refId, fields, customSections = [] } = config;
  const [data, setDataState] = useState<T>({} as T);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [manuallyAdded, setManuallyAdded] = useState<Set<string>>(new Set());
  const [manuallyRemoved, setManuallyRemoved] = useState<Set<string>>(new Set());
  const dirtyRef = useRef(false);
  const [, forceTick] = useState(0);
  const metamodel = useMetamodelData(refId);

  const { loading, error, savePod, is_updating: isUpdating } = usePod<T>(
    { TYPE: podType, VERSION: version, REF_ID: refId, DATA_SAMPLE: sample },
    {
      onComplete: (d: null | T) => {
        if (d) { setDataState(d); dirtyRef.current = false; }
      },
    },
  );

  const markDirty = useCallback(() => {
    if (dirtyRef.current) return;
    dirtyRef.current = true;
    forceTick((n) => n + 1);
  }, []);

  const setData = useCallback<typeof setDataState>((updater) => {
    setDataState((prev) => (typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater));
    markDirty();
  }, [markDirty]);

  const handleSave = useCallback(async () => {
    try {
      await savePod(data, { metamodel_id: refId });
      dirtyRef.current = false;
      forceTick((n) => n + 1);
    } catch {
      toast.error("Failed to save changes. Please try again.");
    }
  }, [savePod, data, refId]);

  const onChange = useCallback((key: string, value: string) => {
    setDataState((prev) => ({ ...prev, [key]: value }));
    markDirty();
  }, [markDirty]);

  const vis = usePodFormVisibility(fields, customSections, data, manuallyAdded, manuallyRemoved);

  const fieldIndex = useMemo(() => {
    const m = new Map<string, PodFieldConfig>();
    for (const f of fields) m.set(f.key, f);
    return m;
  }, [fields]);

  const markAdded = useCallback((key: string) => {
    setManuallyAdded((prev) => new Set(prev).add(key));
    setManuallyRemoved((prev) => { const n = new Set(prev); n.delete(key); return n; });
    markDirty();
  }, [markDirty]);

  const markRemoved = useCallback((key: string) => {
    setManuallyAdded((prev) => { const n = new Set(prev); n.delete(key); return n; });
    setManuallyRemoved((prev) => new Set(prev).add(key));
    setDataState((prev) => ({ ...prev, [key]: "" }));
    markDirty();
  }, [markDirty]);

  const addGroup = useCallback((groupId: string) => {
    const g = vis.toggleableGroupsMap.get(groupId) || [];
    setManuallyAdded((prev) => { const n = new Set(prev); g.forEach((f) => n.add(f.key)); return n; });
    setManuallyRemoved((prev) => { const n = new Set(prev); g.forEach((f) => n.delete(f.key)); return n; });
    markDirty();
  }, [vis.toggleableGroupsMap, markDirty]);

  const removeGroup = useCallback((groupId: string) => {
    const g = vis.toggleableGroupsMap.get(groupId) || [];
    setManuallyAdded((prev) => { const n = new Set(prev); g.forEach((f) => n.delete(f.key)); return n; });
    setManuallyRemoved((prev) => { const n = new Set(prev); g.forEach((f) => n.add(f.key)); return n; });
    setDataState((prev) => {
      const next = { ...prev } as T;
      g.forEach((f) => { (next as Record<string, any>)[f.key] = ""; });
      return next;
    });
    markDirty();
  }, [vis.toggleableGroupsMap, markDirty]);

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

  const addAndClose = useCallback((key: string) => {
    markAdded(key);
    setPreviewOpen(false);
  }, [markAdded]);

  return {
    data, setData,
    loading, error, isUpdating,
    handleSave,
    isDirty: dirtyRef.current,
    previewOpen, setPreviewOpen,
    metamodel,
    vis,
    onChange,
    markAdded, markRemoved, addGroup, removeGroup,
    isSkippable, isAddable, isGroupSkippable,
    addAndClose,
  };
}
