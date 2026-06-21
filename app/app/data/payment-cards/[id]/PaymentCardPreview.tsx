// Live preview of payment card data in natural-language paragraph.
// Owns: preview rendering for card type, number, expiry, CVV, issuer, network, note.
"use client";
import { PAYMENT_CARD_TYPE } from "@/types/pods/PAYMENT_CARD";
import type { PreviewProps } from "@/types/interfaces";
import PodPreviewSection, { PreviewValue } from "@/components/pods/PodPreview";

interface Props extends PreviewProps {
  d: PAYMENT_CARD_TYPE;
}

export default function PaymentCardPreview({ d, metamodel, addAndClose, isSkippable }: Props) {
  const canAdd = (key: string) => !isSkippable(key);
  return (
    <PodPreviewSection>
      <p>
        I have a {metamodel?.name || "card"} with the number ending in{" "}
        <PreviewValue value={d.card_number} maskLast4 addLabel="Card Number" onAdd={() => addAndClose("card_number")} />.
      </p>
      <p>
        It is a{" "}
        <PreviewValue value={d.type} fallback="card" addLabel={canAdd("type") ? "Type" : undefined} onAdd={canAdd("type") ? () => addAndClose("type") : undefined} /> card,
        issued by{" "}
        <PreviewValue value={d.issuer} addLabel={canAdd("issuer") ? "Issuer" : undefined} onAdd={canAdd("issuer") ? () => addAndClose("issuer") : undefined} /> on
        the <PreviewValue value={d.network} addLabel={canAdd("network") ? "Network" : undefined} onAdd={canAdd("network") ? () => addAndClose("network") : undefined} /> network.
        It expires on{" "}
        <PreviewValue value={d.expiry_date} addLabel="Expiry Date" onAdd={() => addAndClose("expiry_date")} />.
      </p>
      {d.cvv && (
        <p>
          The CVV is <PreviewValue value={d.cvv} sensitive />.
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
