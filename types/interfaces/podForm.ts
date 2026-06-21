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

export interface VisibilityState {
  mandatoryGroupsMap: Map<string, PodFieldConfig[]>;
  standaloneMandatory: PodFieldConfig[];
  mandatorySections: PodCustomSectionDef[];
  visibleStandalone: PodFieldConfig[];
  visibleGroups: [string, PodFieldConfig[]][];
  visibleSections: PodCustomSectionDef[];
  dropdownFields: { key: string; label: string }[];
  dropdownGroups: { key: string; label: string }[];
  dropdownSections: { key: string; label: string }[];
  hasAvailableItems: boolean;
}

export interface PreviewProps {
  d: Record<string, any>;
  metamodel: MetamodelData | null;
  isSkippable: (key: string) => boolean;
  isAddable: (key: string) => boolean;
  isGroupSkippable?: (groupId: string) => boolean;
  addAndClose: (key: string) => void;
}
