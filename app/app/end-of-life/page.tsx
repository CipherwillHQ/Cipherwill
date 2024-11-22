import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import PremiumFeatureBannerFullScreen from "@/components/app/PremiumFeatureBannerFullScreen";
import PlanRestricted from "@/components/common/PlanRestricted";

export default function EndOfLifePage() {
  return (
    <PlanRestricted placeholder={<PremiumFeatureBannerFullScreen title="End of Life Plans"  />}>
      <DesktopAndMobilePageHeader title="End of Life Plans" />
      <div className="px-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem nulla
        fugit rem veritatis ad commodi tempore hic corrupti soluta reiciendis,
        placeat, labore blanditiis sequi necessitatibus, nihil voluptate. Quasi,
        iste quam!
      </div>
    </PlanRestricted>
  );
}
