// Live preview of seed phrase data in natural-language paragraph.
// Owns: preview rendering for phrase, public key, and note. Does NOT own form or save logic.
"use client";
import { SEED_PHRASE_TYPE } from "@/types/pods/SEED_PHRASE";
import PodPreviewSection, { PreviewValue } from "@/components/pods/PodPreview";
import { MetamodelData } from "@/common/useMetamodelData";

interface Props {
  d: SEED_PHRASE_TYPE;
  metamodel: MetamodelData | null;
  addAndClose: (key: string) => void;
  isSkippable: (key: string) => boolean;
}

export default function SeedPhrasePreview({ d, metamodel, addAndClose, isSkippable }: Props) {
  const canAdd = (key: string) => !isSkippable(key);
  return (
    <PodPreviewSection>
      <p>
        I have a {metamodel?.name || "seed phrase"}:{" "}
        <PreviewValue value={d.phrase?.join(", ")} sensitive />.
      </p>
      {(d.public_key || !isSkippable("public_key")) && (
        <p>
          My public key is{" "}
          <PreviewValue value={d.public_key} addLabel={canAdd("public_key") ? "Public Key" : undefined} onAdd={canAdd("public_key") ? () => addAndClose("public_key") : undefined} />.
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
