// useOptionalFields: shared hook for mandatory/optional field visibility state.
// Owns addedOptional tracking, provides hasData, isVisible, addField, removeField, remaining.

"use client";
import { useState } from "react";
import { PodFieldMeta } from "@/types/interfaces";

export function useOptionalFields(
  optionalFields: PodFieldMeta[],
  data: Record<string, any>,
  setData: (updater: (prev: any) => any) => void
) {
  const [addedOptional, setAddedOptional] = useState<string[]>([]);

  const hasData = (key: string) => {
    const val = data[key];
    if (Array.isArray(val)) return val.length > 0;
    return val !== undefined && val !== null && val !== "";
  };

  const isVisible = (key: string) =>
    addedOptional.includes(key) || hasData(key);

  const addField = (key: string) => {
    setAddedOptional((prev) => [...new Set([...prev, key])]);
  };

  const removeField = (key: string) => {
    setAddedOptional((prev) => prev.filter((k) => k !== key));
    const field = optionalFields.find((f) => f.key === key);
    if (field?.list) {
      setData((prev: any) => ({ ...prev, [key]: [] }));
    } else {
      setData((prev: any) => ({ ...prev, [key]: "" }));
    }
  };

  const visible = optionalFields.filter((f) => isVisible(f.key));
  const remaining = optionalFields.filter((f) => !isVisible(f.key));

  return { isVisible, addField, removeField, visible, remaining };
}
