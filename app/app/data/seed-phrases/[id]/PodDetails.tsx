// Seed phrase pod form: phrase words (custom section), public key, note with live preview.
// Owns: field config, custom section (phrase), save logic, preview. Does NOT own form chrome.
"use client";
import { useState, useRef } from "react";
import { usePod } from "@/contexts/PodHelper";
import { SEED_PHRASE_TYPE } from "@/types/pods/SEED_PHRASE";
import { TbTrash } from "react-icons/tb";
import SimpleButton from "@/components/common/SimpleButton";
import toast from "react-hot-toast";
import PodForm, { PodFieldConfig, PodCustomSectionDef, PodFormHandle } from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";
import PodFormLayout from "@/components/pods/PodFormLayout";
import PodPreviewSection, { PreviewValue } from "@/components/pods/PodPreview";
import { useMetamodelData } from "@/common/useMetamodelData";

const SEED_PHRASE_SAMPLE: SEED_PHRASE_TYPE = {
  phrase: ["phrase1", "phrase2", "phrase3"],
  public_key: "public_key",
  note: "Sample Note",
};

const SEED_PHRASE_FIELDS: PodFieldConfig[] = [
  { key: "public_key", label: "Public Key", placeholder: "e.g. 0x1234...", visibility: "optional" },
  { key: "note", label: "Note", type: "textarea", placeholder: "e.g. Sample Note", visibility: "skippable" },
];

const SEED_PHRASE_CUSTOM_SECTIONS: PodCustomSectionDef[] = [
  { key: "phrase", label: "Seed Phrase", dataKey: "phrase", visibility: "mandatory" },
];

export default function PodDetails({ id }) {
  const [data, setData] = useState<SEED_PHRASE_TYPE>({});
  const [initialData, setInitialData] = useState<SEED_PHRASE_TYPE | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const podFormRef = useRef<PodFormHandle>(null);
  const metamodel = useMetamodelData(id);
  const { loading, error, savePod, is_updating } = usePod<SEED_PHRASE_TYPE>(
    {
      TYPE: "seed_phrase",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: SEED_PHRASE_SAMPLE,
    },
    {
      onComplete: (data: null | SEED_PHRASE_TYPE) => {
        if (data) {
          setData(data);
          setInitialData(data);
        }
      },
    }
  );

  function handleRemoveCustomSection(key: string) {
    if (key === "phrase") {
      setData((prev) => ({ ...prev, phrase: undefined }));
    }
  }

  function renderCustomSection(key: string) {
    if (key === "phrase") {
      return (
        <>
          <div className="font-semibold">Seed Phrase</div>
          <div className="flex items-center gap-2">
            <input
              id="seed-phrase-input"
              className="bg-secondary border border-default rounded-xl p-2 w-full"
              type="text"
              placeholder="Enter seed phrase (space separated)"
            />
            <button
              className="bg-secondary border border-default rounded-xl p-2"
              onClick={() => {
                let newCodes = (
                  document.getElementById("seed-phrase-input") as HTMLInputElement
                )?.value.split(" ");
                newCodes = newCodes.map((code) => code.trim());
                newCodes = newCodes.filter((code) => code !== "");

                setData((prev) => ({
                  ...prev,
                  phrase: [...(prev.phrase || []), ...newCodes],
                }));
                (document.getElementById("seed-phrase-input") as HTMLInputElement).value = "";
              }}
            >
              Add
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(data.phrase === undefined || data.phrase?.length === 0) && (
              <div className="text-sm font-semibold text-neutral-500">
                No phrases
              </div>
            )}
            {data.phrase?.map((phrase_word, index) => (
              <div
                key={index}
                className="flex items-center gap-2 border border-default rounded-xl p-2"
              >
                <div>
                  {index + 1}:{" "}{phrase_word}
                </div>
                <button
                  onClick={() => {
                    setData((prev) => ({
                      ...prev,
                      phrase: (prev.phrase || []).filter(
                        (_, i) => i !== index
                      ),
                    }));
                  }}
                >
                  <TbTrash />
                </button>
              </div>
            ))}
          </div>
          {data.phrase && data.phrase.length > 0 && (
            <div className="flex gap-2">
              <SimpleButton
                onClick={() => {
                  setData((prev) => ({ ...prev, phrase: [] }));
                }}
              >
                Remove all words
              </SimpleButton>
              <SimpleButton
                onClick={() => {
                  navigator.clipboard.writeText((data.phrase ?? []).join(" "));
                  toast.success("Seed phrase copied to clipboard");
                }}
              >
                Copy Seed Phrase
              </SimpleButton>
            </div>
          )}
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
    SEED_PHRASE_FIELDS.find((f) => f.key === key)?.visibility === "skippable";

  function renderPreview(d: SEED_PHRASE_TYPE) {
    const canAdd = (key: string) => !isSkippable(key);
    return (
      <PodPreviewSection>
        <p>
          I have a {metamodel?.name || "seed phrase"}:{" "}
          <PreviewValue
            value={d.phrase?.join(", ")}
            sensitive
          />
          .
        </p>
        {(d.public_key || !isSkippable("public_key")) && (
          <p>
            My public key is{" "}
            <PreviewValue value={d.public_key} addLabel={canAdd("public_key") ? "Public Key" : undefined} onAdd={canAdd("public_key") ? () => addAndClose("public_key") : undefined} />.
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
        fields={SEED_PHRASE_FIELDS}
        data={data}
        onChange={(key, value) => {
          setData((prev) => ({ ...prev, [key]: value }));
        }}
        customSections={SEED_PHRASE_CUSTOM_SECTIONS}
        renderCustomSection={renderCustomSection}
        onRemoveCustomSection={handleRemoveCustomSection}
      />
    </PodFormLayout>
  );
}
