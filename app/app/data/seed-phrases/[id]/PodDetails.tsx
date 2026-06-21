"use client";
import { useState, useCallback, useRef } from "react";
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
  { key: "public_key", label: "Public Key", placeholder: "e.g. 0x1234...", mandatory: true },
  { key: "note", label: "Note", type: "textarea", placeholder: "e.g. Sample Note", mandatory: false },
];

const SEED_PHRASE_CUSTOM_SECTIONS: PodCustomSectionDef[] = [
  { key: "phrase", label: "Seed Phrase", dataKey: "phrase", mandatory: true },
];

export default function PodDetails({ id }) {
  const [data, setData] = useState<SEED_PHRASE_TYPE>({});
  const [initialData, setInitialData] = useState<SEED_PHRASE_TYPE>({} as SEED_PHRASE_TYPE);
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

  const handleRemoveCustomSection = useCallback((key: string) => {
    if (key === "phrase") {
      setData((prev) => ({ ...prev, phrase: undefined }));
    }
  }, []);

  const renderCustomSection = useCallback(
    (key: string) => {
      if (key === "phrase") {
        return (
          <>
            <div className="font-semibold">Seed Phrase</div>
            <div className="flex items-center gap-2">
              <input
                id="seed-phrase-input"
                className="bg-secondary border border-default rounded-md p-2 w-full"
                type="text"
                placeholder="Enter seed phrase (space separated)"
              />
              <button
                className="bg-secondary border border-default rounded-md p-2"
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
                  (
                    document.getElementById("seed-phrase-input") as HTMLInputElement
                  ).value = "";
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
                  className="flex items-center gap-2 border border-default rounded-md p-2 "
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
            {data && data.phrase && data.phrase.length > 0 && (
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
    },
    [data]
  );

  const isDirty = JSON.stringify(initialData) !== JSON.stringify(data);

  const handleSave = useCallback(async () => {
    try {
      await savePod({
        phrase: data.phrase,
        public_key: data.public_key,
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

  function renderPreview(d: SEED_PHRASE_TYPE) {
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
        <p>
          My public key is{" "}
          <PreviewValue value={d.public_key} addLabel="Public Key" onAdd={() => addAndClose("public_key")} />.
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
