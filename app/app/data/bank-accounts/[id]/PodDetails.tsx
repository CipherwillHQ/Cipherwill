// Bank account pod form: account number + bank name with live preview.
// Owns: field config, save logic, orchestration. Does NOT own form chrome or preview rendering.
"use client";
import { BANK_ACCOUNT_TYPE } from "@/types/pods/BANK_ACCOUNT";
import { usePodForm } from "@/components/common/pod-form/usePodForm";
import type { PodFieldConfig } from "@/types/interfaces";
import PodForm from "@/components/common/pod-form/PodForm";
import SaveButton from "@/components/common/pod-form/SaveButton";
import PodFormLayout from "@/components/pods/PodFormLayout";
import PodFormSkeleton from "@/components/pods/PodFormSkeleton";
import BankAccountPreview from "./BankAccountPreview";

const BANK_ACCOUNT_SAMPLE: BANK_ACCOUNT_TYPE = {
  account_number: "6546489-SAMPLE",
  bank_name: "Sample Bank",
};

const BANK_ACCOUNT_FIELDS: PodFieldConfig[] = [
  { key: "account_number", label: "Account number", placeholder: "e.g. 6546489", visibility: "mandatory" },
  { key: "bank_name", label: "Bank name", placeholder: "e.g. Sample Bank", visibility: "mandatory" },
];

export default function PodDetails({ id }: { id: string }) {
  const {
    data, loading, error, isUpdating, handleSave,
    previewOpen, setPreviewOpen, isDirty,
    metamodel, vis, onChange, markAdded, markRemoved, addGroup, removeGroup,
    isSkippable, isAddable,
    addAndClose,
  } = usePodForm<BANK_ACCOUNT_TYPE>(BANK_ACCOUNT_SAMPLE, {
    podType: "bank_account", version: "0.0.1", refId: id, fields: BANK_ACCOUNT_FIELDS,
  });

  if (loading) return <PodFormSkeleton />;
  if (error) return <div>Error: {error}</div>;

  return (
    <PodFormLayout
      preview={<BankAccountPreview d={data} metamodel={metamodel} isSkippable={isSkippable} isAddable={isAddable} addAndClose={addAndClose} />}
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
