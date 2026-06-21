// Device lock pod form: password + optional pin and note with live preview.
// Owns: field config, save logic, orchestration. Does NOT own form chrome or preview rendering.
"use client";
import { DEVICE_LOCK } from "@/types/pods/DEVICE_LOCK";
import { usePodForm } from "@/components/common/pod-form/usePodForm";
import type { PodFieldConfig } from "@/types/interfaces";
import PodForm from "@/components/common/pod-form/PodForm";
import SaveButton from "@/components/common/pod-form/SaveButton";
import PodFormLayout from "@/components/pods/PodFormLayout";
import PodFormSkeleton from "@/components/pods/PodFormSkeleton";
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
    data, loading, error, isUpdating, handleSave,
    previewOpen, setPreviewOpen, isDirty,
    metamodel, vis, onChange, markAdded, markRemoved, addGroup, removeGroup,
    isSkippable, isAddable,
    addAndClose,
  } = usePodForm<DEVICE_LOCK>(DEVICE_LOCK_SAMPLE, {
    podType: "device_lock", version: "0.0.1", refId: id, fields: DEVICE_LOCK_FIELDS,
  });

  if (loading) return <PodFormSkeleton />;
  if (error) return <div>Error: {error}</div>;

  return (
    <PodFormLayout
      preview={<DeviceLockPreview d={data} metamodel={metamodel} isSkippable={isSkippable} isAddable={isAddable} addAndClose={addAndClose} />}
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
      />
    </PodFormLayout>
  );
}
