// Payment card pod form: card type, number, expiry, CVV, issuer with live preview.
// Owns: field config, save logic, orchestration. Does NOT own form chrome or preview rendering.
"use client";
import { useState, useRef } from "react";
import { usePod } from "@/contexts/PodHelper";
import { PAYMENT_CARD_TYPE } from "@/types/pods/PAYMENT_CARD";
import PodForm, { PodFieldConfig, PodFormHandle } from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";
import PodFormLayout from "@/components/pods/PodFormLayout";
import { useMetamodelData } from "@/common/useMetamodelData";
import PaymentCardPreview from "./PaymentCardPreview";
import toast from "react-hot-toast";

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

export default function PodDetails({ id }) {
  const [data, setData] = useState<PAYMENT_CARD_TYPE>({});
  const [initialData, setInitialData] = useState<PAYMENT_CARD_TYPE | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const podFormRef = useRef<PodFormHandle>(null);
  const metamodel = useMetamodelData(id);
  const { loading, error, savePod, is_updating } = usePod<PAYMENT_CARD_TYPE>(
    {
      TYPE: "payment_card",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: PAYMENT_CARD_SAMPLE,
    },
    {
      onComplete: (data: null | PAYMENT_CARD_TYPE) => {
        if (data) {
          setData(data);
          setInitialData(data);
        }
      },
    }
  );

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
    PAYMENT_CARD_FIELDS.find((f) => f.key === key)?.visibility === "skippable";

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <PodFormLayout
      preview={<PaymentCardPreview d={data} metamodel={metamodel} addAndClose={addAndClose} isSkippable={isSkippable} />}
      previewOpen={previewOpen}
      onTogglePreview={() => setPreviewOpen(!previewOpen)}
      isDirty={isDirty}
      saveButton={<SaveButton isDirty={isDirty} isUpdating={is_updating} onClick={handleSave} />}
    >
      <PodForm
        ref={podFormRef}
        fields={PAYMENT_CARD_FIELDS}
        data={data}
        onChange={(key, value) => {
          setData((prev) => ({ ...prev, [key]: value }));
        }}
      />
    </PodFormLayout>
  );
}
