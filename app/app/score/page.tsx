"use client";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import SuggestionBox from "@/components/app/dashboard/SuggestionBox";
import UserScore from "./UserScore";
import ScoreExplainer from "./ScoreExplainer";

export default function ActionsPage() {
  return (
    <div className="w-full pb-6">
      <DesktopAndMobilePageHeader title="Score">
        <SuggestionBox triggerText="Give feedback on score" />
      </DesktopAndMobilePageHeader>

      <div className="px-3 sm:px-4">
        <div className="w-full space-y-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 xl:items-start">
            <div className="xl:col-span-5">
              <UserScore
                description="Keep improving this score to ensure your digital legacy is complete and easy to access when it matters."
                className="h-auto"
              />
            </div>
            <div className="xl:col-span-7">
              <ScoreExplainer />
            </div>
          </div>
        </div>
      </div>
      {/* <UserActions /> */}
    </div>
  );
}
