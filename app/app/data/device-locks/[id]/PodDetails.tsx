// Device Locks PodDetails: form fields for device lock/pin data.
"use client";
import { useState } from "react";
import {
  DEVICE_LOCK,
  DEVICE_LOCK_MANDATORY,
  DEVICE_LOCK_OPTIONAL,
} from "@/types/pods/DEVICE_LOCK";
import { usePod } from "@/contexts/PodHelper";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import FormField from "@/components/app/data/FormField";
import AddOptionalField from "@/components/app/data/AddOptionalField";
import { useOptionalFields } from "@/components/app/data/useOptionalFields";

const SAMPLE: DEVICE_LOCK = {
  password: "123456",
  pin: "123456",
  note: "Sample Note",
};

const MANDATORY = DEVICE_LOCK_MANDATORY;
const OPTIONAL = DEVICE_LOCK_OPTIONAL;

export default function PodDetails({ id }) {
  const [data, setData] = useState<DEVICE_LOCK>({});
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
      },
    }
  );
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4 px-4 w-full max-w-xl">
      {MANDATORY.map((f) => (
        <FormField
          key={f.key}
          label={f.label}
          type={f.type as "text" | "email" | "textarea" | undefined}
          sensitive={f.sensitive}
          placeholder={f.placeholder}
          required
          value={String(data[f.key] || "")}
          onChange={(v) => setData({ ...data, [f.key]: v })}
        />
      ))}

      {visible.map((f) => (
        <FormField
          key={f.key}
          label={f.label}
          type={f.type as "text" | "email" | "textarea" | undefined}
          sensitive={f.sensitive}
          placeholder={f.placeholder}
          value={String(data[f.key] || "")}
          onChange={(v) => setData({ ...data, [f.key]: v })}
          onRemove={() => removeField(f.key)}
        />
      ))}

      <AddOptionalField fields={remaining} onAdd={addField} />

      <div className="flex flex-col sm:flex-row items-center gap-2">
        <button
          className="flex items-center justify-center gap-2 bg-black text-white font-bold py-2 px-4 rounded-sm w-full"
          onClick={() => {
            savePod(
              { password: data.password, pin: data.pin, note: data.note },
              { metamodel_id: id }
            );
          }}
        >
          {is_updating && <LoadingIndicator />}
          Save
        </button>
      </div>
    </div>
  );
}
