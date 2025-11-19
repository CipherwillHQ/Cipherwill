"use client";
import { useState } from "react";
import { usePod } from "@/contexts/PodHelper";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import { SEED_PHRASE_TYPE } from "@/types/pods/SEED_PHRASE";
import { TbTrash } from "react-icons/tb";
import SimpleButton from "@/components/common/SimpleButton";
import toast from "react-hot-toast";

const SEED_PHRASE_SAMPLE: SEED_PHRASE_TYPE = {
  phrase: ["phrase1", "phrase2", "phrase3"],
  public_key: "public_key",
  note: "Sample Note",
};

export default function PodDetails({ id }) {
  const [data, setData] = useState<SEED_PHRASE_TYPE>({});
  const { loading, error, updatePod, is_updating } = usePod<SEED_PHRASE_TYPE>(
    {
      TYPE: "seed_phrase",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: SEED_PHRASE_SAMPLE,
    },
    {
      onComplete: (data: null | SEED_PHRASE_TYPE) => {
        if (data) setData(data);
      },
    }
  );
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4 px-4 w-full max-w-md">
      {/* <pre>{JSON.stringify(data, null, 2)}</pre>
      <hr /> */}
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
            // remove spaces
            newCodes = newCodes.map((code) => code.trim());
            // remove empty strings
            newCodes = newCodes.filter((code) => code !== "");

            setData({
              ...data,
              phrase: [...(data.phrase || []), ...newCodes],
            });
            // clear the input
            (
              document.getElementById("seed-phrase-input") as HTMLInputElement
            ).value = "";
          }}
        >
          Add
        </button>
      </div>{" "}
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
                setData({
                  ...data,
                  phrase: (data.phrase || []).filter(
                    (_, i) => i !== index
                  ),
                });
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
              setData({
                ...data,
                phrase: [],
              });
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
      <input
        className="bg-secondary border border-default rounded-md p-2"
        type="text"
        placeholder="Public Key"
        value={data.public_key || ""}
        onChange={(e) => {
          setData({
            ...data,
            public_key: e.target.value,
          });
        }}
      />
      <textarea
        className="bg-secondary border border-default rounded-md p-2"
        placeholder="Note"
        value={data.note || ""}
        onChange={(e) => {
          setData({
            ...data,
            note: e.target.value,
          });
        }}
      />
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <button
          className="flex items-center justify-center gap-2 bg-black text-white font-bold py-2 px-4 rounded-sm w-full"
          onClick={() => {
            updatePod({
              phrase: data.phrase,
              public_key: data.public_key,
              note: data.note,
            });
          }}
        >
          {" "}
          {is_updating && <LoadingIndicator />}
          Save
        </button>
      </div>
    </div>
  );
}
