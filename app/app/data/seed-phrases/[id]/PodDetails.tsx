// Seed phrase pod form: phrase words (custom section), public key, note with live preview.
// Owns: field config, custom section (phrase), save logic, orchestration. Does NOT own preview rendering.
"use client";
import { TbTrash } from "react-icons/tb";
import SimpleButton from "@/components/common/SimpleButton";
import toast from "react-hot-toast";
import { SEED_PHRASE_TYPE } from "@/types/pods/SEED_PHRASE";
import { usePodForm } from "@/components/common/usePodForm";
import type { PodFieldConfig, PodCustomSectionDef } from "@/types/interfaces";
import PodForm from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";
import PodFormLayout from "@/components/pods/PodFormLayout";
import SeedPhrasePreview from "./SeedPhrasePreview";

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

export default function PodDetails({ id }: { id: string }) {
  const {
    data, setData, loading, error, isUpdating, handleSave,
    previewOpen, setPreviewOpen, isDirty, podFormRef,
    metamodel, isSkippable, addAndClose, addGroupAndClose, addSectionAndClose,
  } = usePodForm<SEED_PHRASE_TYPE>(SEED_PHRASE_SAMPLE, {
    podType: "seed_phrase", version: "0.0.1", refId: id, fields: SEED_PHRASE_FIELDS,
  });

  function handleRemoveCustomSection(key: string) {
    if (key === "phrase") setData((prev) => ({ ...prev, phrase: undefined }));
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
                const input = document.getElementById("seed-phrase-input") as HTMLInputElement;
                const newCodes = input?.value.split(" ").map((c) => c.trim()).filter((c) => c !== "") || [];
                setData((prev) => ({ ...prev, phrase: [...(prev.phrase || []), ...newCodes] }));
                input.value = "";
              }}
            >
              Add
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(!data.phrase || data.phrase.length === 0) && (
              <div className="text-sm font-semibold text-neutral-500">No phrases</div>
            )}
            {data.phrase?.map((phrase_word, index) => (
              <div key={index} className="flex items-center gap-2 border border-default rounded-xl p-2">
                <div>{index + 1}: {phrase_word}</div>
                <button onClick={() => setData((prev) => ({ ...prev, phrase: (prev.phrase || []).filter((_, i) => i !== index) }))}>
                  <TbTrash />
                </button>
              </div>
            ))}
          </div>
          {data.phrase && data.phrase.length > 0 && (
            <div className="flex gap-2">
              <SimpleButton onClick={() => setData((prev) => ({ ...prev, phrase: [] }))}>
                Remove all words
              </SimpleButton>
              <SimpleButton onClick={() => { navigator.clipboard.writeText((data.phrase ?? []).join(" ")); toast.success("Seed phrase copied to clipboard"); }}>
                Copy Seed Phrase
              </SimpleButton>
            </div>
          )}
        </>
      );
    }
    return null;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <PodFormLayout
      preview={<SeedPhrasePreview d={data} metamodel={metamodel} isSkippable={isSkippable} addAndClose={addAndClose} addGroupAndClose={addGroupAndClose} addSectionAndClose={addSectionAndClose} />}
      previewOpen={previewOpen}
      onTogglePreview={() => setPreviewOpen(!previewOpen)}
      isDirty={isDirty}
      saveButton={<SaveButton isDirty={isDirty} isUpdating={isUpdating} onClick={handleSave} />}
    >
      <PodForm
        ref={podFormRef}
        fields={SEED_PHRASE_FIELDS}
        data={data}
        onChange={(key, value) => setData((prev) => ({ ...prev, [key]: value }))}
        customSections={SEED_PHRASE_CUSTOM_SECTIONS}
        renderCustomSection={renderCustomSection}
        onRemoveCustomSection={handleRemoveCustomSection}
      />
    </PodFormLayout>
  );
}
