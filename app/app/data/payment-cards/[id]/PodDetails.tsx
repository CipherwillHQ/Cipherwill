"use client";
import { useState, useCallback, useRef } from "react";
import { usePod } from "@/contexts/PodHelper";
import { PAYMENT_CARD_TYPE } from "@/types/pods/PAYMENT_CARD";
import PodForm, { PodFieldConfig, PodFormHandle } from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";
import PodFormLayout from "@/components/pods/PodFormLayout";
import PodPreviewSection, { PreviewValue } from "@/components/pods/PodPreview";
import { useMetamodelData } from "@/common/useMetamodelData";

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
  { key: "type", label: "Type (e.g. Credit, Debit)", placeholder: "e.g. Credit", mandatory: true },
  { key: "card_holder_name", label: "Card Holder Name", placeholder: "e.g. John Doe", mandatory: false },
  { key: "card_number", label: "Card Number", placeholder: "e.g. 1234 5678 9012 3456", mandatory: true },
  { key: "expiry_date", label: "Expiry Date (e.g. 12/2025)", placeholder: "e.g. 12/2025", mandatory: true },
  { key: "cvv", label: "CVV (e.g. 123)", placeholder: "e.g. 123", mandatory: true },
  { key: "issuer", label: "Issuer (e.g. AB Bank)", placeholder: "e.g. AB Bank", mandatory: false },
  { key: "network", label: "Network (e.g. Visa, Mastercard)", placeholder: "e.g. Mastercard", mandatory: false },
  { key: "note", label: "Note", type: "textarea", placeholder: "e.g. This is a note", mandatory: false },
];

export default function PodDetails({ id }) {
  const [data, setData] = useState<PAYMENT_CARD_TYPE>({});
  const [initialData, setInitialData] = useState<PAYMENT_CARD_TYPE>({} as PAYMENT_CARD_TYPE);
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

  const isDirty = JSON.stringify(initialData) !== JSON.stringify(data);

  const handleSave = useCallback(async () => {
    try {
      await savePod({
        type: data.type,
        card_holder_name: data.card_holder_name,
        card_number: data.card_number,
        expiry_date: data.expiry_date,
        cvv: data.cvv,
        issuer: data.issuer,
        network: data.network,
        note: data.note,
      },{
        metamodel_id: id,
      });
      setInitialData(JSON.parse(JSON.stringify(data)));
    } catch (_) {
    }
  }, [data, savePod, id]);

  const addAndClose = (key: string) => {
    podFormRef.current?.addField(key);
    setPreviewOpen(false);
  };

  function renderPreview(d: PAYMENT_CARD_TYPE) {
    return (
      <PodPreviewSection>
        <p>
          I have a {metamodel?.name || "card"} with the number ending in{" "}
          <PreviewValue value={d.card_number} maskLast4 addLabel="Card Number" onAdd={() => addAndClose("card_number")} />.
        </p>
        <p>
          It is a{" "}
          <PreviewValue value={d.type} fallback="card" addLabel="Type" onAdd={() => addAndClose("type")} /> card,
          issued by{" "}
          <PreviewValue value={d.issuer} addLabel="Issuer" onAdd={() => addAndClose("issuer")} /> on
          the <PreviewValue value={d.network} addLabel="Network" onAdd={() => addAndClose("network")} /> network.
          It expires on{" "}
          <PreviewValue value={d.expiry_date} addLabel="Expiry Date" onAdd={() => addAndClose("expiry_date")} />.
        </p>
        <p>
          For context, <PreviewValue value={d.note} addLabel="Note" onAdd={() => addAndClose("note")} />.
        </p>
      </PodPreviewSection>
    );
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <PodFormLayout
      preview={renderPreview(data)}
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
