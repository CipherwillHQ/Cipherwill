// Email account pod form: email, password, provider, recovery, security, aliases with live preview.
// Owns: field config, custom section rendering, save logic, orchestration. Does NOT own preview layout.
"use client";
import { EMAIL_ACCOUNT_TYPE } from "@/types/pods/EMAIL_ACCOUNT";
import { usePodForm } from "@/components/common/pod-form/usePodForm";
import type { PodFieldConfig, PodCustomSectionDef } from "@/types/interfaces";
import PodForm from "@/components/common/pod-form/PodForm";
import SaveButton from "@/components/common/pod-form/SaveButton";
import TagListField from "@/components/common/pod-form/TagListField";
import PodFormLayout from "@/components/pods/PodFormLayout";
import PodFormSkeleton from "@/components/pods/PodFormSkeleton";
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
  { key: "recoveryEmail", label: "Recovery Email", placeholder: "e.g. john@example.com", visibility: "skippable" },
  { key: "recoveryPhone", label: "Recovery Phone", placeholder: "e.g. 1234567890", visibility: "skippable" },
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
    data, updateField, loading, error, isUpdating, handleSave,
    previewOpen, setPreviewOpen, isDirty,
    metamodel, vis, onChange, markAdded, markRemoved, addGroup, removeGroup,
    isSkippable, isAddable,
    addAndClose,
  } = usePodForm<EMAIL_ACCOUNT_TYPE>(EMAIL_ACCOUNT_SAMPLE, {
    podType: "email_account", version: "0.0.1", refId: id,
    fields: EMAIL_ACCOUNT_FIELDS, customSections: EMAIL_ACCOUNT_CUSTOM_SECTIONS,
  });

  function handleRemoveCustomSection(key: string) {
    if (key === "backupCodes") updateField("backupCodes", undefined);
    if (key === "aliasEmails") updateField("aliasEmails", undefined);
  }

  function renderCustomSection(key: string) {
    if (key === "backupCodes") {
      return (
        <TagListField
          id="email-account-backup-codes"
          label="Backup codes"
          placeholder="Backup Codes (comma separated)"
          values={data.backupCodes || []}
          splitBy=","
          emptyMessage="No backup codes"
          onChange={(backupCodes) => updateField("backupCodes", backupCodes)}
        />
      );
    }
    if (key === "aliasEmails") {
      return (
        <TagListField
          id="email-account-alias-emails"
          label="Email alias"
          placeholder="Alias Emails (comma separated)"
          values={data.aliasEmails || []}
          splitBy=","
          emptyMessage="No alias emails"
          onChange={(aliasEmails) => updateField("aliasEmails", aliasEmails)}
        />
      );
    }
    return null;
  }

  if (loading) return <PodFormSkeleton />;
  if (error) return <div>Error: {error}</div>;

  return (
    <PodFormLayout
      preview={<EmailPreview d={data} metamodel={metamodel} isSkippable={isSkippable} isAddable={isAddable} addAndClose={addAndClose} />}
      previewOpen={previewOpen}
      onTogglePreview={() => setPreviewOpen(!previewOpen)}
      isDirty={isDirty}
      saveButton={<SaveButton isDirty={isDirty} isUpdating={isUpdating} onClick={handleSave} />}
    >
      <PodForm
        data={data}
        onChange={onChange}
        vis={vis}
        markAdded={markAdded}
        markRemoved={markRemoved}
        addGroup={addGroup}
        removeGroup={removeGroup}
        renderCustomSection={renderCustomSection}
        onRemoveCustomSection={handleRemoveCustomSection}
      />
    </PodFormLayout>
  );
}
