// Renders backup and restore controls with a desktop requirement in the wrapper.
// Owns the backup tab and its mobile availability notice.
// Does not create archives or restore records.
"use client";

import { useState } from "react";
import ExportBox from "./ExportBox";
import RestoreBox from "./RestoreBox";
import PremiumFeatureBannerFullScreen from "@/components/app/PremiumFeatureBannerFullScreen";
import PlanRestricted from "@/components/common/PlanRestricted";
import MobileDesktopGate from "@/components/app/common/DesktopRequired";

export default function BackupPanel() {
  const [mode, setMode] = useState<"BACKUP" | "RESTOE">("BACKUP");

  return (
    <MobileDesktopGate action="back up or restore your vault">
    <PlanRestricted
      placeholder={<PremiumFeatureBannerFullScreen title="Backup" />}
    >
      <div className="px-4">
        <div className="flex py-2 gap-3">
          <button
            className={`cursor-pointer py-1 ${
              mode === "BACKUP" ? "border-b-2 border-primary font-semibold" : ""
            }`}
            onClick={() => {
              setMode("BACKUP");
            }}
          >
            Backup
          </button>
          <button
            className={`cursor-pointer py-1 ${
              mode === "RESTOE" ? "border-b-2 border-primary font-semibold" : ""
            }`}
            onClick={() => {
              setMode("RESTOE");
            }}
          >
            Restore
          </button>
        </div>
        {mode === "BACKUP" && <ExportBox />}
        {mode === "RESTOE" && <RestoreBox />}
      </div>
    </PlanRestricted>
    </MobileDesktopGate>
  );
}
