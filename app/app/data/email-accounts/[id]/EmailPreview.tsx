// Live preview of email account data in natural-language paragraphs.
// Owns: preview rendering for email, recovery info, security info, backup codes, aliases, note.
"use client";
import { EMAIL_ACCOUNT_TYPE } from "@/types/pods/EMAIL_ACCOUNT";
import type { PreviewProps } from "@/types/interfaces";
import PodPreviewSection, { PreviewValue } from "@/components/pods/PodPreview";

interface Props extends PreviewProps {
  d: EMAIL_ACCOUNT_TYPE;
}

export default function EmailPreview({
  d, metamodel, addAndClose, addGroupAndClose, isSkippable, isGroupSkippable,
}: Props) {
  const canAdd = (key: string) => !isSkippable(key);
  const recoverySkippable = isGroupSkippable?.("recovery") ?? true;
  const securitySkippable = isGroupSkippable?.("security") ?? true;
  const hasRecovery = !!(d.recoveryEmail || d.recoveryPhone);
  const hasSecurity = !!d.securityQuestion;

  return (
    <PodPreviewSection>
      <p>
        {isSkippable("email") && !d.email ? (
          <>I have an email account {metamodel?.name || "..."}</>
        ) : (
          <>I have an email account{" "}
          <PreviewValue value={d.email} addLabel={canAdd("email") ? "Email" : undefined} onAdd={canAdd("email") ? () => addAndClose("email") : undefined} /></>
        )}, with the provider{" "}
        <PreviewValue value={d.provider} fallback="a provider" addLabel={canAdd("provider") ? "Provider" : undefined} onAdd={canAdd("provider") ? () => addAndClose("provider") : undefined} />,
        and the password is{" "}
        <PreviewValue value={d.password} sensitive />.
      </p>
      {!hasRecovery && !recoverySkippable ? (
        <p>
          I have recovery details set up{" "}
          <PreviewValue value="" addLabel="Recovery Info" onAdd={() => addGroupAndClose("recovery")} />.
        </p>
      ) : hasRecovery ? (
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
      ) : null}
      {!hasSecurity && !securitySkippable ? (
        <p>
          I have security questions set up{" "}
          <PreviewValue value="" addLabel="Security Info" onAdd={() => addGroupAndClose("security")} />.
        </p>
      ) : hasSecurity ? (
        <p>
          For security, my question is{" "}
          &ldquo;<PreviewValue value={d.securityQuestion} />&rdquo;{" "}
          and the answer is{" "}
          <PreviewValue value={d.securityAnswer} sensitive />.
        </p>
      ) : null}
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
            {d.aliasEmails.map((email: string, i: number) => (
              <li key={i} className="font-semibold text-forest dark:text-cream">
                {email}
              </li>
            ))}
          </ul>
        </>
      )}
      {(d.note || !isSkippable("note")) && (
        <p>
          For context, <PreviewValue value={d.note} addLabel={canAdd("note") ? "Note" : undefined} onAdd={canAdd("note") ? () => addAndClose("note") : undefined} />.
        </p>
      )}
    </PodPreviewSection>
  );
}
