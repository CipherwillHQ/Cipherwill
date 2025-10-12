"use client";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import SuggestionBox from "@/components/app/dashboard/SuggestionBox";
import UserActions from "./UserActions";
import UserScore from "./UserScore";

export default function ActionsPage() {
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Actions">
        <SuggestionBox triggerText="Give feedback on actions" />
      </DesktopAndMobilePageHeader>
      <UserScore
        description="User score based on actions taken"
        className="m-4 h-min"
      />
      <UserActions />
    </div>
  );
}
