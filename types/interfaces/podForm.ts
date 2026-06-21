// PodForm shared types: field configs, section defs, form handle, preview props.
// Owns: type definitions consumed by PodForm, usePodForm, and preview components.
import type { MetamodelData } from "@/common/useMetamodelData";

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

export interface PreviewProps {
  d: Record<string, any>;
  metamodel: MetamodelData | null;
  isSkippable: (key: string) => boolean;
  isGroupSkippable?: (groupId: string) => boolean;
  addAndClose: (key: string) => void;
  addGroupAndClose: (groupId: string) => void;
  addSectionAndClose: (key: string) => void;
}
