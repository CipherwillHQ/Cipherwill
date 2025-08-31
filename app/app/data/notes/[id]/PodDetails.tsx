"use client";
import logger from "@/common/debug/logger";
import { NOTE_TYPE } from "../../../../../types/pods/NOTE";
import { usePod } from "@/contexts/PodHelper";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import Placeholder from '@tiptap/extension-placeholder';

const NOTE_SAMPLE: NOTE_TYPE = {
  content: "Sample Note",
};
let debounceTimer: NodeJS.Timeout;

export default function PodDetails({
  id,
  setSaveStatus,
}: {
  id: string;
  setSaveStatus: (status: "SAVED" | "NOT_SAVED" | "ERROR" | "LOADING") => void;
}) {
  const [initialValue, setinitialValue] = useState<string|null>(null);
  const [newValue, setNewValue] = useState<string|null>(null);

  const { loading, error, updatePod, is_updating, loadPod } = usePod<NOTE_TYPE>(
    {
      TYPE: "note",
      VERSION: "0.0.2",
      REF_ID: id,
      DATA_SAMPLE: NOTE_SAMPLE,
    },
    {
      lazy: true,
    }
  );
  const editor = useEditor({
    immediatelyRender: false, // Prevent immediate rendering to avoid hydration mismatches
    extensions: [StarterKit,
      Placeholder.configure({
        placeholder:'Write something...'
      })
    ],
    content: "",
    onCreate: async ({ editor }) => {
      const data = await loadPod();
      editor.commands.setContent(data?.content || "");
      setinitialValue(data?.content || "");
      setNewValue(data?.content || "");
    },
    onUpdate: ({ editor }) => {
      setNewValue(editor.getHTML());
    },
  });

  useEffect(() => {
    if (error) setSaveStatus("ERROR");
    setSaveStatus(is_updating ? "LOADING" : "SAVED");
  }, [is_updating, error]);

  useEffect(() => {
    // debounce save
    if (newValue !== initialValue) {
      setSaveStatus("NOT_SAVED");
    } else {
      setSaveStatus("SAVED");
      return;
    }
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      if (!editor) return;
      const updateData = editor.getHTML();
      updatePod({
        content: updateData,
      })
        .then((res) => {
          setinitialValue(updateData);
          setSaveStatus("SAVED");
        })
        .catch((err) => {
          setSaveStatus("ERROR");
          logger.error(err);
        });
    }, 3000);
  }, [newValue]);

  if (loading)
    return (
      <div className="bg-neutral-300 dark:bg-neutral-800 p-2 rounded-md my-2 h-screen animate-pulse" />
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-2">
      <style>{`
        .ProseMirror:focus {
          outline: none;
        }
      `}</style>
      <EditorContent
        editor={editor}
        className="bg-slate-200 dark:bg-neutral-800 p-2 w-full min-h-screen"
      />
      {/* {initialValue !== newValue && (
        <button
          className="flex items-center justify-center bg-black text-white font-bold py-2 px-4 rounded-sm"
          onClick={() => {
            const updateData = editor.getHTML();
            updatePod({
              content: updateData,
            }).then((res) => {
              toast.success("Saved");
              setinitialValue(updateData);
            });
          }}
        >
          {is_updating && (
            <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-white mr-2" />
          )}
          Save
        </button>
      )} */}
    </div>
  );
}
