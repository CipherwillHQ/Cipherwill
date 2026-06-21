// 0.0.1
import { PodFieldMeta } from "@/types/interfaces";

export type SEED_PHRASE_TYPE = {
  phrase?: string[];
  public_key?: string;
  note?: string;
};

export const SEED_PHRASE_MANDATORY: PodFieldMeta[] = [
  { key: "phrase", label: "Seed Phrase" },
];

export const SEED_PHRASE_OPTIONAL: PodFieldMeta[] = [
  { key: "public_key", label: "Public Key" },
  { key: "note", label: "Note", type: "textarea" },
];
