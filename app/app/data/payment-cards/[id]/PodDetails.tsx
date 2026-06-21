// Payment Cards PodDetails: form fields for payment card data.
"use client";
import { useState } from "react";
import {
  PAYMENT_CARD_TYPE,
  PAYMENT_CARD_MANDATORY,
  PAYMENT_CARD_OPTIONAL,
} from "@/types/pods/PAYMENT_CARD";
import { usePod } from "@/contexts/PodHelper";
import SaveButton from "@/components/app/data/SaveButton";
import FormField from "@/components/app/data/FormField";
import AddOptionalField from "@/components/app/data/AddOptionalField";
import { useOptionalFields } from "@/components/app/data/useOptionalFields";
import PodDetailsSkeleton from "@/components/app/data/PodDetailsSkeleton";

const SAMPLE: PAYMENT_CARD_TYPE = {
  type: "Credit",
  card_holder_name: "John Doe",
  card_number: "1234567890123456",
  expiry_date: "12/2025",
  cvv: "123",
  issuer: "AB Bank",
  network: "Mastercard",
  note: "This is a note",
};

const MANDATORY = PAYMENT_CARD_MANDATORY;
const OPTIONAL = PAYMENT_CARD_OPTIONAL;

export default function PodDetails({ id }) {
  const [data, setData] = useState<PAYMENT_CARD_TYPE>({});
  const [initialData, setInitialData] = useState<PAYMENT_CARD_TYPE | null>(null);
  const { addField, removeField, visible, remaining } = useOptionalFields(
    OPTIONAL,
    data,
    setData
  );
  const { loading, error, savePod, is_updating } = usePod<PAYMENT_CARD_TYPE>(
    {
      TYPE: "payment_card",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: SAMPLE,
    },
    {
      onComplete: (d: null | PAYMENT_CARD_TYPE) => {
        if (d) setData(d);
        setInitialData(JSON.parse(JSON.stringify(d || {})));
      },
    }
  );
  if (loading) return <PodDetailsSkeleton />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4 px-4 w-full max-w-xl">
      {MANDATORY.map((f) => (
        <FormField
          key={f.key}
          label={f.label}
          type={f.type}
          sensitive={f.sensitive}
          placeholder={f.placeholder}
          required
          value={data[f.key]}
          onChange={(v) => setData({ ...data, [f.key]: v })}
        />
      ))}

      {visible.map((f) => (
        <FormField
          key={f.key}
          label={f.label}
          type={f.type}
          sensitive={f.sensitive}
          placeholder={f.placeholder}
          value={data[f.key]}
          onChange={(v) => setData({ ...data, [f.key]: v })}
          onRemove={() => removeField(f.key)}
        />
      ))}

      <AddOptionalField fields={remaining} onAdd={addField} />

      <SaveButton
        data={data}
        initialData={initialData}
        isSaving={is_updating}
        onClick={async () => {
          await savePod(
            {
              type: data.type,
              card_holder_name: data.card_holder_name,
              card_number: data.card_number,
              expiry_date: data.expiry_date,
              cvv: data.cvv,
              issuer: data.issuer,
              network: data.network,
              note: data.note,
            },
            { metamodel_id: id }
          );
          setInitialData(JSON.parse(JSON.stringify(data)));
        }}
      />
    </div>
  );
}
