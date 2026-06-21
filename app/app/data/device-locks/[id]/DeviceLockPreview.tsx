// Live preview of device lock data in natural-language paragraph.
// Owns: preview rendering for password, pin, and note. Does NOT own form or save logic.
"use client";
import { DEVICE_LOCK } from "@/types/pods/DEVICE_LOCK";
import PodPreviewSection, { PreviewValue } from "@/components/pods/PodPreview";
import { MetamodelData } from "@/common/useMetamodelData";

interface Props {
  d: DEVICE_LOCK;
  metamodel: MetamodelData | null;
  addAndClose: (key: string) => void;
  isSkippable: (key: string) => boolean;
}

export default function DeviceLockPreview({ d, metamodel, addAndClose, isSkippable }: Props) {
  const canAdd = (key: string) => !isSkippable(key);
  return (
    <PodPreviewSection>
      <p>
        I have a {metamodel?.name || "device"} with password{" "}
        <PreviewValue value={d.password} sensitive addLabel="Password" onAdd={() => addAndClose("password")} />{d.pin ? "," : "."}
        {d.pin && (
          <> and pin <PreviewValue value={d.pin} sensitive />.</>
        )}
      </p>
      {(d.note || !isSkippable("note")) && (
        <p>
          For context, <PreviewValue value={d.note} addLabel={canAdd("note") ? "Note" : undefined} onAdd={canAdd("note") ? () => addAndClose("note") : undefined} />.
        </p>
      )}
    </PodPreviewSection>
  );
}
