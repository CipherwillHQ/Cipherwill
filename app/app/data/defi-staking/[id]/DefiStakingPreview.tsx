// Live preview of DeFi staking data in natural-language paragraph.
// Owns: preview rendering for platform, asset, wallet, and note. Does NOT own form or save logic.
"use client";
import { DEFI_STACKING } from "@/types/pods/DEFI_STAKING";
import PodPreviewSection, { PreviewValue } from "@/components/pods/PodPreview";
import { MetamodelData } from "@/common/useMetamodelData";

interface Props {
  d: DEFI_STACKING;
  metamodel: MetamodelData | null;
  addAndClose: (key: string) => void;
  isSkippable: (key: string) => boolean;
}

export default function DefiStakingPreview({ d, metamodel, addAndClose, isSkippable }: Props) {
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
