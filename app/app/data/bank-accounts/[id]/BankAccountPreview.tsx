// Live preview of bank account data in natural-language paragraph.
// Owns: preview rendering for bank name and account number. Does NOT own form or save logic.
"use client";
import { BANK_ACCOUNT_TYPE } from "@/types/pods/BANK_ACCOUNT";
import type { PreviewProps } from "@/types/interfaces";
import PodPreviewSection, { PreviewValue } from "@/components/pods/PodPreview";

interface Props extends PreviewProps {
  d: BANK_ACCOUNT_TYPE;
}

export default function BankAccountPreview({ d, metamodel, addAndClose }: Props) {
  return (
    <PodPreviewSection>
      <p>
        I have a {metamodel?.name || "bank account"} with{" "}
        <PreviewValue value={d.bank_name} addLabel="Bank name" onAdd={() => addAndClose("bank_name")} />,
        account number{" "}
        <PreviewValue value={d.account_number} addLabel="Account number" onAdd={() => addAndClose("account_number")} />.
      </p>
    </PodPreviewSection>
  );
}
