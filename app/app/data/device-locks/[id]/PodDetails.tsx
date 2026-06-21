// Device Locks PodDetails: form fields for device lock/pin data.
"use client";
import { useState } from "react";
import {
  DEVICE_LOCK,
  DEVICE_LOCK_MANDATORY,
  DEVICE_LOCK_OPTIONAL,
} from "@/types/pods/DEVICE_LOCK";
import { usePod } from "@/contexts/PodHelper";
import SaveButton from "@/components/app/data/SaveButton";
import FormField from "@/components/app/data/FormField";
import AddOptionalField from "@/components/app/data/AddOptionalField";
import { useOptionalFields } from "@/components/app/data/useOptionalFields";
import PodDetailsSkeleton from "@/components/app/data/PodDetailsSkeleton";

const SAMPLE: DEVICE_LOCK = {
  password: "123456",
  pin: "123456",
  note: "Sample Note",
};

const MANDATORY = DEVICE_LOCK_MANDATORY;
const OPTIONAL = DEVICE_LOCK_OPTIONAL;

export default function PodDetails({ id }) {
  const [data, setData] = useState<DEVICE_LOCK>({});
  const [initialData, setInitialData] = useState<DEVICE_LOCK | null>(null);
  const { addField, removeField, visible, remaining } = useOptionalFields(
    OPTIONAL,
    data,
    setData
  );
  const { loading, error, savePod, is_updating } = usePod<DEVICE_LOCK>(
    {
      TYPE: "device_lock",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: SAMPLE,
    },
    {
      onComplete: (d: null | DEVICE_LOCK) => {
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
            { password: data.password, pin: data.pin, note: data.note },
            { metamodel_id: id }
          );
          setInitialData(JSON.parse(JSON.stringify(data)));
        }}
      />
    </div>
  );
}
