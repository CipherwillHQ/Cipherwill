// Seed phrase pod form: phrase words (custom section), public key, note with live preview.
// Owns: field config, custom section (phrase), save logic, orchestration. Does NOT own preview rendering.
"use client";
import toast from "react-hot-toast";
import { SEED_PHRASE_TYPE } from "@/types/pods/SEED_PHRASE";
import { usePodForm } from "@/components/common/pod-form/usePodForm";
import type { PodFieldConfig, PodCustomSectionDef } from "@/types/interfaces";
import PodForm from "@/components/common/pod-form/PodForm";
import SaveButton from "@/components/common/pod-form/SaveButton";
import TagListField from "@/components/common/pod-form/TagListField";
import PodFormLayout from "@/components/pods/PodFormLayout";
import PodFormSkeleton from "@/components/pods/PodFormSkeleton";
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
    data, updateField, loading, error, isUpdating, handleSave,
    previewOpen, setPreviewOpen, isDirty,
    metamodel, vis, onChange, markAdded, markRemoved, addGroup, removeGroup,
    isSkippable, isAddable,
    addAndClose,
  } = usePodForm<SEED_PHRASE_TYPE>(SEED_PHRASE_SAMPLE, {
    podType: "seed_phrase", version: "0.0.1", refId: id,
    fields: SEED_PHRASE_FIELDS, customSections: SEED_PHRASE_CUSTOM_SECTIONS,
  });

  function handleRemoveCustomSection(key: string) {
    if (key === "phrase") updateField("phrase", undefined);
  }

  function renderCustomSection(key: string) {
    if (key === "phrase") {
      return (
        <>
          <TagListField
            id="seed-phrase-input"
            label="Seed Phrase"
            placeholder="Enter seed phrase (space separated)"
            values={data.phrase || []}
            splitBy=" "
            emptyMessage="No phrases"
            indexedList
            onChange={(phrase) => updateField("phrase", phrase)}
          />
          {data.phrase && data.phrase.length > 0 && (
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                className="text-sm text-neutral-500 hover:text-error"
                onClick={() => updateField("phrase", [])}
              >
                Remove all words
              </button>
              <button
                type="button"
                className="text-sm text-neutral-500 hover:text-primary"
                onClick={() => { navigator.clipboard.writeText((data.phrase ?? []).join(" ")); toast.success("Seed phrase copied to clipboard"); }}
              >
                Copy Seed Phrase
              </button>
            </div>
          )}
        </>
      );
    }
    return null;
  }

  if (loading) return <PodFormSkeleton />;
  if (error) return <div>Error: {error}</div>;

  return (
    <PodFormLayout
      preview={<SeedPhrasePreview d={data} metamodel={metamodel} isSkippable={isSkippable} isAddable={isAddable} addAndClose={addAndClose} />}
      previewOpen={previewOpen}
      onTogglePreview={() => setPreviewOpen(!previewOpen)}
      isDirty={isDirty}
      saveButton={<SaveButton isDirty={isDirty} isUpdating={isUpdating} onClick={handleSave} />}
    >
      <PodForm
        data={data}
        onChange={onChange}
        vis={vis}
        markAdded={markAdded}
        markRemoved={markRemoved}
        addGroup={addGroup}
        removeGroup={removeGroup}
        renderCustomSection={renderCustomSection}
        onRemoveCustomSection={handleRemoveCustomSection}
      />
    </PodFormLayout>
  );
}
