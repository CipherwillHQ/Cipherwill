// Device lock pod form: password + optional pin and note with live preview.
// Owns: field config, save logic, orchestration. Does NOT own form chrome or preview rendering.
"use client";
import { DEVICE_LOCK } from "@/types/pods/DEVICE_LOCK";
import { usePodForm } from "@/components/common/usePodForm";
import type { PodFieldConfig } from "@/types/interfaces";
import PodForm from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";
import PodFormLayout from "@/components/pods/PodFormLayout";
import DeviceLockPreview from "./DeviceLockPreview";

const DEVICE_LOCK_SAMPLE: DEVICE_LOCK = {
  password: "password",
  pin: "123456",
  note: "Sample Note",
};

const DEVICE_LOCK_FIELDS: PodFieldConfig[] = [
  { key: "password", label: "Password", type: "password", placeholder: "e.g. your password", visibility: "mandatory" },
  { key: "pin", label: "Pin", type: "password", placeholder: "e.g. 123456", visibility: "skippable" },
  { key: "note", label: "Note", type: "textarea", placeholder: "e.g. Sample Note", visibility: "skippable" },
];

export default function PodDetails({ id }: { id: string }) {
  const {
    data, setData, loading, error, isUpdating, handleSave,
    previewOpen, setPreviewOpen, isDirty, podFormRef,
    metamodel, isSkippable, addAndClose, addGroupAndClose, addSectionAndClose,
  } = usePodForm<DEVICE_LOCK>(DEVICE_LOCK_SAMPLE, {
    podType: "device_lock", version: "0.0.1", refId: id, fields: DEVICE_LOCK_FIELDS,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <PodFormLayout
      preview={<DeviceLockPreview d={data} metamodel={metamodel} isSkippable={isSkippable} addAndClose={addAndClose} addGroupAndClose={addGroupAndClose} addSectionAndClose={addSectionAndClose} />}
      previewOpen={previewOpen}
      onTogglePreview={() => setPreviewOpen(!previewOpen)}
      isDirty={isDirty}
      saveButton={<SaveButton isDirty={isDirty} isUpdating={isUpdating} onClick={handleSave} />}
    >
      <PodForm
        ref={podFormRef}
        fields={DEVICE_LOCK_FIELDS}
        data={data}
        onChange={(key, value) => setData((prev) => ({ ...prev, [key]: value }))}
      />
    </PodFormLayout>
  );
}
