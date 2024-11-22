"use client";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import Storageused from "./Storageused";

export default function UsagePage() {
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Usage" />
      <div className="px-4">
        <Storageused />
      </div>
    </div>
  );
}
