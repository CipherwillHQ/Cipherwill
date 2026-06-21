// Shared hook for pod forms: data, dirty tracking, save, preview toggle, add/remove state.
// Owns: state management, save orchestration, visibility derivation, add/remove handlers. Does NOT own rendering.
"use client";
import { useState, useCallback } from "react";
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

interface UsePodFormReturn<T> {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  loading: boolean;
  error: string | null;
  isUpdating: boolean;
  handleSave: () => Promise<void>;
  previewOpen: boolean;
  setPreviewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDirty: boolean;
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
  addSectionAndClose: (key: string) => void;
}

export function usePodForm<T extends Record<string, any>>(
  sample: T,
  config: UsePodFormConfig,
): UsePodFormReturn<T> {
  const { podType, version, refId, fields, customSections = [] } = config;
  const [data, setData] = useState<T>({} as T);
  const [initialData, setInitialData] = useState<T | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [manuallyAdded, setManuallyAdded] = useState<Set<string>>(new Set());
  const [manuallyRemoved, setManuallyRemoved] = useState<Set<string>>(new Set());
  const metamodel = useMetamodelData(refId);

  const { loading, error, savePod, is_updating: isUpdating } = usePod<T>(
    { TYPE: podType, VERSION: version, REF_ID: refId, DATA_SAMPLE: sample },
    {
      onComplete: (d: null | T) => {
        if (d) { setData(d); setInitialData(d); }
      },
    },
  );

  const isDirty = initialData !== null && JSON.stringify(initialData) !== JSON.stringify(data);

  const handleSave = useCallback(async () => {
    try {
      await savePod(data, { metamodel_id: refId });
      setInitialData(JSON.parse(JSON.stringify(data)));
    } catch {
      toast.error("Failed to save changes. Please try again.");
    }
  }, [savePod, data, refId]);

  const onChange = useCallback((key: string, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const vis = usePodFormVisibility(fields, customSections, data, manuallyAdded, manuallyRemoved);

  const markAdded = useCallback((key: string) => {
    setManuallyAdded((prev) => new Set(prev).add(key));
    setManuallyRemoved((prev) => { const n = new Set(prev); n.delete(key); return n; });
  }, []);

  const markRemoved = useCallback((key: string) => {
    setManuallyAdded((prev) => { const n = new Set(prev); n.delete(key); return n; });
    setManuallyRemoved((prev) => new Set(prev).add(key));
    onChange(key, "");
  }, [onChange]);

  const addGroup = useCallback((groupId: string) => {
    const g = vis.toggleableGroupsMap.get(groupId) || [];
    setManuallyAdded((prev) => { const n = new Set(prev); g.forEach((f) => n.add(f.key)); return n; });
    setManuallyRemoved((prev) => { const n = new Set(prev); g.forEach((f) => n.delete(f.key)); return n; });
  }, [vis.toggleableGroupsMap]);

  const removeGroup = useCallback((groupId: string) => {
    const g = vis.toggleableGroupsMap.get(groupId) || [];
    setManuallyAdded((prev) => { const n = new Set(prev); g.forEach((f) => n.delete(f.key)); return n; });
    setManuallyRemoved((prev) => { const n = new Set(prev); g.forEach((f) => n.add(f.key)); return n; });
    g.forEach((f) => onChange(f.key, ""));
  }, [vis.toggleableGroupsMap, onChange]);

  const isSkippable = useCallback(
    (key: string) => fields.find((f) => f.key === key)?.visibility === "skippable",
    [fields],
  );

  const isAddable = useCallback(
    (key: string) => fields.find((f) => f.key === key)?.visibility !== "mandatory",
    [fields],
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

  const addSectionAndClose = useCallback((key: string) => {
    markAdded(key);
    setPreviewOpen(false);
  }, [markAdded]);

  return {
    data, setData,
    loading, error, isUpdating,
    handleSave,
    previewOpen, setPreviewOpen,
    isDirty,
    metamodel,
    vis,
    onChange,
    markAdded, markRemoved, addGroup, removeGroup,
    isSkippable, isAddable, isGroupSkippable,
    addAndClose, addSectionAndClose,
  };
}
