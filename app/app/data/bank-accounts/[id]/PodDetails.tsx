"use client";
import { useState, useCallback } from "react";
import { BANK_ACCOUNT_TYPE } from "../../../../../types/pods/BANK_ACCOUNT";
import { usePod } from "@/contexts/PodHelper";
import PodForm, { PodFieldConfig } from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";

const BANK_ACCOUNT_SAMPLE: BANK_ACCOUNT_TYPE = {
  account_number: "6546489-SAMPLE",
  bank_name: "Sample Bank",
};

const BANK_ACCOUNT_FIELDS: PodFieldConfig[] = [
  { key: "account_number", label: "Account number", placeholder: "e.g. 6546489", mandatory: false },
  { key: "bank_name", label: "Bank name", placeholder: "e.g. Sample Bank", mandatory: false },
];

export default function PodDetails({ id }) {
  const [data, setData] = useState<BANK_ACCOUNT_TYPE>({});
  const [initialData, setInitialData] = useState<BANK_ACCOUNT_TYPE | null>(null);
  const { loading, error, savePod, is_updating } = usePod<BANK_ACCOUNT_TYPE>(
    {
      TYPE: "bank_account",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: BANK_ACCOUNT_SAMPLE,
    },
    {
      onComplete: (data: null | BANK_ACCOUNT_TYPE) => {
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
        bank_name: data.bank_name,
        account_number: data.account_number,
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
        fields={BANK_ACCOUNT_FIELDS}
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
