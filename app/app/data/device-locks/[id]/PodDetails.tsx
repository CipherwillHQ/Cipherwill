"use client";
import { useState, useCallback, useRef } from "react";
import { usePod } from "@/contexts/PodHelper";
import { DEVICE_LOCK } from "@/types/pods/DEVICE_LOCK";
import PodForm, { PodFieldConfig, PodFormHandle } from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";
import PodFormLayout from "@/components/pods/PodFormLayout";
import PodPreviewSection, { PreviewValue } from "@/components/pods/PodPreview";
import { useMetamodelData } from "@/common/useMetamodelData";

const DEVICE_LOCK_SAMPLE: DEVICE_LOCK = {
  password: "123456",
  pin: "123456",
  note: "Sample Note",
};

const DEVICE_LOCK_FIELDS: PodFieldConfig[] = [
  { key: "password", label: "Password", placeholder: "e.g. 123456", mandatory: true },
  { key: "pin", label: "Pin", placeholder: "e.g. 123456", mandatory: false },
  { key: "note", label: "Note", type: "textarea", placeholder: "e.g. Sample Note", mandatory: false },
];

export default function PodDetails({ id }) {
  const [data, setData] = useState<DEVICE_LOCK>({});
  const [initialData, setInitialData] = useState<DEVICE_LOCK>({} as DEVICE_LOCK);
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

  const isDirty = JSON.stringify(initialData) !== JSON.stringify(data);

  const handleSave = useCallback(async () => {
    try {
      await savePod({
        password: data.password,
        pin: data.pin,
        note: data.note,
      },{
        metamodel_id: id,
      });
      setInitialData(JSON.parse(JSON.stringify(data)));
    } catch (_) {
    }
  }, [data, savePod, id]);

  const addAndClose = (key: string) => {
    podFormRef.current?.addField(key);
    setPreviewOpen(false);
  };

  function renderPreview(d: DEVICE_LOCK) {
    return (
      <PodPreviewSection>
        <p>
          I have a {metamodel?.name || "device"} with password{" "}
          <PreviewValue value={d.password} sensitive addLabel="Password" onAdd={() => addAndClose("password")} />{" "}
          and pin{" "}
          <PreviewValue value={d.pin} sensitive addLabel="Pin" onAdd={() => addAndClose("pin")} />.
        </p>
        <p>
          For context, <PreviewValue value={d.note} addLabel="Note" onAdd={() => addAndClose("note")} />.
        </p>
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
