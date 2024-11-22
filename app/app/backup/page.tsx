"use client";
import { useState } from "react";
import ExportBox from "./ExportBox";
import RestoreBox from "./RestoreBox";
import PremiumFeatureBannerFullScreen from "@/components/app/PremiumFeatureBannerFullScreen";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import PlanRestricted from "@/components/common/PlanRestricted";

export default function BackupPage() {
  const [mode, setMode] = useState<"BACKUP" | "RESTOE">("BACKUP");
  return (
    <PlanRestricted placeholder={<PremiumFeatureBannerFullScreen title="Backup"  />}>
      <div className="w-full">
        <DesktopAndMobilePageHeader title="Backup" />
        <div className="px-4">
          <div className="flex py-2 gap-3">
            <button
              className={`cursor-pointer py-1 ${
                mode === "BACKUP"
                  ? "border-b-2 border-accent-500 font-semibold"
                  : ""
              }`}
              onClick={() => {
                setMode("BACKUP");
              }}
            >
              Backup
            </button>
            <button
              className={`cursor-pointer py-1 ${
                mode === "RESTOE"
                  ? "border-b-2 border-accent-500 font-semibold"
                  : ""
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
      </div>
    </PlanRestricted>
  );
}
