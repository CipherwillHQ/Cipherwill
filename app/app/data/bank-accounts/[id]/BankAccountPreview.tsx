// Live preview of bank account data in natural-language paragraph.
// Owns: preview rendering for bank name and account number. Does NOT own form or save logic.
"use client";
import { BANK_ACCOUNT_TYPE } from "@/types/pods/BANK_ACCOUNT";
import type { PreviewProps } from "@/types/interfaces";
import PodPreviewSection, { PreviewValue, MetamodelName, buildAddButtonProps } from "@/components/pods/PodPreview";

interface Props extends PreviewProps {
  d: BANK_ACCOUNT_TYPE;
}

export default function BankAccountPreview({ d, metamodel, addAndClose, isAddable }: Props) {
  return (
    <PodPreviewSection>
      <p>
        I have a <MetamodelName name={metamodel?.name} fallback="bank account" /> with{" "}
        <PreviewValue value={d.bank_name} {...buildAddButtonProps("bank_name", "Bank name", isAddable, addAndClose)} />,
        account number{" "}
        <PreviewValue value={d.account_number} {...buildAddButtonProps("account_number", "Account number", isAddable, addAndClose)} />.
      </p>
    </PodPreviewSection>
  );
}
