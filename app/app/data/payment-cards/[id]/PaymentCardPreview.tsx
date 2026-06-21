// Live preview of payment card data in natural-language paragraph.
// Owns: preview rendering for card type, number, expiry, CVV, issuer, network, note.
"use client";
import { PAYMENT_CARD_TYPE } from "@/types/pods/PAYMENT_CARD";
import type { PreviewProps } from "@/types/interfaces";
import PodPreviewSection, { PreviewValue, MetamodelName } from "@/components/pods/PodPreview";

interface Props extends PreviewProps {
  d: PAYMENT_CARD_TYPE;
}

export default function PaymentCardPreview({ d, metamodel, addAndClose, isSkippable, isAddable }: Props) {
  return (
    <PodPreviewSection>
      <p>
        I have a <MetamodelName name={metamodel?.name} fallback="card" /> with the number ending in{" "}
        <PreviewValue value={d.card_number} maskLast4 addLabel={isAddable("card_number") ? "Card Number" : undefined} onAdd={isAddable("card_number") ? () => addAndClose("card_number") : undefined} />.
      </p>
      <p>
        It is a{" "}
        <PreviewValue value={d.type} fallback="card" addLabel={isAddable("type") ? "Type" : undefined} onAdd={isAddable("type") ? () => addAndClose("type") : undefined} /> card,
        issued by{" "}
        <PreviewValue value={d.issuer} addLabel={isAddable("issuer") ? "Issuer" : undefined} onAdd={isAddable("issuer") ? () => addAndClose("issuer") : undefined} /> on
        the <PreviewValue value={d.network} addLabel={isAddable("network") ? "Network" : undefined} onAdd={isAddable("network") ? () => addAndClose("network") : undefined} /> network.
        It expires on{" "}
        <PreviewValue value={d.expiry_date} addLabel={isAddable("expiry_date") ? "Expiry Date" : undefined} onAdd={isAddable("expiry_date") ? () => addAndClose("expiry_date") : undefined} />.
      </p>
      {d.cvv && (
        <p>
          The CVV is <PreviewValue value={d.cvv} sensitive />.
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
