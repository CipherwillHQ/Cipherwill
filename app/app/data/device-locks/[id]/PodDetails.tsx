// Device lock pod form: password + optional pin and note with live preview.
// Owns: field config, save logic, preview rendering. Does NOT own form chrome or field rendering.
"use client";
import { useState, useRef } from "react";
import { usePod } from "@/contexts/PodHelper";
import { DEVICE_LOCK } from "@/types/pods/DEVICE_LOCK";
import PodForm, { PodFieldConfig, PodFormHandle } from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";
import PodFormLayout from "@/components/pods/PodFormLayout";
import PodPreviewSection, { PreviewValue } from "@/components/pods/PodPreview";
import { useMetamodelData } from "@/common/useMetamodelData";
import toast from "react-hot-toast";

const DEVICE_LOCK_SAMPLE: DEVICE_LOCK = {
  password: "123456",
  pin: "123456",
  note: "Sample Note",
};

const DEVICE_LOCK_FIELDS: PodFieldConfig[] = [
  { key: "password", label: "Password", placeholder: "e.g. 123456", visibility: "mandatory" },
  { key: "pin", label: "Pin", placeholder: "e.g. 123456", visibility: "skippable" },
  { key: "note", label: "Note", type: "textarea", placeholder: "e.g. Sample Note", visibility: "skippable" },
];

export default function PodDetails({ id }) {
  const [data, setData] = useState<DEVICE_LOCK>({});
  const [initialData, setInitialData] = useState<DEVICE_LOCK | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const podFormRef = useRef<PodFormHandle>(null);
  const metamodel = useMetamodelData(id);
  const { loading, error, savePod, is_updating } = usePod<DEVICE_LOCK>(
    {
      TYPE: "device_lock",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: DEVICE_LOCK_SAMPLE,
    },
    {
      onComplete: (data: null | DEVICE_LOCK) => {
        if (data) {
          setData(data);
          setInitialData(data);
        }
      },
    }
  );

  const isDirty = initialData !== null && JSON.stringify(initialData) !== JSON.stringify(data);

  async function handleSave() {
    try {
      await savePod(data, { metamodel_id: id });
      setInitialData(JSON.parse(JSON.stringify(data)));
    } catch {
      toast.error("Failed to save changes. Please try again.");
    }
  }

  function addAndClose(key: string) {
    podFormRef.current?.addField(key);
    setPreviewOpen(false);
  }

  const isSkippable = (key: string) =>
    DEVICE_LOCK_FIELDS.find((f) => f.key === key)?.visibility === "skippable";

  function renderPreview(d: DEVICE_LOCK) {
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <PodFormLayout
      preview={renderPreview(data)}
      previewOpen={previewOpen}
      onTogglePreview={() => setPreviewOpen(!previewOpen)}
      isDirty={isDirty}
      saveButton={<SaveButton isDirty={isDirty} isUpdating={is_updating} onClick={handleSave} />}
    >
      <PodForm
        ref={podFormRef}
        fields={DEVICE_LOCK_FIELDS}
        data={data}
        onChange={(key, value) => {
          setData((prev) => ({ ...prev, [key]: value }));
        }}
      />
    </PodFormLayout>
  );
}
