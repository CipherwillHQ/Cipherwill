// Shared hook for pod forms: data, dirty tracking, save, preview toggle, add-to-form helpers.
// Owns: state management, save orchestration, preview control. Does NOT own rendering.
"use client";
import { useState, useRef, useCallback } from "react";
import { usePod } from "@/contexts/PodHelper";
import { useMetamodelData } from "@/common/useMetamodelData";
import type { POD_TYPE } from "@/types/POD";
import type { PodFieldConfig, PodFormHandle } from "@/types/interfaces";
import toast from "react-hot-toast";

interface UsePodFormConfig {
  podType: POD_TYPE;
  version: string;
  refId: string;
  fields: PodFieldConfig[];
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
  podFormRef: React.RefObject<PodFormHandle | null>;
  metamodel: ReturnType<typeof useMetamodelData>;
  isSkippable: (key: string) => boolean;
  isGroupSkippable: (groupId: string) => boolean;
  addAndClose: (key: string) => void;
  addGroupAndClose: (groupId: string) => void;
  addSectionAndClose: (key: string) => void;
}

export function usePodForm<T extends Record<string, any>>(
  sample: T,
  config: UsePodFormConfig,
): UsePodFormReturn<T> {
  const { podType, version, refId, fields } = config;
  const [data, setData] = useState<T>({} as T);
  const [initialData, setInitialData] = useState<T | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const podFormRef = useRef<PodFormHandle>(null);
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

  const isSkippable = useCallback(
    (key: string) => fields.find((f) => f.key === key)?.visibility === "skippable",
    [fields],
  );

  const isGroupSkippable = useCallback(
    (groupId: string) =>
      fields.filter((f) => f.group?.id === groupId).every((f) => f.visibility === "skippable"),
    [fields],
  );

  const addAndClose = useCallback((key: string) => {
    podFormRef.current?.addField(key);
    setPreviewOpen(false);
  }, []);

  const addGroupAndClose = useCallback((groupId: string) => {
    podFormRef.current?.addGroup(groupId);
    setPreviewOpen(false);
  }, []);

  const addSectionAndClose = useCallback((key: string) => {
    podFormRef.current?.addSection(key);
    setPreviewOpen(false);
  }, []);

  return {
    data, setData,
    loading, error, isUpdating,
    handleSave,
    previewOpen, setPreviewOpen,
    isDirty,
    podFormRef,
    metamodel,
    isSkippable,
    isGroupSkippable,
    addAndClose,
    addGroupAndClose,
    addSectionAndClose,
  };
}
