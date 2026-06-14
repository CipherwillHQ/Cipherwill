"use client";
/**
 * app/app/data/notes/[id]/page.tsx
 * Redesigned Note Details page.
 * Uses NotesLayout to show the editor next to the list on desktop, and standalone on mobile.
 * Registers beforeunload handler to prevent page refresh/close when the note has unsaved changes.
 */
import PodDetails from "./PodDetails";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DataHeader from "@/components/app/data/DataHeader";
import NotesLayout from "../NotesLayout";

export default function NoteViewer() {
  const params = useParams();
  const [saveStatus, setSaveStatus] = useState<
    "SAVED" | "NOT_SAVED" | "ERROR" | "LOADING"
  >("SAVED");

  const id = params?.id as string;

  // Prevent unsaved browser refresh/close when the note status is edited (NOT_SAVED)
  useEffect(() => {
    if (saveStatus === "NOT_SAVED") {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = ""; // Standard browser warning trigger
      };
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [saveStatus]);

  return (
    <NotesLayout activeId={id}>
      <div className="w-full h-full flex flex-col bg-secondary">
        <div className="border-b-0 lg:border-b border-default bg-secondary">
          <DataHeader
            metamodel_id={id}
            metamodel_type="note"
            saveStatus={saveStatus}
            backPath="/app/data/notes"
          />
        </div>
        <div className="flex-1 overflow-y-auto customScrollbar">
          <PodDetails id={id} setSaveStatus={setSaveStatus} />
        </div>
      </div>
    </NotesLayout>
  );
}
