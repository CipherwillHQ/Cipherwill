// Live preview of email account data in natural-language paragraphs.
// Owns: preview rendering for email, recovery info, security info, backup codes, aliases, note.
"use client";
import { EMAIL_ACCOUNT_TYPE } from "@/types/pods/EMAIL_ACCOUNT";
import type { PreviewProps } from "@/types/interfaces";
import PodPreviewSection, { PreviewValue, MetamodelName, NotePreview, buildAddButtonProps } from "@/components/pods/PodPreview";

interface Props extends PreviewProps {
  d: EMAIL_ACCOUNT_TYPE;
}

export default function EmailPreview({
  d, metamodel, addAndClose, isSkippable, isAddable,
}: Props) {
  const hasRecovery = !!(d.recoveryEmail || d.recoveryPhone);
  const hasSecurity = !!d.securityQuestion;

  return (
    <PodPreviewSection>
      <p>
        I have an email account <MetamodelName name={metamodel?.name} fallback="this account" />, with the email{" "}
        <PreviewValue value={d.email} {...buildAddButtonProps("email", "Email", isAddable, addAndClose)} />, from{" "}
        <PreviewValue value={d.provider} fallback="a provider" {...buildAddButtonProps("provider", "Provider", isAddable, addAndClose)} />,
        and the password is{" "}
        <PreviewValue value={d.password} sensitive {...buildAddButtonProps("password", "Password", isAddable, addAndClose)} />.
      </p>
      {hasRecovery && (
        <>
          {d.recoveryEmail && (
            <p>
              I have a recovery email set up at{" "}
              <PreviewValue value={d.recoveryEmail} />.
            </p>
          )}
          {d.recoveryPhone && (
            <p>
              My recovery phone number is{" "}
              <PreviewValue value={d.recoveryPhone} />.
            </p>
          )}
        </>
      )}
      {hasSecurity && (
        <p>
          For security, my question is{" "}
          &ldquo;<PreviewValue value={d.securityQuestion} />&rdquo;{" "}
          and the answer is{" "}
          <PreviewValue value={d.securityAnswer} sensitive />.
        </p>
      )}
      {d.backupCodes && d.backupCodes.length > 0 && (
        <p>
          I have these backup codes saved:{" "}
          <span className="font-semibold text-forest dark:text-cream">
            {d.backupCodes.join(", ")}
          </span>
          .
        </p>
      )}
      {d.aliasEmails && d.aliasEmails.length > 0 && (
        <>
          <p>This account also has these email aliases:</p>
          <ul className="list-disc list-inside pl-2 space-y-0.5">
            {d.aliasEmails.map((email: string) => (
              <li key={email} className="font-semibold text-forest dark:text-cream">
                {email}
              </li>
            ))}
          </ul>
        </>
      )}
      <NotePreview value={d.note} skippable={isSkippable("note")} addable={isAddable("note")} addAndClose={addAndClose} />
    </PodPreviewSection>
  );
}
