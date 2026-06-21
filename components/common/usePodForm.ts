// Orchestrator hook for pod forms: composes usePodFormData, usePodFormVisibility, usePodFormActions.
// Owns: state wiring, preview toggle, addAndClose. Does NOT own data, visibility, or action logic.
"use client";
import { useState, useCallback } from "react";
import { useMetamodelData } from "@/common/useMetamodelData";
import type { POD_TYPE } from "@/types/POD";
import type { PodFieldConfig, PodCustomSectionDef, VisibilityState } from "@/types/interfaces";
import { usePodFormData } from "./usePodFormData";
import { usePodFormVisibility } from "./usePodFormVisibility";
import { usePodFormActions } from "./usePodFormActions";

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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [manuallyAdded, setManuallyAdded] = useState<Set<string>>(new Set());
  const [manuallyRemoved, setManuallyRemoved] = useState<Set<string>>(new Set());

  const formData = usePodFormData<T>({
    podType, version, refId, sample,
  });

  const metamodel = useMetamodelData(refId);

  const vis = usePodFormVisibility(
    fields, customSections, formData.data, manuallyAdded, manuallyRemoved,
  );

  const actions = usePodFormActions<T>({
    fields, data: formData.data, setData: formData.setData,
    manuallyAdded, setManuallyAdded,
    manuallyRemoved, setManuallyRemoved,
    setIsDirty: formData.setIsDirty,
  });

  const { markAdded } = actions;

  const addAndClose = useCallback((key: string) => {
    markAdded(key);
    setPreviewOpen(false);
  }, [markAdded]);

  return {
    data: formData.data,
    setData: formData.setData,
    loading: formData.loading,
    error: formData.error,
    isUpdating: formData.isUpdating,
    handleSave: formData.handleSave,
    isDirty: formData.isDirty,
    previewOpen,
    setPreviewOpen,
    metamodel,
    vis,
    onChange: formData.onChange,
    markAdded,
    markRemoved: actions.markRemoved,
    addGroup: actions.addGroup,
    removeGroup: actions.removeGroup,
    isSkippable: actions.isSkippable,
    isAddable: actions.isAddable,
    isGroupSkippable: actions.isGroupSkippable,
    addAndClose,
  };
}
