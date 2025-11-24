"use client";
import MobilePageHeader from "@/components/mobile/MobilePageHeader";
import PodDetails from "./PodDetails";
import { useState } from "react";
import { useParams } from "next/navigation";
import DataHeader from "@/components/app/data/DataHeader";

export default function NoteViewer() {
  const params = useParams();
  const [saveStatus, setSaveStatus] = useState<
    "SAVED" | "NOT_SAVED" | "ERROR" | "LOADING"
  >("SAVED");

  return (
    <div className="w-full">
      <MobilePageHeader path="/app/data/notes" />
      <DataHeader
        metamodel_id={params?.id as string}
        metamodel_type="note"
        saveStatus={saveStatus}
      />
      <PodDetails id={params?.id as string} setSaveStatus={setSaveStatus} />
    </div>
  );
}
