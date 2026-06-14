"use client";
/**
 * app/app/data/notes/page.tsx
 * Redesigned notes landing page.
 * Uses the responsive NotesLayout. On desktop, if notes exist, it will auto-select the first one.
 */
import NotesLayout from "./NotesLayout";

export default function NotesPage() {
  return <NotesLayout activeId={undefined} />;
}
