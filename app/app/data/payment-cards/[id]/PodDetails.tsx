"use client";
import { useState, useCallback } from "react";
import { usePod } from "@/contexts/PodHelper";
import { PAYMENT_CARD_TYPE } from "@/types/pods/PAYMENT_CARD";
import PodForm, { PodFieldConfig } from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";

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
  { key: "type", label: "Type (e.g. Credit, Debit)", placeholder: "e.g. Credit", mandatory: false },
  { key: "card_holder_name", label: "Card Holder Name", placeholder: "e.g. John Doe", mandatory: false },
  { key: "card_number", label: "Card Number", placeholder: "e.g. 1234 5678 9012 3456", mandatory: false },
  { key: "expiry_date", label: "Expiry Date (e.g. 12/2025)", placeholder: "e.g. 12/2025", mandatory: false },
  { key: "cvv", label: "CVV (e.g. 123)", placeholder: "e.g. 123", mandatory: false },
  { key: "issuer", label: "Issuer (e.g. AB Bank)", placeholder: "e.g. AB Bank", mandatory: false },
  { key: "network", label: "Network (e.g. Visa, Mastercard)", placeholder: "e.g. Mastercard", mandatory: false },
  { key: "note", label: "Note", type: "textarea", placeholder: "e.g. This is a note", mandatory: false },
];

export default function PodDetails({ id }) {
  const [data, setData] = useState<PAYMENT_CARD_TYPE>({});
  const [initialData, setInitialData] = useState<PAYMENT_CARD_TYPE | null>(null);
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
      // save failed, button stays active
    }
  }, [data, savePod, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4 px-4 w-full max-w-lg mx-auto">
      <PodForm
        fields={PAYMENT_CARD_FIELDS}
        data={data}
        onChange={(key, value) => {
          setData((prev) => ({ ...prev, [key]: value }));
        }}
      />
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <SaveButton
          isDirty={isDirty}
          isUpdating={is_updating}
          onClick={handleSave}
        />
      </div>
    </div>
  );
}
