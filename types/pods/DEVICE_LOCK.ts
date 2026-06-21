// 0.0.1
import { PodFieldMeta } from "@/types/interfaces";

export type DEVICE_LOCK = {
  password?: string;
  pin?: string;
  note?: string;
};

export const DEVICE_LOCK_MANDATORY: PodFieldMeta[] = [
  { key: "password", label: "Password" },
  { key: "pin", label: "Pin" },
];

export const DEVICE_LOCK_OPTIONAL: PodFieldMeta[] = [
  { key: "note", label: "Note", type: "textarea" },
];
