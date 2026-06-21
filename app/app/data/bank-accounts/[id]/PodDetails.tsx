// Bank account pod form: account number + bank name with live preview.
// Owns: field config, save logic, orchestration. Does NOT own form chrome or preview rendering.
"use client";
import { BANK_ACCOUNT_TYPE } from "@/types/pods/BANK_ACCOUNT";
import { usePodForm } from "@/components/common/usePodForm";
import type { PodFieldConfig } from "@/types/interfaces";
import PodForm from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";
import PodFormLayout from "@/components/pods/PodFormLayout";
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
    data, setData, loading, error, isUpdating, handleSave,
    previewOpen, setPreviewOpen, isDirty, podFormRef,
    metamodel, isSkippable, addAndClose, addGroupAndClose, addSectionAndClose,
  } = usePodForm<BANK_ACCOUNT_TYPE>(BANK_ACCOUNT_SAMPLE, {
    podType: "bank_account", version: "0.0.1", refId: id, fields: BANK_ACCOUNT_FIELDS,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <PodFormLayout
      preview={<BankAccountPreview d={data} metamodel={metamodel} isSkippable={isSkippable} addAndClose={addAndClose} addGroupAndClose={addGroupAndClose} addSectionAndClose={addSectionAndClose} />}
      previewOpen={previewOpen}
      onTogglePreview={() => setPreviewOpen(!previewOpen)}
      isDirty={isDirty}
      saveButton={<SaveButton isDirty={isDirty} isUpdating={isUpdating} onClick={handleSave} />}
    >
      <PodForm
        ref={podFormRef}
        fields={BANK_ACCOUNT_FIELDS}
        data={data}
        onChange={(key, value) => setData((prev) => ({ ...prev, [key]: value }))}
      />
    </PodFormLayout>
  );
}
