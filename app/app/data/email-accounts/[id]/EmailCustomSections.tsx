// Custom section renderers for email account: backup codes and alias emails.
// Owns: rendering and data mutation for these two sections. Does NOT own form layout or save logic.
"use client";
import { TbTrash } from "react-icons/tb";
import { EMAIL_ACCOUNT_TYPE } from "@/types/pods/EMAIL_ACCOUNT";

interface Props {
  data: EMAIL_ACCOUNT_TYPE;
  setData: React.Dispatch<React.SetStateAction<EMAIL_ACCOUNT_TYPE>>;
}

export default function EmailCustomSections({ data, setData }: Props) {
  function renderCustomSection(key: string) {
    if (key === "backupCodes") {
      return (
        <>
          <div className="font-semibold">Backup codes</div>
          <div className="flex items-center gap-2">
            <input
              id="email-account-backup-codes"
              className="bg-secondary border border-default rounded-xl p-2 w-full"
              type="text"
              placeholder="Backup Codes (comma separated)"
            />
            <button
              className="bg-secondary border border-default rounded-xl p-2"
              onClick={() => {
                let newCodes = (
                  document.getElementById("email-account-backup-codes") as HTMLInputElement
                )?.value.split(",");
                newCodes = newCodes.map((code) => code.trim());
                newCodes = newCodes.filter((code) => code !== "");

                setData((prev) => ({
                  ...prev,
                  backupCodes: Array.from(
                    new Set([...(prev.backupCodes || []), ...newCodes])
                  ),
                }));
                (document.getElementById("email-account-backup-codes") as HTMLInputElement).value = "";
              }}
            >
              Add
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(data.backupCodes === undefined || data.backupCodes?.length === 0) && (
              <div className="text-sm font-semibold text-neutral-500">No backup codes</div>
            )}
            {data.backupCodes?.map((code, index) => (
              <div
                key={index}
                className="flex items-center gap-2 border border-default rounded-xl p-2"
              >
                <div>{code}</div>
                <button
                  onClick={() => {
                    setData((prev) => ({
                      ...prev,
                      backupCodes: (prev.backupCodes || []).filter((c) => c !== code),
                    }));
                  }}
                >
                  <TbTrash />
                </button>
              </div>
            ))}
          </div>
        </>
      );
    }

    if (key === "aliasEmails") {
      return (
        <>
          <div className="font-semibold">Email alias</div>
          <div className="flex items-center gap-2">
            <input
              id="email-account-alias-emails"
              className="bg-secondary border border-default rounded-xl p-2 w-full"
              type="text"
              placeholder="Alias Emails (comma separated)"
            />
            <button
              className="bg-secondary border border-default rounded-xl p-2"
              onClick={() => {
                let newAliases = (
                  document.getElementById("email-account-alias-emails") as HTMLInputElement
                )?.value.split(",");
                newAliases = newAliases.map((code) => code.trim());
                newAliases = newAliases.filter((code) => code !== "");

                setData((prev) => ({
                  ...prev,
                  aliasEmails: Array.from(
                    new Set([...(prev.aliasEmails || []), ...newAliases])
                  ),
                }));
                (document.getElementById("email-account-alias-emails") as HTMLInputElement).value = "";
              }}
            >
              Add
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(data.aliasEmails === undefined || data.aliasEmails?.length === 0) && (
              <div className="text-sm font-semibold text-neutral-500">No alias emails</div>
            )}
            {data.aliasEmails?.map((email, index) => (
              <div
                key={index}
                className="flex items-center gap-2 border border-default rounded-xl p-2"
              >
                <div>{email}</div>
                <button
                  onClick={() => {
                    setData((prev) => ({
                      ...prev,
                      aliasEmails: (prev.aliasEmails || []).filter((e) => e !== email),
                    }));
                  }}
                >
                  <TbTrash />
                </button>
              </div>
            ))}
          </div>
        </>
      );
    }

    return null;
  }

  return renderCustomSection;
}
