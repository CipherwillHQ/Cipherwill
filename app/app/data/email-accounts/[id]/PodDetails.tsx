// Email account pod form: email, password, provider, recovery, security, aliases with live preview.
// Owns: field config, custom section rendering, save logic, orchestration. Does NOT own preview layout.
"use client";
import { TbTrash } from "react-icons/tb";
import { EMAIL_ACCOUNT_TYPE } from "@/types/pods/EMAIL_ACCOUNT";
import { usePodForm } from "@/components/common/usePodForm";
import type { PodFieldConfig, PodCustomSectionDef } from "@/types/interfaces";
import PodForm from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";
import PodFormLayout from "@/components/pods/PodFormLayout";
import EmailPreview from "./EmailPreview";

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
  { key: "email", label: "Email", placeholder: "e.g. john@example.com", visibility: "mandatory" },
  { key: "password", label: "Password", type: "password", placeholder: "e.g. your password", visibility: "mandatory" },
  { key: "provider", label: "Provider", placeholder: "e.g. Gmail", visibility: "optional" },
  { key: "recoveryEmail", label: "Recovery Email", placeholder: "e.g. john@example.com", visibility: "skippable", group: { id: "recovery", label: "Recovery Info" } },
  { key: "recoveryPhone", label: "Recovery Phone", placeholder: "e.g. 1234567890", visibility: "skippable", group: { id: "recovery", label: "Recovery Info" } },
  { key: "securityQuestion", label: "Security Question", placeholder: "e.g. Your favorite color?", visibility: "skippable", group: { id: "security", label: "Security Info" } },
  { key: "securityAnswer", label: "Security Answer", placeholder: "e.g. Blue", visibility: "skippable", group: { id: "security", label: "Security Info" } },
  { key: "note", label: "Note", type: "textarea", placeholder: "e.g. Sample Note", visibility: "skippable" },
];

const EMAIL_ACCOUNT_CUSTOM_SECTIONS: PodCustomSectionDef[] = [
  { key: "backupCodes", label: "Backup Codes", dataKey: "backupCodes", visibility: "skippable" },
  { key: "aliasEmails", label: "Email Aliases", dataKey: "aliasEmails", visibility: "skippable" },
];

export default function PodDetails({ id }: { id: string }) {
  const {
    data, setData, loading, error, isUpdating, handleSave,
    previewOpen, setPreviewOpen, isDirty, podFormRef,
    metamodel, isSkippable, isGroupSkippable,
    addAndClose, addGroupAndClose, addSectionAndClose,
  } = usePodForm<EMAIL_ACCOUNT_TYPE>(EMAIL_ACCOUNT_SAMPLE, {
    podType: "email_account", version: "0.0.1", refId: id, fields: EMAIL_ACCOUNT_FIELDS,
  });

  function handleRemoveCustomSection(key: string) {
    if (key === "backupCodes") setData((prev) => ({ ...prev, backupCodes: undefined }));
    if (key === "aliasEmails") setData((prev) => ({ ...prev, aliasEmails: undefined }));
  }

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
                const input = document.getElementById("email-account-backup-codes") as HTMLInputElement;
                const codes = input?.value.split(",").map((c) => c.trim()).filter((c) => c !== "") || [];
                setData((prev) => ({
                  ...prev,
                  backupCodes: Array.from(new Set([...(prev.backupCodes || []), ...codes])),
                }));
                input.value = "";
              }}
            >
              Add
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(!data.backupCodes || data.backupCodes.length === 0) && (
              <div className="text-sm font-semibold text-neutral-500">No backup codes</div>
            )}
            {data.backupCodes?.map((code, index) => (
              <div key={index} className="flex items-center gap-2 border border-default rounded-xl p-2">
                <div>{code}</div>
                <button onClick={() => setData((prev) => ({ ...prev, backupCodes: (prev.backupCodes || []).filter((c) => c !== code) }))}>
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
                const input = document.getElementById("email-account-alias-emails") as HTMLInputElement;
                const aliases = input?.value.split(",").map((c) => c.trim()).filter((c) => c !== "") || [];
                setData((prev) => ({
                  ...prev,
                  aliasEmails: Array.from(new Set([...(prev.aliasEmails || []), ...aliases])),
                }));
                input.value = "";
              }}
            >
              Add
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(!data.aliasEmails || data.aliasEmails.length === 0) && (
              <div className="text-sm font-semibold text-neutral-500">No alias emails</div>
            )}
            {data.aliasEmails?.map((email, index) => (
              <div key={index} className="flex items-center gap-2 border border-default rounded-xl p-2">
                <div>{email}</div>
                <button onClick={() => setData((prev) => ({ ...prev, aliasEmails: (prev.aliasEmails || []).filter((e) => e !== email) }))}>
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <PodFormLayout
      preview={<EmailPreview d={data} metamodel={metamodel} isSkippable={isSkippable} isGroupSkippable={isGroupSkippable} addAndClose={addAndClose} addGroupAndClose={addGroupAndClose} addSectionAndClose={addSectionAndClose} />}
      previewOpen={previewOpen}
      onTogglePreview={() => setPreviewOpen(!previewOpen)}
      isDirty={isDirty}
      saveButton={<SaveButton isDirty={isDirty} isUpdating={isUpdating} onClick={handleSave} />}
    >
      <PodForm
        ref={podFormRef}
        fields={EMAIL_ACCOUNT_FIELDS}
        data={data}
        onChange={(key, value) => setData((prev) => ({ ...prev, [key]: value }))}
        customSections={EMAIL_ACCOUNT_CUSTOM_SECTIONS}
        renderCustomSection={renderCustomSection}
        onRemoveCustomSection={handleRemoveCustomSection}
      />
    </PodFormLayout>
  );
}
