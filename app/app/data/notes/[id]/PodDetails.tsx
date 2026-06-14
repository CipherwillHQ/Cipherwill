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
import sanitizeHtml from "@/common/security/sanitizeHtml";

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

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col p-6 sm:p-8 animate-pulse space-y-6 bg-secondary">
        {/* Skeletal Header */}
        <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded-md w-1/3" />
        
        {/* Skeletal Body Lines */}
        <div className="space-y-3 pt-4">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-3/4" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-5/6" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-2/3" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-1/2" />
        </div>
        
        <div className="space-y-3 pt-6">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-5/6" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-4/5" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-3/4" />
        </div>

        {/* Center engaging indicator */}
        <div className="flex-1 flex flex-col items-center justify-center pt-10">
          <div className="w-10 h-10 border-2 border-primary-100 border-t-primary rounded-full animate-spin mb-3" />
          <p className="text-xs text-neutral-400 font-semibold tracking-wide uppercase">loading note...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-error bg-error/10 rounded-md m-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <style>{`
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror {
          min-height: calc(100vh - 160px);
          font-family: var(--font-gilroy), sans-serif;
          font-size: 1rem;
        }
        .ProseMirror p {
          margin-bottom: 0.5rem;
        }
        .ProseMirror h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
        }
        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .ProseMirror li {
          margin-bottom: 0.25rem;
        }
        .ProseMirror strong {
          font-weight: 700;
        }
        .ProseMirror em {
          font-style: italic;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #003ecb;
          padding-left: 1rem;
          font-style: italic;
          margin-bottom: 1rem;
          color: #6b7280;
        }
        .ProseMirror pre {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.375rem;
          font-family: monospace;
          margin-bottom: 1rem;
          overflow-x: auto;
        }
        .dark .ProseMirror pre {
          background-color: #111827;
        }
      `}</style>
      <div className="w-full flex-1 flex flex-col p-4 sm:p-6 md:p-8">
        <EditorContent
          editor={editor}
          className="w-full text-forest dark:text-cream focus:outline-hidden flex-1"
        />
      </div>
    </div>
  );
}
