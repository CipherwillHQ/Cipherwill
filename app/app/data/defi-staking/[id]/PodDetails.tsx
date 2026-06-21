"use client";
import { useState, useCallback, useRef } from "react";
import { usePod } from "@/contexts/PodHelper";
import { DEFI_STACKING } from "@/types/pods/DEFI_STAKING";
import PodForm, { PodFieldConfig, PodFormHandle } from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";
import PodFormLayout from "@/components/pods/PodFormLayout";
import PodPreviewSection, { PreviewValue } from "@/components/pods/PodPreview";
import { useMetamodelData } from "@/common/useMetamodelData";

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
  { key: "platform", label: "Platform (AAVE, COMPOUND, etc.)", placeholder: "e.g. AAVE", mandatory: true },
  { key: "asset_amount", label: "Amount", placeholder: "e.g. 100", mandatory: true },
  { key: "asset_name", label: "Asset name (e.g. USDC)", placeholder: "e.g. USDC", mandatory: true },
  { key: "lock_period", label: "Lock period (e.g. 1 month)", placeholder: "e.g. 1 month", mandatory: false },
  { key: "wallet_address", label: "Wallet address", placeholder: "e.g. 0x1234567890", mandatory: false },
  { key: "username", label: "Username (if required)", placeholder: "e.g. johndoe", mandatory: false },
  { key: "password", label: "Password", type: "password", placeholder: "e.g. your password", mandatory: false },
  { key: "note", label: "Note", type: "textarea", placeholder: "e.g. This is a sample note", mandatory: false },
];

export default function PodDetails({ id }) {
  const [data, setData] = useState<DEFI_STACKING>({});
  const [initialData, setInitialData] = useState<DEFI_STACKING>({} as DEFI_STACKING);
  const [previewOpen, setPreviewOpen] = useState(false);
  const podFormRef = useRef<PodFormHandle>(null);
  const metamodel = useMetamodelData(id);
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

  const addAndClose = (key: string) => {
    podFormRef.current?.addField(key);
    setPreviewOpen(false);
  };

  function renderPreview(d: DEFI_STACKING) {
    return (
      <PodPreviewSection>
        <p>
          I have a {metamodel?.name || "DeFi stake"} of{" "}
          <PreviewValue value={d.asset_amount} addLabel="Amount" onAdd={() => addAndClose("asset_amount")} />{" "}
          <PreviewValue value={d.asset_name} addLabel="Asset name" onAdd={() => addAndClose("asset_name")} /> on{" "}
          <PreviewValue value={d.platform} addLabel="Platform" onAdd={() => addAndClose("platform")} />,
          locked for{" "}
          <PreviewValue value={d.lock_period} addLabel="Lock period" onAdd={() => addAndClose("lock_period")} />,
          in wallet{" "}
          <PreviewValue value={d.wallet_address} addLabel="Wallet address" onAdd={() => addAndClose("wallet_address")} />.
        </p>
        <p>
          My username is{" "}
          <PreviewValue value={d.username} addLabel="Username" onAdd={() => addAndClose("username")} />,
          and the password is{" "}
          <PreviewValue value={d.password} sensitive addLabel="Password" onAdd={() => addAndClose("password")} />.
        </p>
        <p>
          For context, <PreviewValue value={d.note} addLabel="Note" onAdd={() => addAndClose("note")} />.
        </p>
      </PodPreviewSection>
    );
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <PodFormLayout
      preview={renderPreview(data)}
      previewOpen={previewOpen}
      onTogglePreview={() => setPreviewOpen(!previewOpen)}
      isDirty={isDirty}
      saveButton={<SaveButton isDirty={isDirty} isUpdating={is_updating} onClick={handleSave} />}
    >
      <PodForm
        ref={podFormRef}
        fields={DEFI_STACKING_FIELDS}
        data={data}
        onChange={(key, value) => {
          setData((prev) => ({ ...prev, [key]: value }));
        }}
      />
    </PodFormLayout>
  );
}
