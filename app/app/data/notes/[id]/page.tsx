'use client'  
import MobilePageHeader from "@/components/mobile/MobilePageHeader";
import MetaDetails from "./MetaDetails";
import PodDetails from "./PodDetails";
import { useState } from "react";

export default function NoteViewer({ params }) {
  const [saveStatus, setSaveStatus] = useState<
    "SAVED" | "NOT_SAVED" | "ERROR" | "LOADING"
  >("SAVED");

  return (
    <div className="w-full">
      <MobilePageHeader path="/app/data/notes" />

      <div className="px-4 w-full">
        <MetaDetails id={params.id}
        saveStatus={saveStatus}
        />
        <PodDetails id={params.id}
        setSaveStatus={setSaveStatus}
        />
      </div>
    </div>
  );
}
