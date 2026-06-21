// 0.0.1
import { PodFieldMeta } from "@/types/interfaces";

export type EMAIL_ACCOUNT_TYPE = {
  email?: string;
  password?: string;
  provider?: string;
  recoveryEmail?: string;
  recoveryPhone?: string;
  securityQuestion?: string;
  securityAnswer?: string;
  backupCodes?: string[];
  aliasEmails?: string[];
  note?: string;
};

export const EMAIL_ACCOUNT_MANDATORY: PodFieldMeta[] = [
  { key: "email", label: "Email", type: "email" },
  { key: "password", label: "Password", sensitive: true },
];

export const EMAIL_ACCOUNT_OPTIONAL: PodFieldMeta[] = [
  { key: "provider", label: "Provider" },
  { key: "recoveryEmail", label: "Recovery Email", type: "email" },
  { key: "recoveryPhone", label: "Recovery Phone" },
  { key: "securityQuestion", label: "Security Question" },
  { key: "securityAnswer", label: "Security Answer" },
  { key: "backupCodes", label: "Backup Codes", list: true },
  { key: "aliasEmails", label: "Alias Emails", list: true },
  { key: "note", label: "Note", type: "textarea" },
];
