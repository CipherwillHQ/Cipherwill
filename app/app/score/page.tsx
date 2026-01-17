"use client";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import SuggestionBox from "@/components/app/dashboard/SuggestionBox";
import UserScore from "./UserScore";
import ScoreExplainer from "./ScoreExplainer";

export default function ActionsPage() {
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Actions">
        <SuggestionBox triggerText="Give feedback on actions" />
      </DesktopAndMobilePageHeader>
      <UserScore
        description="Your Cipherwill Score shows how prepared your digital legacy is. Add more details to increase your score and ensure everything is ready for your loved ones."
        className="m-4 h-min"
      />
      <ScoreExplainer/>
      {/* <UserActions /> */}
    </div>
  );
}
