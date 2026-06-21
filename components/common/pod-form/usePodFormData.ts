// Manages pod form data state, loading, dirty tracking, and save.
// Owns: data, setData, loading, error, isUpdating, handleSave, isDirty, onChange. Does NOT own visibility or add/remove logic.
"use client";
import { useState, useCallback } from "react";
import { usePod } from "@/contexts/PodHelper";
import type { POD_TYPE } from "@/types/POD";
import toast from "react-hot-toast";

interface UsePodFormDataConfig<T> {
  podType: POD_TYPE;
  version: string;
  refId: string;
  sample: T;
}

export interface UsePodFormDataReturn<T> {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  loading: boolean;
  error: string | null;
  isUpdating: boolean;
  isDirty: boolean;
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
  handleSave: () => Promise<void>;
  onChange: (key: string, value: string) => void;
  updateField: (key: string, value: unknown) => void;
}

export function usePodFormData<T extends Record<string, any>>(
  config: UsePodFormDataConfig<T>,
): UsePodFormDataReturn<T> {
  const { podType, version, refId, sample } = config;
  const [data, setData] = useState<T>({} as T);
  const [isDirty, setIsDirty] = useState(false);

  const { loading, error, savePod, is_updating: isUpdating } = usePod<T>(
    { TYPE: podType, VERSION: version, REF_ID: refId, DATA_SAMPLE: sample },
    {
      onComplete: (d: null | T) => {
        if (d) { setData(d); setIsDirty(false); }
      },
    },
  );

  const handleSave = useCallback(async () => {
    if (isUpdating) return;
    try {
      await savePod(data, { metamodel_id: refId });
      setIsDirty(false);
    } catch {
      toast.error("Failed to save changes. Please try again.");
    }
  }, [savePod, data, refId, isUpdating]);

  const onChange = useCallback((key: string, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  }, []);

  const updateField = useCallback((key: string, value: unknown) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  }, []);

  return { data, setData, loading, error, isUpdating, isDirty, setIsDirty, handleSave, onChange, updateField };
}
