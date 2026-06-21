// DeFi Staking PodDetails: form fields for DeFi staking position data.
"use client";
import { useState } from "react";
import {
  DEFI_STACKING,
  DEFI_STAKING_MANDATORY,
  DEFI_STAKING_OPTIONAL,
} from "@/types/pods/DEFI_STAKING";
import { usePod } from "@/contexts/PodHelper";
import SaveButton from "@/components/app/data/SaveButton";
import FormField from "@/components/app/data/FormField";
import AddOptionalField from "@/components/app/data/AddOptionalField";
import { useOptionalFields } from "@/components/app/data/useOptionalFields";
import PodDetailsSkeleton from "@/components/app/data/PodDetailsSkeleton";

const SAMPLE: DEFI_STACKING = {
  platform: "AAVE",
  asset_amount: "100",
  asset_name: "USDC",
  lock_period: "1 month",
  wallet_address: "0x1234567890",
  username: "johndoe",
  password: "123456",
  note: "This is a sample note",
};

const MANDATORY = DEFI_STAKING_MANDATORY;
const OPTIONAL = DEFI_STAKING_OPTIONAL;

export default function PodDetails({ id }) {
  const [data, setData] = useState<DEFI_STACKING>({});
  const [initialData, setInitialData] = useState<DEFI_STACKING | null>(null);
  const { addField, removeField, visible, remaining } = useOptionalFields(
    OPTIONAL,
    data,
    setData
  );
  const { loading, error, savePod, is_updating } = usePod<DEFI_STACKING>(
    {
      TYPE: "defi_staking",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: SAMPLE,
    },
    {
      onComplete: (d: null | DEFI_STACKING) => {
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
              platform: data.platform,
              asset_amount: data.asset_amount,
              asset_name: data.asset_name,
              lock_period: data.lock_period,
              wallet_address: data.wallet_address,
              username: data.username,
              password: data.password,
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
