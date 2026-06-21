// Bank Accounts PodDetails: form fields for bank account data.
"use client";
import { useState } from "react";
import {
  BANK_ACCOUNT_TYPE,
  BANK_ACCOUNT_MANDATORY,
} from "@/types/pods/BANK_ACCOUNT";
import { usePod } from "@/contexts/PodHelper";
import SaveButton from "@/components/app/data/SaveButton";
import FormField from "@/components/app/data/FormField";
import PodDetailsSkeleton from "@/components/app/data/PodDetailsSkeleton";

const SAMPLE: BANK_ACCOUNT_TYPE = {
  account_number: "6546489-SAMPLE",
  bank_name: "Sample Bank",
};

const MANDATORY = BANK_ACCOUNT_MANDATORY;

export default function PodDetails({ id }) {
  const [data, setData] = useState<BANK_ACCOUNT_TYPE>({});
  const [initialData, setInitialData] = useState<BANK_ACCOUNT_TYPE | null>(null);
  const { loading, error, savePod, is_updating } = usePod<BANK_ACCOUNT_TYPE>(
    {
      TYPE: "bank_account",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: SAMPLE,
    },
    {
      onComplete: (d: null | BANK_ACCOUNT_TYPE) => {
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
      <SaveButton
        data={data}
        initialData={initialData}
        isSaving={is_updating}
        onClick={async () => {
          await savePod(
            { bank_name: data.bank_name, account_number: data.account_number },
            { metamodel_id: id }
          );
          setInitialData(JSON.parse(JSON.stringify(data)));
        }}
      />
    </div>
  );
}
