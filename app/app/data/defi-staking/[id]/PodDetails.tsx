"use client";
import { useState, useCallback } from "react";
import { usePod } from "@/contexts/PodHelper";
import { DEFI_STACKING } from "@/types/pods/DEFI_STAKING";
import PodForm, { PodFieldConfig } from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";

const DEFI_STACKING_SAMPLE: DEFI_STACKING = {
  platform: "AAVE",
  asset_amount: "100",
  asset_name: "USDC",
  lock_period: "1 month",
  wallet_address: "0x1234567890",
  username: "johndoe",
  password: "123456",
  note: "This is a sample note",
};

const DEFI_STACKING_FIELDS: PodFieldConfig[] = [
  { key: "platform", label: "Platform (AAVE, COMPOUND, etc.)", placeholder: "e.g. AAVE", mandatory: false },
  { key: "asset_amount", label: "Amount", placeholder: "e.g. 100", mandatory: false },
  { key: "asset_name", label: "Asset name (e.g. USDC)", placeholder: "e.g. USDC", mandatory: false },
  { key: "lock_period", label: "Lock period (e.g. 1 month)", placeholder: "e.g. 1 month", mandatory: false },
  { key: "wallet_address", label: "Wallet address", placeholder: "e.g. 0x1234567890", mandatory: false },
  { key: "username", label: "Username (if required)", placeholder: "e.g. johndoe", mandatory: false },
  { key: "password", label: "Password", type: "password", placeholder: "e.g. your password", mandatory: false },
  { key: "note", label: "Note", type: "textarea", placeholder: "e.g. This is a sample note", mandatory: false },
];

export default function PodDetails({ id }) {
  const [data, setData] = useState<DEFI_STACKING>({});
  const [initialData, setInitialData] = useState<DEFI_STACKING | null>(null);
  const { loading, error, savePod, is_updating } = usePod<DEFI_STACKING>(
    {
      TYPE: "defi_staking",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: DEFI_STACKING_SAMPLE,
    },
    {
      onComplete: (data: null | DEFI_STACKING) => {
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
        platform: data.platform,
        asset_amount: data.asset_amount,
        asset_name: data.asset_name,
        lock_period: data.lock_period,
        wallet_address: data.wallet_address,
        username: data.username,
        password: data.password,
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
        fields={DEFI_STACKING_FIELDS}
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
