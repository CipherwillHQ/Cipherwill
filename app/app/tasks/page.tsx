"use client";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import SuggestionBox from "@/components/app/dashboard/SuggestionBox";

export default function TasksPage() {
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Tasks">
        <SuggestionBox triggerText="Give feedback on tasks" />
      </DesktopAndMobilePageHeader>
      <div className="px-4">Tasks coming soon...</div>
    </div>
  );
}
