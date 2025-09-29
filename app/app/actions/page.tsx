"use client";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import SuggestionBox from "@/components/app/dashboard/SuggestionBox";

export default function ActionsPage() {
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Actions">
        <SuggestionBox triggerText="Give feedback on actions" />
      </DesktopAndMobilePageHeader>
      <div className="px-4">Actions coming soon...</div>
    </div>
  );
}
