// Live preview of password data in natural-language paragraphs.
// Owns: preview rendering for username, password, 2FA, websites, and note.
"use client";
import { PASSWORD } from "@/types/pods/PASSWORD";
import PodPreviewSection, { PreviewValue } from "@/components/pods/PodPreview";
import { PodFormHandle } from "@/components/common/PodForm";
import { MetamodelData } from "@/common/useMetamodelData";

interface Props {
  d: PASSWORD;
  metamodel: MetamodelData | null;
  podFormRef: React.RefObject<PodFormHandle | null>;
  setPreviewOpen: (v: boolean) => void;
  addAndClose: (key: string) => void;
  isSkippable: (key: string) => boolean;
}

export default function PasswordPreview({
  d, metamodel, podFormRef, setPreviewOpen, addAndClose, isSkippable,
}: Props) {
  const canAdd = (key: string) => !isSkippable(key);
  return (
    <PodPreviewSection>
      <p>
        I have a login for {metamodel?.name || "this account"}, with the username{" "}
        <PreviewValue value={d.username} addLabel="Username" onAdd={() => addAndClose("username")} />,
        and the password is{" "}
        <PreviewValue value={d.password} sensitive addLabel="Password" onAdd={() => addAndClose("password")} />.
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
            {d.uri.map((url, i) => (
              <li key={i} className="font-semibold text-forest dark:text-cream">
                {url}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>
          This login is used on{" "}
          <PreviewValue value="" addLabel="Websites" onAdd={() => { podFormRef.current?.addSection("uri"); setPreviewOpen(false); }} />.
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
