// DeFi staking pod form: platform, asset details, wallet info with live preview.
// Owns: field config, save logic, preview rendering. Does NOT own form chrome or field rendering.
"use client";
import { useState, useRef } from "react";
import { usePod } from "@/contexts/PodHelper";
import { DEFI_STACKING } from "@/types/pods/DEFI_STAKING";
import PodForm, { PodFieldConfig, PodFormHandle } from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";
import PodFormLayout from "@/components/pods/PodFormLayout";
import PodPreviewSection, { PreviewValue } from "@/components/pods/PodPreview";
import { useMetamodelData } from "@/common/useMetamodelData";
import toast from "react-hot-toast";

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
  { key: "platform", label: "Platform (AAVE, COMPOUND, etc.)", placeholder: "e.g. AAVE", visibility: "mandatory" },
  { key: "asset_amount", label: "Amount", placeholder: "e.g. 100", visibility: "mandatory" },
  { key: "asset_name", label: "Asset name (e.g. USDC)", placeholder: "e.g. USDC", visibility: "mandatory" },
  { key: "lock_period", label: "Lock period (e.g. 1 month)", placeholder: "e.g. 1 month", visibility: "optional" },
  { key: "wallet_address", label: "Wallet address", placeholder: "e.g. 0x1234567890", visibility: "optional" },
  { key: "username", label: "Username (if required)", placeholder: "e.g. johndoe", visibility: "skippable" },
  { key: "password", label: "Password", type: "password", placeholder: "e.g. your password", visibility: "skippable" },
  { key: "note", label: "Note", type: "textarea", placeholder: "e.g. This is a sample note", visibility: "skippable" },
];

export default function PodDetails({ id }) {
  const [data, setData] = useState<DEFI_STACKING>({});
  const [initialData, setInitialData] = useState<DEFI_STACKING | null>(null);
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

  const isDirty = initialData !== null && JSON.stringify(initialData) !== JSON.stringify(data);

  async function handleSave() {
    try {
      await savePod(data, { metamodel_id: id });
      setInitialData(JSON.parse(JSON.stringify(data)));
    } catch {
      toast.error("Failed to save changes. Please try again.");
    }
  }

  function addAndClose(key: string) {
    podFormRef.current?.addField(key);
    setPreviewOpen(false);
  }

  const isSkippable = (key: string) =>
    DEFI_STACKING_FIELDS.find((f) => f.key === key)?.visibility === "skippable";

  function renderPreview(d: DEFI_STACKING) {
    const canAdd = (key: string) => !isSkippable(key);
    return (
      <PodPreviewSection>
        <p>
          I have a {metamodel?.name || "DeFi stake"} of{" "}
          <PreviewValue value={d.asset_amount} addLabel="Amount" onAdd={() => addAndClose("asset_amount")} />{" "}
          <PreviewValue value={d.asset_name} addLabel="Asset name" onAdd={() => addAndClose("asset_name")} /> on{" "}
          <PreviewValue value={d.platform} addLabel="Platform" onAdd={() => addAndClose("platform")} />,
          locked for{" "}
          <PreviewValue value={d.lock_period} addLabel={canAdd("lock_period") ? "Lock period" : undefined} onAdd={canAdd("lock_period") ? () => addAndClose("lock_period") : undefined} />,
          in wallet{" "}
          <PreviewValue value={d.wallet_address} addLabel="Wallet address" onAdd={() => addAndClose("wallet_address")} />.
        </p>
        {d.username && (
          <p>
            My username is <PreviewValue value={d.username} />.
          </p>
        )}
        {d.password && (
          <p>
            The password is <PreviewValue value={d.password} sensitive />.
          </p>
        )}
        {(d.note || !isSkippable("note")) && (
          <p>
            For context, <PreviewValue value={d.note} addLabel={canAdd("note") ? "Note" : undefined} onAdd={canAdd("note") ? () => addAndClose("note") : undefined} />.
          </p>
        )}
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
