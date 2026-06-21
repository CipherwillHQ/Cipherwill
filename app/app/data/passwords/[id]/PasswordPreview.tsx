// Live preview of password data in natural-language paragraphs.
// Owns: preview rendering for username, password, 2FA, websites, and note.
"use client";
import { PASSWORD } from "@/types/pods/PASSWORD";
import type { PreviewProps } from "@/types/interfaces";
import PodPreviewSection, { PreviewValue, MetamodelName, NotePreview, buildAddButtonProps } from "@/components/pods/PodPreview";

interface Props extends PreviewProps {
  d: PASSWORD;
}

export default function PasswordPreview({
  d, metamodel, addAndClose, isSkippable, isAddable,
}: Props) {
  return (
    <PodPreviewSection>
      <p>
        I have a login for <MetamodelName name={metamodel?.name} fallback="this account" />, with the username{" "}
        <PreviewValue value={d.username} {...buildAddButtonProps("username", "Username", isAddable, addAndClose)} />,
        and the password is{" "}
        <PreviewValue value={d.password} sensitive {...buildAddButtonProps("password", "Password", isAddable, addAndClose)} />.
      </p>
      {d.totp_secret && (
        <p>
          I use 2FA with the secret <PreviewValue value={d.totp_secret} sensitive />.
        </p>
      )}
      {d.uri && d.uri.length > 0 ? (
        <>
          <p>This login is used on these websites:</p>
          <ul className="list-disc list-inside pl-2 space-y-0.5">
            {d.uri.map((url: string) => (
              <li key={url} className="font-semibold text-forest dark:text-cream">
                {url}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>
          This login is used on{" "}
          <PreviewValue value="" {...buildAddButtonProps("uri", "Websites", isAddable, addAndClose)} />.
        </p>
      )}
      <NotePreview value={d.note} skippable={isSkippable("note")} addable={isAddable("note")} addAndClose={addAndClose} />
    </PodPreviewSection>
  );
}
