// Password pod form: username, password, 2FA, websites, note with live preview.
// Owns: field config, custom section (websites), save logic, orchestration. Does NOT own preview rendering.
"use client";
import { PASSWORD } from "@/types/pods/PASSWORD";
import { usePodForm } from "@/components/common/usePodForm";
import type { PodFieldConfig, PodCustomSectionDef } from "@/types/interfaces";
import PodForm from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";
import TagListField from "@/components/common/TagListField";
import PodFormLayout from "@/components/pods/PodFormLayout";
import PodFormSkeleton from "@/components/pods/PodFormSkeleton";
import PasswordPreview from "./PasswordPreview";

const PASSWORD_SAMPLE: PASSWORD = {
  username: "john@example.com",
  password: "password",
  totp_secret: "123456",
  uri: ["https://example.com"],
  note: "Sample Note",
};

const PASSWORD_FIELDS: PodFieldConfig[] = [
  { key: "username", label: "Username", placeholder: "e.g. john@example.com", visibility: "mandatory" },
  { key: "password", label: "Password", type: "password", placeholder: "e.g. your password", visibility: "mandatory" },
  { key: "totp_secret", label: "2FA Secret", placeholder: "e.g. 123456", visibility: "skippable" },
  { key: "note", label: "Note", type: "textarea", placeholder: "e.g. Sample Note", visibility: "skippable" },
];

const PASSWORD_CUSTOM_SECTIONS: PodCustomSectionDef[] = [
  { key: "uri", label: "Websites", dataKey: "uri", visibility: "optional" },
];

export default function PodDetails({ id }: { id: string }) {
  const {
    data, setData, loading, error, isUpdating, handleSave,
    previewOpen, setPreviewOpen, isDirty,
    metamodel, vis, onChange, markAdded, markRemoved, addGroup, removeGroup,
    isSkippable, isAddable,
    addAndClose,
  } = usePodForm<PASSWORD>(PASSWORD_SAMPLE, {
    podType: "password", version: "0.0.1", refId: id,
    fields: PASSWORD_FIELDS, customSections: PASSWORD_CUSTOM_SECTIONS,
  });

  function handleRemoveCustomSection(key: string) {
    if (key === "uri") setData((prev) => ({ ...prev, uri: undefined }));
  }

  function renderCustomSection(key: string) {
    if (key === "uri") {
      return (
        <TagListField
          id="password-uri"
          label="Websites"
          placeholder="Website (e.g., https://example.com)"
          values={data.uri || []}
          splitBy=","
          emptyMessage="No Websites"
          onChange={(uri) => setData((prev) => ({ ...prev, uri }))}
        />
      );
    }
    return null;
  }

  if (loading) return <PodFormSkeleton />;
  if (error) return <div>Error: {error}</div>;

  return (
    <PodFormLayout
      preview={<PasswordPreview d={data} metamodel={metamodel} isSkippable={isSkippable} isAddable={isAddable} addAndClose={addAndClose} />}
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
