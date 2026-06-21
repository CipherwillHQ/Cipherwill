// Live preview of DeFi staking data in natural-language paragraph.
// Owns: preview rendering for platform, asset, wallet, and note. Does NOT own form or save logic.
"use client";
import { DEFI_STACKING } from "@/types/pods/DEFI_STAKING";
import type { PreviewProps } from "@/types/interfaces";
import PodPreviewSection, { PreviewValue, MetamodelName } from "@/components/pods/PodPreview";

interface Props extends PreviewProps {
  d: DEFI_STACKING;
}

export default function DefiStakingPreview({ d, metamodel, addAndClose, isSkippable, isAddable }: Props) {
  return (
    <PodPreviewSection>
      <p>
        I have a <MetamodelName name={metamodel?.name} fallback="DeFi stake" /> of{" "}
        <PreviewValue value={d.asset_amount} addLabel={isAddable("asset_amount") ? "Amount" : undefined} onAdd={isAddable("asset_amount") ? () => addAndClose("asset_amount") : undefined} />{" "}
        <PreviewValue value={d.asset_name} addLabel={isAddable("asset_name") ? "Asset name" : undefined} onAdd={isAddable("asset_name") ? () => addAndClose("asset_name") : undefined} /> on{" "}
        <PreviewValue value={d.platform} addLabel={isAddable("platform") ? "Platform" : undefined} onAdd={isAddable("platform") ? () => addAndClose("platform") : undefined} />,
        locked for{" "}
        <PreviewValue value={d.lock_period} addLabel={isAddable("lock_period") ? "Lock period" : undefined} onAdd={isAddable("lock_period") ? () => addAndClose("lock_period") : undefined} />,
        in wallet{" "}
        <PreviewValue value={d.wallet_address} addLabel={isAddable("wallet_address") ? "Wallet address" : undefined} onAdd={isAddable("wallet_address") ? () => addAndClose("wallet_address") : undefined} />.
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
          For context, <PreviewValue value={d.note} addLabel={isAddable("note") ? "Note" : undefined} onAdd={isAddable("note") ? () => addAndClose("note") : undefined} />.
        </p>
      )}
    </PodPreviewSection>
  );
}
