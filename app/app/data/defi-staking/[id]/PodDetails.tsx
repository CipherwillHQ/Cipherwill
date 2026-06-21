// DeFi Staking PodDetails: form fields for DeFi staking position data.
"use client";
import { useState } from "react";
import {
  DEFI_STACKING,
  DEFI_STAKING_MANDATORY,
  DEFI_STAKING_OPTIONAL,
} from "@/types/pods/DEFI_STAKING";
import { usePod } from "@/contexts/PodHelper";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import FormField from "@/components/app/data/FormField";
import AddOptionalField from "@/components/app/data/AddOptionalField";
import { useOptionalFields } from "@/components/app/data/useOptionalFields";

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
          }}
        >
          {is_updating && <LoadingIndicator />}
          Save
        </button>
      </div>
    </div>
  );
}
