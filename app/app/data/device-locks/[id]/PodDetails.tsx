"use client";
import { useState, useCallback } from "react";
import { usePod } from "@/contexts/PodHelper";
import { DEVICE_LOCK } from "@/types/pods/DEVICE_LOCK";
import PodForm, { PodFieldConfig } from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";

const DEVICE_LOCK_SAMPLE: DEVICE_LOCK = {
  password: "123456",
  pin: "123456",
  note: "Sample Note",
};

const DEVICE_LOCK_FIELDS: PodFieldConfig[] = [
  { key: "password", label: "Password", placeholder: "e.g. 123456", mandatory: false },
  { key: "pin", label: "Pin", placeholder: "e.g. 123456", mandatory: false },
  { key: "note", label: "Note", type: "textarea", placeholder: "e.g. Sample Note", mandatory: false },
];

export default function PodDetails({ id }) {
  const [data, setData] = useState<DEVICE_LOCK>({});
  const [initialData, setInitialData] = useState<DEVICE_LOCK | null>(null);
  const { loading, error, savePod, is_updating } = usePod<DEVICE_LOCK>(
    {
      TYPE: "device_lock",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: DEVICE_LOCK_SAMPLE,
    },
    {
      onComplete: (data: null | DEVICE_LOCK) => {
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
        password: data.password,
        pin: data.pin,
        note: data.note,
      },{
        metamodel_id: id,
      });
      setInitialData(JSON.parse(JSON.stringify(data)));
    } catch (_) {
    }
  }, [data, savePod, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4 px-4 w-full max-w-lg mx-auto">
      <PodForm
        fields={DEVICE_LOCK_FIELDS}
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
