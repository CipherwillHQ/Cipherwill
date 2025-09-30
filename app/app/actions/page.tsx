"use client";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import SuggestionBox from "@/components/app/dashboard/SuggestionBox";
import UserActions from "./UserActions";

export default function ActionsPage() {
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Actions">
        <SuggestionBox triggerText="Give feedback on actions" />
      </DesktopAndMobilePageHeader>
      <UserActions/>
    </div>
  );
}
