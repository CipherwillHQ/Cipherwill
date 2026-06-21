// Live preview of DeFi staking data in natural-language paragraph.
// Owns: preview rendering for platform, asset, wallet, and note. Does NOT own form or save logic.
"use client";
import { DEFI_STACKING } from "@/types/pods/DEFI_STAKING";
import type { PreviewProps } from "@/types/interfaces";
import PodPreviewSection, { PreviewValue, MetamodelName, NotePreview, buildAddButtonProps } from "@/components/pods/PodPreview";

interface Props extends PreviewProps {
  d: DEFI_STACKING;
}

export default function DefiStakingPreview({ d, metamodel, addAndClose, isSkippable, isAddable }: Props) {
  return (
    <PodPreviewSection>
      <p>
        I have a <MetamodelName name={metamodel?.name} fallback="DeFi stake" /> of{" "}
        <PreviewValue value={d.asset_amount} {...buildAddButtonProps("asset_amount", "Amount", isAddable, addAndClose)} />{" "}
        <PreviewValue value={d.asset_name} {...buildAddButtonProps("asset_name", "Asset name", isAddable, addAndClose)} /> on{" "}
        <PreviewValue value={d.platform} {...buildAddButtonProps("platform", "Platform", isAddable, addAndClose)} />,
        locked for{" "}
        <PreviewValue value={d.lock_period} {...buildAddButtonProps("lock_period", "Lock period", isAddable, addAndClose)} />,
        in wallet{" "}
        <PreviewValue value={d.wallet_address} {...buildAddButtonProps("wallet_address", "Wallet address", isAddable, addAndClose)} />.
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
      <NotePreview value={d.note} skippable={isSkippable("note")} addable={isAddable("note")} addAndClose={addAndClose} />
    </PodPreviewSection>
  );
}
