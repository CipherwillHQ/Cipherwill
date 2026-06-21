// Live preview of payment card data in natural-language paragraph.
// Owns: preview rendering for card type, number, expiry, CVV, issuer, network, note.
"use client";
import { PAYMENT_CARD_TYPE } from "@/types/pods/PAYMENT_CARD";
import type { PreviewProps } from "@/types/interfaces";
import PodPreviewSection, { PreviewValue, MetamodelName, NotePreview, buildAddButtonProps } from "@/components/pods/PodPreview";

interface Props extends PreviewProps {
  d: PAYMENT_CARD_TYPE;
}

export default function PaymentCardPreview({ d, metamodel, addAndClose, isSkippable, isAddable }: Props) {
  return (
    <PodPreviewSection>
      <p>
        I have a <MetamodelName name={metamodel?.name} fallback="card" /> with the number ending in{" "}
        <PreviewValue value={d.card_number} maskLast4 {...buildAddButtonProps("card_number", "Card Number", isAddable, addAndClose)} />.
      </p>
      <p>
        It is a{" "}
        <PreviewValue value={d.type} fallback="card" {...buildAddButtonProps("type", "Type", isAddable, addAndClose)} /> card,
        issued by{" "}
        <PreviewValue value={d.issuer} {...buildAddButtonProps("issuer", "Issuer", isAddable, addAndClose)} /> on
        the <PreviewValue value={d.network} {...buildAddButtonProps("network", "Network", isAddable, addAndClose)} /> network.
        It expires on{" "}
        <PreviewValue value={d.expiry_date} {...buildAddButtonProps("expiry_date", "Expiry Date", isAddable, addAndClose)} />.
      </p>
      {d.cvv && (
        <p>
          The CVV is <PreviewValue value={d.cvv} sensitive />.
        </p>
      )}
      <NotePreview value={d.note} skippable={isSkippable("note")} addable={isAddable("note")} addAndClose={addAndClose} />
    </PodPreviewSection>
  );
}
