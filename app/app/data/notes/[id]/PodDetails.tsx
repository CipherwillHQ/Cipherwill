// Edits and autosaves notes in the web client.
// Owns pending saves and the native-background save handoff.
// Does not persist decrypted drafts in native storage.
"use client";
/**
 * app/app/data/notes/[id]/PodDetails.tsx
 * Redesigned Note editor interface with auto-save and full-bleed layout.
 * Removes all box styling, borders, and shadows to go full left-to-right and top-to-bottom.
 */
import logger from "@/common/debug/logger";
import { NOTE_TYPE } from "../../../../../types/pods/NOTE";
import { usePod } from "@/contexts/PodHelper";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useRef, useState } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import NoteEditorStyles from "./NoteEditorStyles";
import NoteLoading from "./NoteLoading";
import sanitizeHtml from "@/common/security/sanitizeHtml";
import { useMobileNoteBackgroundSave } from "@/common/mobile/useMobileNoteBackgroundSave";

const NOTE_SAMPLE: NOTE_TYPE = {
  content: "Sample Note",
};

export default function PodDetails({
  id,
  setSaveStatus,
}: {
  id: string;
  setSaveStatus: (status: "SAVED" | "NOT_SAVED" | "ERROR" | "LOADING") => void;
}) {
  const [initialValue, setinitialValue] = useState<string | null>(null);
  const [newValue, setNewValue] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);
  const pendingSaveRef = useRef<string | null>(null);

  // Refs to guarantee immediate save on unmount with the latest values
  const latestNewValueRef = useRef<string | null>(null);
  const latestInitialValueRef = useRef<string | null>(null);

  const { loading, error, savePod, is_updating, loadPod } = usePod<NOTE_TYPE>(
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
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write something...",
      }),
    ],
    content: "",
    onCreate: async ({ editor }) => {
      const data = await loadPod();
      const sanitizedContent = sanitizeHtml(data?.content || "");
      editor.commands.setContent(sanitizedContent);
      setinitialValue(sanitizedContent);
      setNewValue(sanitizedContent);
    },
    onUpdate: ({ editor }) => {
      setNewValue(sanitizeHtml(editor.getHTML()));
    },
  });

  useEffect(() => {
    if (error) {
      setSaveStatus("ERROR");
      return;
    }
    setSaveStatus(is_updating ? "LOADING" : "SAVED");
  }, [error, is_updating, setSaveStatus]);

  const saveContent = useCallback(
    async (content: string) => {
      pendingSaveRef.current = content;
      if (isSavingRef.current) {
        return;
      }

      isSavingRef.current = true;
      try {
        while (pendingSaveRef.current !== null) {
          const nextContent = pendingSaveRef.current;
          pendingSaveRef.current = null;

          try {
            await savePod(
              {
                content: nextContent,
              },
              {
                metamodel_id: id,
              },
            );
            setinitialValue(nextContent);
            setSaveStatus("SAVED");
          } catch (err) {
            setSaveStatus("ERROR");
            logger.error(err);
            pendingSaveRef.current = null;
            break;
          }
        }
      } finally {
        isSavingRef.current = false;
      }
    },
    [id, savePod, setSaveStatus],
  );

  useMobileNoteBackgroundSave(newValue, initialValue, saveContent);
  // Sync refs with state values for the unmount hook
  useEffect(() => {
    latestNewValueRef.current = newValue;
    latestInitialValueRef.current = initialValue;
  }, [newValue, initialValue]);

  // Main debounced auto-save effect
  useEffect(() => {
    if (newValue !== initialValue && newValue !== null) {
      setSaveStatus("NOT_SAVED");
    } else {
      setSaveStatus("SAVED");
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (!editor) return;
      const updateData = sanitizeHtml(editor.getHTML());
      void saveContent(updateData);
    }, 3000);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [newValue, initialValue, editor, saveContent, setSaveStatus]);

  // Guaranteed save on component unmount or note ID change
  useEffect(() => {
    return () => {
      if (
        latestNewValueRef.current !== null &&
        latestNewValueRef.current !== latestInitialValueRef.current
      ) {
        void saveContent(latestNewValueRef.current);
      }
    };
  }, [saveContent]);

  if (loading) return <NoteLoading />;

  if (error) {
    return (
      <div className="p-4 text-error bg-error/10 rounded-md m-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <NoteEditorStyles />
      <div className="w-full flex-1 flex flex-col p-4 sm:p-6 md:p-8">
        <EditorContent
          editor={editor}
          className="w-full text-forest dark:text-cream focus:outline-hidden flex-1"
        />
      </div>
    </div>
  );
}
