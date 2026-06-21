// Live preview of device lock data in natural-language paragraph.
// Owns: preview rendering for password, pin, and note. Does NOT own form or save logic.
"use client";
import { DEVICE_LOCK } from "@/types/pods/DEVICE_LOCK";
import type { PreviewProps } from "@/types/interfaces";
import PodPreviewSection, { PreviewValue, MetamodelName } from "@/components/pods/PodPreview";

interface Props extends PreviewProps {
  d: DEVICE_LOCK;
}

export default function DeviceLockPreview({ d, metamodel, addAndClose, isSkippable, isAddable }: Props) {
  return (
    <PodPreviewSection>
      <p>
        I have a <MetamodelName name={metamodel?.name} fallback="device" /> with password{" "}
        <PreviewValue value={d.password} sensitive addLabel={isAddable("password") ? "Password" : undefined} onAdd={isAddable("password") ? () => addAndClose("password") : undefined} />{d.pin ? "," : "."}
        {d.pin && (
          <> and pin <PreviewValue value={d.pin} sensitive />.</>
        )}
      </p>
      {(d.note || !isSkippable("note")) && (
        <p>
          For context, <PreviewValue value={d.note} addLabel={isAddable("note") ? "Note" : undefined} onAdd={isAddable("note") ? () => addAndClose("note") : undefined} />.
        </p>
      )}
    </PodPreviewSection>
  );
}
