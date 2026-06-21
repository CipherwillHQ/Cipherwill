// 0.0.1
import { PodFieldMeta } from "@/types/interfaces";

export type PASSWORD = {
  username?: string;
  password?: string;
  totp_secret?: string;
  uri?: string[];
  note?: string;
};

export const PASSWORD_MANDATORY: PodFieldMeta[] = [
  { key: "username", label: "Username" },
  { key: "password", label: "Password", sensitive: true },
];

export const PASSWORD_OPTIONAL: PodFieldMeta[] = [
  { key: "totp_secret", label: "2FA Secret" },
  { key: "uri", label: "Websites", list: true },
  { key: "note", label: "Note", type: "textarea" },
];
