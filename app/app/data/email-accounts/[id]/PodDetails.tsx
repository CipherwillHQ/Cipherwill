"use client";
import { useState, useCallback } from "react";
import { usePod } from "@/contexts/PodHelper";
import { EMAIL_ACCOUNT_TYPE } from "@/types/pods/EMAIL_ACCOUNT";
import { TbTrash } from "react-icons/tb";
import PodForm, { PodFieldConfig, PodCustomSectionDef } from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";

const EMAIL_ACCOUNT_SAMPLE: EMAIL_ACCOUNT_TYPE = {
  email: "john@example.com",
  password: "password",
  provider: "Gmail",
  recoveryEmail: "john@example.com",
  recoveryPhone: "1234567890",
  securityQuestion: "What is your favorite color?",
  securityAnswer: "Blue",
  backupCodes: ["123456", "654321"],
  aliasEmails: ["john@example.com", "john.doe@example.com"],
  note: "Sample Note",
};

const EMAIL_ACCOUNT_FIELDS: PodFieldConfig[] = [
  { key: "email", label: "Email", placeholder: "e.g. john@example.com", mandatory: true },
  { key: "password", label: "Password", type: "password", placeholder: "e.g. your password", mandatory: true },
  { key: "provider", label: "Provider", placeholder: "e.g. Gmail", mandatory: false },
  { key: "recoveryEmail", label: "Recovery Email", placeholder: "e.g. john@example.com", mandatory: false, group: { id: "recovery", label: "Recovery Info" } },
  { key: "recoveryPhone", label: "Recovery Phone", placeholder: "e.g. 1234567890", mandatory: false, group: { id: "recovery", label: "Recovery Info" } },
  { key: "securityQuestion", label: "Security Question", placeholder: "e.g. Your favorite color?", mandatory: false, group: { id: "security", label: "Security Info" } },
  { key: "securityAnswer", label: "Security Answer", placeholder: "e.g. Blue", mandatory: false, group: { id: "security", label: "Security Info" } },
  { key: "note", label: "Note", type: "textarea", placeholder: "e.g. Sample Note", mandatory: false },
];

const EMAIL_ACCOUNT_CUSTOM_SECTIONS: PodCustomSectionDef[] = [
  { key: "backupCodes", label: "Backup Codes", dataKey: "backupCodes", mandatory: false },
  { key: "aliasEmails", label: "Email Aliases", dataKey: "aliasEmails", mandatory: false },
];

export default function PodDetails({ id }) {
  const [data, setData] = useState<EMAIL_ACCOUNT_TYPE>({});
  const [initialData, setInitialData] = useState<EMAIL_ACCOUNT_TYPE | null>(null);
  const { loading, error, savePod, is_updating } = usePod<EMAIL_ACCOUNT_TYPE>(
    {
      TYPE: "email_account",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: EMAIL_ACCOUNT_SAMPLE,
    },
    {
      onComplete: (data: null | EMAIL_ACCOUNT_TYPE) => {
        if (data) {
          setData(data);
          setInitialData(data);
        }
      },
    }
  );

  const handleRemoveCustomSection = useCallback((key: string) => {
    if (key === "backupCodes") {
      setData((prev) => ({ ...prev, backupCodes: undefined }));
    }
    if (key === "aliasEmails") {
      setData((prev) => ({ ...prev, aliasEmails: undefined }));
    }
  }, []);

  const renderCustomSection = useCallback(
    (key: string) => {
      if (key === "backupCodes") {
        return (
          <>
            <div className="font-semibold">Backup codes</div>
            <div className="flex items-center gap-2">
              <input
                id="email-account-backup-codes"
                className="bg-secondary border border-default rounded-md p-2 w-full"
                type="text"
                placeholder="Backup Codes (comma separated)"
              />
              <button
                className="bg-secondary border border-default rounded-md p-2"
                onClick={() => {
                  let newCodes = (
                    document.getElementById(
                      "email-account-backup-codes"
                    ) as HTMLInputElement
                  )?.value.split(",");
                  newCodes = newCodes.map((code) => code.trim());
                  newCodes = newCodes.filter((code) => code !== "");

                  setData((prev) => ({
                    ...prev,
                    backupCodes: Array.from(
                      new Set([...(prev.backupCodes || []), ...newCodes])
                    ),
                  }));
                  (
                    document.getElementById(
                      "email-account-backup-codes"
                    ) as HTMLInputElement
                  ).value = "";
                }}
              >
                Add
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(data.backupCodes === undefined || data.backupCodes?.length === 0) && (
                <div className="text-sm font-semibold text-neutral-500">
                  No backup codes
                </div>
              )}
              {data.backupCodes?.map((backupCode, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 border border-default rounded-md p-2 "
                >
                  <div>{backupCode}</div>
                  <button
                    onClick={() => {
                      setData((prev) => ({
                        ...prev,
                        backupCodes: (prev.backupCodes || []).filter(
                          (code) => code !== backupCode
                        ),
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
                className="bg-secondary border border-default rounded-md p-2 w-full"
                type="text"
                placeholder="Alias Emails (comma separated)"
              />
              <button
                className="bg-secondary border border-default rounded-md p-2"
                onClick={() => {
                  let newAliases = (
                    document.getElementById(
                      "email-account-alias-emails"
                    ) as HTMLInputElement
                  )?.value.split(",");
                  newAliases = newAliases.map((code) => code.trim());
                  newAliases = newAliases.filter((code) => code !== "");

                  setData((prev) => ({
                    ...prev,
                    aliasEmails: Array.from(
                      new Set([...(prev.aliasEmails || []), ...newAliases])
                    ),
                  }));
                  (
                    document.getElementById(
                      "email-account-alias-emails"
                    ) as HTMLInputElement
                  ).value = "";
                }}
              >
                Add
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(data.aliasEmails === undefined || data.aliasEmails?.length === 0) && (
                <div className="text-sm font-semibold text-neutral-500">
                  No alias emails
                </div>
              )}
              {data.aliasEmails?.map((aliasEmail, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 border border-default rounded-md p-2 "
                >
                  <div>{aliasEmail}</div>
                  <button
                    onClick={() => {
                      setData((prev) => ({
                        ...prev,
                        aliasEmails: (prev.aliasEmails || []).filter(
                          (code) => code !== aliasEmail
                        ),
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
    },
    [data]
  );

  const isDirty = JSON.stringify(initialData) !== JSON.stringify(data);

  const handleSave = useCallback(async () => {
    try {
      await savePod({
        email: data.email,
        password: data.password,
        provider: data.provider,
        recoveryEmail: data.recoveryEmail,
        recoveryPhone: data.recoveryPhone,
        securityQuestion: data.securityQuestion,
        securityAnswer: data.securityAnswer,
        backupCodes: data.backupCodes,
        aliasEmails: data.aliasEmails,
        note: data.note,
      },{
        metamodel_id: id,
      });
      setInitialData(JSON.parse(JSON.stringify(data)));
    } catch (_) {
    }
  }, [data, savePod, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4 px-4 w-full max-w-lg mx-auto">
      <PodForm
        fields={EMAIL_ACCOUNT_FIELDS}
        data={data}
        onChange={(key, value) => {
          setData((prev) => ({ ...prev, [key]: value }));
        }}
        customSections={EMAIL_ACCOUNT_CUSTOM_SECTIONS}
        renderCustomSection={renderCustomSection}
        onRemoveCustomSection={handleRemoveCustomSection}
      />
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <SaveButton
          isDirty={isDirty}
          isUpdating={is_updating}
          onClick={handleSave}
        />
      </div>
    </div>
  );
}
