// Email account pod form: email, password, provider, recovery, security, aliases with live preview.
// Owns: field config, save logic, orchestration. Does NOT own custom section rendering or preview layout.
"use client";
import { useState, useRef } from "react";
import { usePod } from "@/contexts/PodHelper";
import { EMAIL_ACCOUNT_TYPE } from "@/types/pods/EMAIL_ACCOUNT";
import PodForm, { PodFieldConfig, PodCustomSectionDef, PodFormHandle } from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";
import PodFormLayout from "@/components/pods/PodFormLayout";
import { useMetamodelData } from "@/common/useMetamodelData";
import EmailCustomSections from "./EmailCustomSections";
import EmailPreview from "./EmailPreview";
import toast from "react-hot-toast";

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

export default function PodDetails({ id }) {
  const [data, setData] = useState<EMAIL_ACCOUNT_TYPE>({});
  const [initialData, setInitialData] = useState<EMAIL_ACCOUNT_TYPE | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const podFormRef = useRef<PodFormHandle>(null);
  const metamodel = useMetamodelData(id);
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

  function handleRemoveCustomSection(key: string) {
    if (key === "backupCodes") setData((prev) => ({ ...prev, backupCodes: undefined }));
    if (key === "aliasEmails") setData((prev) => ({ ...prev, aliasEmails: undefined }));
  }

  const renderCustomSection = EmailCustomSections({ data, setData });

  const isDirty = initialData !== null && JSON.stringify(initialData) !== JSON.stringify(data);

  async function handleSave() {
    try {
      await savePod(data, { metamodel_id: id });
      setInitialData(JSON.parse(JSON.stringify(data)));
    } catch {
      toast.error("Failed to save changes. Please try again.");
    }
  }

  function addAndClose(key: string) {
    podFormRef.current?.addField(key);
    setPreviewOpen(false);
  }

  const isSkippable = (key: string) =>
    EMAIL_ACCOUNT_FIELDS.find((f) => f.key === key)?.visibility === "skippable";

  const isGroupSkippable = (groupId: string) =>
    EMAIL_ACCOUNT_FIELDS
      .filter((f) => f.group?.id === groupId)
      .every((f) => f.visibility === "skippable");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <PodFormLayout
      preview={
        <EmailPreview
          d={data}
          metamodel={metamodel}
          podFormRef={podFormRef}
          setPreviewOpen={setPreviewOpen}
          addAndClose={addAndClose}
          isSkippable={isSkippable}
          isGroupSkippable={isGroupSkippable}
        />
      }
      previewOpen={previewOpen}
      onTogglePreview={() => setPreviewOpen(!previewOpen)}
      isDirty={isDirty}
      saveButton={<SaveButton isDirty={isDirty} isUpdating={is_updating} onClick={handleSave} />}
    >
      <PodForm
        ref={podFormRef}
        fields={EMAIL_ACCOUNT_FIELDS}
        data={data}
        onChange={(key, value) => {
          setData((prev) => ({ ...prev, [key]: value }));
        }}
        customSections={EMAIL_ACCOUNT_CUSTOM_SECTIONS}
        renderCustomSection={renderCustomSection}
        onRemoveCustomSection={handleRemoveCustomSection}
      />
    </PodFormLayout>
  );
}
