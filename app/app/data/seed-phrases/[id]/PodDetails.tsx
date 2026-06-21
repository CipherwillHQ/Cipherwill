// Seed Phrases PodDetails: form fields for seed phrase / recovery phrase data.
"use client";
import { useState } from "react";
import {
  SEED_PHRASE_TYPE,
  SEED_PHRASE_OPTIONAL,
} from "@/types/pods/SEED_PHRASE";
import { usePod } from "@/contexts/PodHelper";
import SaveButton from "@/components/app/data/SaveButton";
import SimpleButton from "@/components/common/SimpleButton";
import toast from "react-hot-toast";
import FormField from "@/components/app/data/FormField";
import ListField from "@/components/app/data/ListField";
import AddOptionalField from "@/components/app/data/AddOptionalField";
import { useOptionalFields } from "@/components/app/data/useOptionalFields";

const SAMPLE: SEED_PHRASE_TYPE = {
  phrase: ["phrase1", "phrase2", "phrase3"],
  public_key: "public_key",
  note: "Sample Note",
};

const OPTIONAL = SEED_PHRASE_OPTIONAL;

export default function PodDetails({ id }) {
  const [data, setData] = useState<SEED_PHRASE_TYPE>({});
  const [initialData, setInitialData] = useState<SEED_PHRASE_TYPE | null>(null);
  const { addField, removeField, visible, remaining } = useOptionalFields(
    OPTIONAL,
    data,
    setData
  );
  const { loading, error, savePod, is_updating } = usePod<SEED_PHRASE_TYPE>(
    {
      TYPE: "seed_phrase",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: SAMPLE,
    },
    {
      onComplete: (d: null | SEED_PHRASE_TYPE) => {
        if (d) setData(d);
        setInitialData(JSON.parse(JSON.stringify(d || {})));
      },
    }
  );
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4 px-4 w-full max-w-xl">
      <ListField
        label="Seed Phrase"
        items={data.phrase || []}
        onChange={(items) => setData({ ...data, phrase: items })}
        placeholder="Enter seed phrase (space separated)"
        emptyMessage="No phrases"
        separator=" "
        required
        formatItem={(item, index) => `${index + 1}: ${item}`}
      >
        {data.phrase && data.phrase.length > 0 && (
          <div className="flex gap-2 mt-1">
            <SimpleButton onClick={() => setData({ ...data, phrase: [] })}>
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
      </ListField>

      {visible.map((f) => (
        <FormField
          key={f.key}
          label={f.label}
          type={f.type as "text" | "email" | "textarea" | undefined}
          sensitive={f.sensitive}
          placeholder={f.placeholder}
          value={String(data[f.key] || "")}
          onChange={(v) => setData({ ...data, [f.key]: v })}
          onRemove={() => removeField(f.key)}
        />
      ))}

      <AddOptionalField fields={remaining} onAdd={addField} />

      <SaveButton
        data={data}
        initialData={initialData}
        isSaving={is_updating}
        onClick={async () => {
          await savePod(
            {
              phrase: data.phrase,
              public_key: data.public_key,
              note: data.note,
            },
            { metamodel_id: id }
          );
          setInitialData(JSON.parse(JSON.stringify(data)));
        }}
      />
    </div>
  );
}
