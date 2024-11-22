import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import PremiumFeatureBannerFullScreen from "@/components/app/PremiumFeatureBannerFullScreen";
import PlanRestricted from "@/components/common/PlanRestricted";

export default function WishesPage() {
  return (
    <PlanRestricted placeholder={<PremiumFeatureBannerFullScreen title="Wishes"  />}>
      <DesktopAndMobilePageHeader title="Wishes" />
      <div className="px-4">
        <div
        className="border border-default p-2 rounded-md bg-secondary max-w-lg"
        >
          <h3 className="text-2xl pb-2 font-semibold">
            How should we treat you?
          </h3>
          <p>
            We're glad you asked! We're here to help you find the perfect gift for you. We understand that everyone has different tastes and preferences, so we've created a range of options to suit everyone's needs. Whether you're looking for a thoughtful gift or a unique experience, we've got you covered.
          </p>
        </div>
        
      </div>
    </PlanRestricted>
  );
}
