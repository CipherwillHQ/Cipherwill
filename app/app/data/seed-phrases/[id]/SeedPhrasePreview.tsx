// Live preview of seed phrase data in natural-language paragraph.
// Owns: preview rendering for phrase, public key, and note. Does NOT own form or save logic.
"use client";
import { SEED_PHRASE_TYPE } from "@/types/pods/SEED_PHRASE";
import type { PreviewProps } from "@/types/interfaces";
import PodPreviewSection, { PreviewValue, MetamodelName } from "@/components/pods/PodPreview";

interface Props extends PreviewProps {
  d: SEED_PHRASE_TYPE;
}

export default function SeedPhrasePreview({ d, metamodel, addAndClose, isSkippable, isAddable }: Props) {
  return (
    <PodPreviewSection>
      <p>
        I have a <MetamodelName name={metamodel?.name} fallback="seed phrase" />:{" "}
        <PreviewValue value={d.phrase?.join(", ")} sensitive />.
      </p>
      {(d.public_key || !isSkippable("public_key")) && (
        <p>
          My public key is{" "}
          <PreviewValue value={d.public_key} addLabel={isAddable("public_key") ? "Public Key" : undefined} onAdd={isAddable("public_key") ? () => addAndClose("public_key") : undefined} />.
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
