// Password pod form: username, password, 2FA, websites, note with live preview.
// Owns: field config, custom section (websites), save logic, orchestration. Does NOT own preview rendering.
"use client";
import { useState, useRef } from "react";
import { usePod } from "@/contexts/PodHelper";
import { TbTrash } from "react-icons/tb";
import { PASSWORD } from "@/types/pods/PASSWORD";
import PodForm, { PodFieldConfig, PodCustomSectionDef, PodFormHandle } from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";
import PodFormLayout from "@/components/pods/PodFormLayout";
import { useMetamodelData } from "@/common/useMetamodelData";
import PasswordPreview from "./PasswordPreview";
import toast from "react-hot-toast";

const PASSWORD_SAMPLE: PASSWORD = {
  username: "john@example.com",
  password: "password",
  totp_secret: "123456",
  uri: ["https://example.com"],
  note: "Sample Note",
};

const PASSWORD_FIELDS: PodFieldConfig[] = [
  { key: "username", label: "Username", placeholder: "e.g. john@example.com", visibility: "mandatory" },
  { key: "password", label: "Password", type: "password", placeholder: "e.g. your password", visibility: "mandatory" },
  { key: "totp_secret", label: "2FA Secret", placeholder: "e.g. 123456", visibility: "skippable" },
  { key: "note", label: "Note", type: "textarea", placeholder: "e.g. Sample Note", visibility: "skippable" },
];

const PASSWORD_CUSTOM_SECTIONS: PodCustomSectionDef[] = [
  { key: "uri", label: "Websites", dataKey: "uri", visibility: "optional" },
];

export default function PodDetails({ id }) {
  const [data, setData] = useState<PASSWORD>({});
  const [initialData, setInitialData] = useState<PASSWORD | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const podFormRef = useRef<PodFormHandle>(null);
  const metamodel = useMetamodelData(id);
  const { loading, error, savePod, is_updating } = usePod<PASSWORD>(
    {
      TYPE: "password",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: PASSWORD_SAMPLE,
    },
    {
      onComplete: (data: null | PASSWORD) => {
        if (data) {
          setData(data);
          setInitialData(data);
        }
      },
    }
  );

  function handleRemoveCustomSection(key: string) {
    if (key === "uri") {
      setData((prev) => ({ ...prev, uri: undefined }));
    }
  }

  function renderCustomSection(key: string) {
    if (key === "uri") {
      return (
        <>
          <div className="font-semibold">Websites</div>
          <div className="flex items-center gap-2">
            <input
              id="password-uri"
              className="bg-secondary border border-default rounded-xl p-2 w-full"
              type="text"
              placeholder="Website (e.g., https://example.com)"
            />
            <button
              className="bg-secondary border border-default rounded-xl p-2"
              onClick={() => {
                let newUri = (
                  document.getElementById("password-uri") as HTMLInputElement
                )?.value;
                newUri = newUri.trim();
                if (newUri.length <= 0) return;

                setData((prev) => ({
                  ...prev,
                  uri: Array.from(new Set([...(prev.uri || []), newUri])),
                }));
                (document.getElementById("password-uri") as HTMLInputElement).value = "";
              }}
            >
              Add
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(data.uri === undefined || data.uri?.length === 0) && (
              <div className="text-sm font-semibold text-neutral-500">No Websites</div>
            )}
            {data.uri?.map((uri, index) => (
              <div
                key={index}
                className="flex items-center gap-2 border border-default rounded-xl p-2"
              >
                <div>{uri}</div>
                <button
                  onClick={() => {
                    setData((prev) => ({
                      ...prev,
                      uri: (prev.uri || []).filter((code) => code !== uri),
                    }));
                  }}
                >
                  <TbTrash />
                </button>
              </div>
            ))}
          </div>
        </>
      );
    }
    return null;
  }

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
    PASSWORD_FIELDS.find((f) => f.key === key)?.visibility === "skippable";

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <PodFormLayout
      preview={
        <PasswordPreview
          d={data}
          metamodel={metamodel}
          podFormRef={podFormRef}
          setPreviewOpen={setPreviewOpen}
          addAndClose={addAndClose}
          isSkippable={isSkippable}
        />
      }
      previewOpen={previewOpen}
      onTogglePreview={() => setPreviewOpen(!previewOpen)}
      isDirty={isDirty}
      saveButton={<SaveButton isDirty={isDirty} isUpdating={is_updating} onClick={handleSave} />}
    >
      <PodForm
        ref={podFormRef}
        fields={PASSWORD_FIELDS}
        data={data}
        onChange={(key, value) => {
          setData((prev) => ({ ...prev, [key]: value }));
        }}
        customSections={PASSWORD_CUSTOM_SECTIONS}
        renderCustomSection={renderCustomSection}
        onRemoveCustomSection={handleRemoveCustomSection}
      />
    </PodFormLayout>
  );
}
