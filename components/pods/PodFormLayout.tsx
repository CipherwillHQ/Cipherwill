// Responsive two-column layout: form (left) + live preview (right on desktop, slide-in on mobile).
// Owns: preview toggle, unsaved-changes indicator, save button placement. Does NOT own form fields or data.
"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

interface PodFormLayoutProps {
  children: ReactNode;
  preview: ReactNode;
  previewOpen: boolean;
  onTogglePreview: () => void;
  saveButton: ReactNode;
  isDirty: boolean;
}

export default function PodFormLayout({
  children,
  preview,
  previewOpen,
  onTogglePreview,
  saveButton,
  isDirty,
}: PodFormLayoutProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:min-h-0 sm:flex-1 w-full">
      <div className="sm:w-1/2 flex flex-col gap-4 px-4 py-4 sm:py-6 w-full">
        {children}
        {isDirty && (
          <div className="text-xs text-warning font-medium">
            You have unsaved changes
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="sm:hidden flex items-center justify-center gap-1.5 bg-secondary border border-default rounded-xl px-4 py-2.5 text-sm font-medium text-forest dark:text-cream hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            onClick={onTogglePreview}
          >
            Preview
          </button>
          <div className="flex-1">{saveButton}</div>
        </div>
      </div>

      <div className="hidden sm:block sm:w-1/2 border-l border-default bg-secondary overflow-y-auto">
        {preview}
      </div>

      <AnimatePresence>
        {previewOpen && (
          <>
            <motion.div
              className="sm:hidden fixed inset-0 bg-black/40 z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onTogglePreview}
            />
            <motion.div
              className="sm:hidden fixed top-0 right-0 bottom-0 w-full max-w-sm z-40 bg-secondary shadow-xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            >
              <div className="shrink-0 flex items-center justify-between p-4 border-b border-default">
                <button
                  type="button"
                  className="text-sm font-medium text-forest dark:text-cream"
                  onClick={onTogglePreview}
                >
                  Close Preview
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {preview}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
