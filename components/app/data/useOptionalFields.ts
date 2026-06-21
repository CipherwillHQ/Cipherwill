// useOptionalFields: shared hook for mandatory/optional field visibility state.
// Owns addedOptional tracking, provides hasData, isVisible, addField, removeField, remaining.
// Supports grouped fields via PodFieldMeta.group — adding/removing one adds/removes all siblings.

"use client";
import { useCallback } from "react";
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

  const getGroupKeys = useCallback(
    (key: string): string[] => {
      const field = optionalFields.find((f) => f.key === key);
      if (!field?.group) return [key];
      return optionalFields
        .filter((f) => f.group === field.group)
        .map((f) => f.key);
    },
    [optionalFields],
  );

  const isVisible = (key: string) => {
    if (addedOptional.includes(key)) return true;
    if (hasData(key)) return true;
    const siblings = getGroupKeys(key);
    if (siblings.length > 1) {
      return siblings.some(
        (k) => k !== key && (hasData(k) || addedOptional.includes(k)),
      );
    }
    return false;
  };

  const addField = (key: string) => {
    setAddedOptional((prev) => [...new Set([...prev, ...getGroupKeys(key)])]);
  };

  const removeField = (key: string) => {
    const keysToRemove = getGroupKeys(key);
    setAddedOptional((prev) => prev.filter((k) => !keysToRemove.includes(k)));
    setData((prev: any) => {
      const next = { ...prev };
      for (const k of keysToRemove) {
        next[k] = Array.isArray(next[k]) ? [] : "";
      }
      return next;
    });
  };

  const visible = optionalFields.filter((f) => isVisible(f.key));
  const remaining = optionalFields.filter((f) => !isVisible(f.key));

  return { isVisible, addField, removeField, visible, remaining };
}
