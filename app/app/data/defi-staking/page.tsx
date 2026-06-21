import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import StackingList from "./StackingList";
import PlanRestricted from "@/components/common/PlanRestricted";
import PremiumFeatureBannerFullScreen from "@/components/app/PremiumFeatureBannerFullScreen";

export default function DeFiStacking() {
  return (
    <PlanRestricted
      placeholder={<PremiumFeatureBannerFullScreen title="DeFi Staking" />}
    >
      <div className="w-full">
        <DesktopAndMobilePageHeader title="DeFi Staking" />
        <div className="px-4">
          <StackingList />
        </div>
      </div>
    </PlanRestricted>
  );
}
