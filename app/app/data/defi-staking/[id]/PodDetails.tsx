// DeFi staking pod form: platform, asset details, wallet info with live preview.
// Owns: field config, save logic, orchestration. Does NOT own form chrome or preview rendering.
"use client";
import { DEFI_STACKING } from "@/types/pods/DEFI_STAKING";
import { usePodForm } from "@/components/common/usePodForm";
import type { PodFieldConfig } from "@/types/interfaces";
import PodForm from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";
import PodFormLayout from "@/components/pods/PodFormLayout";
import PodFormSkeleton from "@/components/pods/PodFormSkeleton";
import DefiStakingPreview from "./DefiStakingPreview";

const DEFI_STACKING_SAMPLE: DEFI_STACKING = {
  platform: "AAVE",
  asset_amount: "100",
  asset_name: "USDC",
  lock_period: "1 month",
  wallet_address: "0x1234567890",
  username: "johndoe",
  password: "password",
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

export default function PodDetails({ id }: { id: string }) {
  const {
    data, setData, loading, error, isUpdating, handleSave,
    previewOpen, setPreviewOpen, isDirty, podFormRef,
    metamodel, isSkippable, addAndClose, addGroupAndClose, addSectionAndClose,
  } = usePodForm<DEFI_STACKING>(DEFI_STACKING_SAMPLE, {
    podType: "defi_staking", version: "0.0.1", refId: id, fields: DEFI_STACKING_FIELDS,
  });

  if (loading) return <PodFormSkeleton />;
  if (error) return <div>Error: {error}</div>;

  return (
    <PodFormLayout
      preview={<DefiStakingPreview d={data} metamodel={metamodel} isSkippable={isSkippable} addAndClose={addAndClose} addGroupAndClose={addGroupAndClose} addSectionAndClose={addSectionAndClose} />}
      previewOpen={previewOpen}
      onTogglePreview={() => setPreviewOpen(!previewOpen)}
      isDirty={isDirty}
      saveButton={<SaveButton isDirty={isDirty} isUpdating={isUpdating} onClick={handleSave} />}
    >
      <PodForm
        ref={podFormRef}
        fields={DEFI_STACKING_FIELDS}
        data={data}
        onChange={(key, value) => setData((prev) => ({ ...prev, [key]: value }))}
      />
    </PodFormLayout>
  );
}
