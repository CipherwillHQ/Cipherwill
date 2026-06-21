// Payment card pod form: card type, number, expiry, CVV, issuer with live preview.
// Owns: field config, save logic, orchestration. Does NOT own form chrome or preview rendering.
"use client";
import { PAYMENT_CARD_TYPE } from "@/types/pods/PAYMENT_CARD";
import { usePodForm } from "@/components/common/usePodForm";
import type { PodFieldConfig } from "@/types/interfaces";
import PodForm from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";
import PodFormLayout from "@/components/pods/PodFormLayout";
import PodFormSkeleton from "@/components/pods/PodFormSkeleton";
import PaymentCardPreview from "./PaymentCardPreview";

const PAYMENT_CARD_SAMPLE: PAYMENT_CARD_TYPE = {
  type: "Credit",
  card_holder_name: "John Doe",
  card_number: "1234567890123456",
  expiry_date: "12/2025",
  cvv: "123",
  issuer: "AB Bank",
  network: "Mastercard",
  note: "This is a note",
};

const PAYMENT_CARD_FIELDS: PodFieldConfig[] = [
  { key: "type", label: "Type (e.g. Credit, Debit)", placeholder: "e.g. Credit", visibility: "mandatory" },
  { key: "card_holder_name", label: "Card Holder Name", placeholder: "e.g. John Doe", visibility: "mandatory" },
  { key: "card_number", label: "Card Number", placeholder: "e.g. 1234 5678 9012 3456", visibility: "mandatory" },
  { key: "expiry_date", label: "Expiry Date (e.g. 12/2025)", placeholder: "e.g. 12/2025", visibility: "mandatory" },
  { key: "cvv", label: "CVV (e.g. 123)", placeholder: "e.g. 123", visibility: "optional" },
  { key: "issuer", label: "Issuer (e.g. AB Bank)", placeholder: "e.g. AB Bank", visibility: "skippable" },
  { key: "network", label: "Network (e.g. Visa, Mastercard)", placeholder: "e.g. Mastercard", visibility: "skippable" },
  { key: "note", label: "Note", type: "textarea", placeholder: "e.g. This is a note", visibility: "skippable" },
];

export default function PodDetails({ id }: { id: string }) {
  const {
    data, setData, loading, error, isUpdating, handleSave,
    previewOpen, setPreviewOpen, isDirty, podFormRef,
    metamodel, isSkippable, addAndClose, addGroupAndClose, addSectionAndClose,
  } = usePodForm<PAYMENT_CARD_TYPE>(PAYMENT_CARD_SAMPLE, {
    podType: "payment_card", version: "0.0.1", refId: id, fields: PAYMENT_CARD_FIELDS,
  });

  if (loading) return <PodFormSkeleton />;
  if (error) return <div>Error: {error}</div>;

  return (
    <PodFormLayout
      preview={<PaymentCardPreview d={data} metamodel={metamodel} isSkippable={isSkippable} addAndClose={addAndClose} addGroupAndClose={addGroupAndClose} addSectionAndClose={addSectionAndClose} />}
      previewOpen={previewOpen}
      onTogglePreview={() => setPreviewOpen(!previewOpen)}
      isDirty={isDirty}
      saveButton={<SaveButton isDirty={isDirty} isUpdating={isUpdating} onClick={handleSave} />}
    >
      <PodForm
        ref={podFormRef}
        fields={PAYMENT_CARD_FIELDS}
        data={data}
        onChange={(key, value) => setData((prev) => ({ ...prev, [key]: value }))}
      />
    </PodFormLayout>
  );
}
