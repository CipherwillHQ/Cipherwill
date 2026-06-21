// Live preview of device lock data in natural-language paragraph.
// Owns: preview rendering for password, pin, and note. Does NOT own form or save logic.
"use client";
import { DEVICE_LOCK } from "@/types/pods/DEVICE_LOCK";
import type { PreviewProps } from "@/types/interfaces";
import PodPreviewSection, { PreviewValue, MetamodelName, NotePreview, buildAddButtonProps } from "@/components/pods/PodPreview";

interface Props extends PreviewProps {
  d: DEVICE_LOCK;
}

export default function DeviceLockPreview({ d, metamodel, addAndClose, isSkippable, isAddable }: Props) {
  return (
    <PodPreviewSection>
      <p>
        I have a <MetamodelName name={metamodel?.name} fallback="device" /> with password{" "}
        <PreviewValue value={d.password} sensitive {...buildAddButtonProps("password", "Password", isAddable, addAndClose)} />{d.pin ? "," : "."}
        {d.pin && (
          <> and pin <PreviewValue value={d.pin} sensitive />.</>
        )}
      </p>
      <NotePreview value={d.note} skippable={isSkippable("note")} addable={isAddable("note")} addAndClose={addAndClose} />
    </PodPreviewSection>
  );
}
