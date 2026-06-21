// Live preview of bank account data in natural-language paragraph.
// Owns: preview rendering for bank name and account number. Does NOT own form or save logic.
"use client";
import { BANK_ACCOUNT_TYPE } from "@/types/pods/BANK_ACCOUNT";
import type { PreviewProps } from "@/types/interfaces";
import PodPreviewSection, { PreviewValue, MetamodelName } from "@/components/pods/PodPreview";

interface Props extends PreviewProps {
  d: BANK_ACCOUNT_TYPE;
}

export default function BankAccountPreview({ d, metamodel, addAndClose, isAddable }: Props) {
  return (
    <PodPreviewSection>
      <p>
        I have a <MetamodelName name={metamodel?.name} fallback="bank account" /> with{" "}
        <PreviewValue value={d.bank_name} addLabel={isAddable("bank_name") ? "Bank name" : undefined} onAdd={isAddable("bank_name") ? () => addAndClose("bank_name") : undefined} />,
        account number{" "}
        <PreviewValue value={d.account_number} addLabel={isAddable("account_number") ? "Account number" : undefined} onAdd={isAddable("account_number") ? () => addAndClose("account_number") : undefined} />.
      </p>
    </PodPreviewSection>
  );
}
