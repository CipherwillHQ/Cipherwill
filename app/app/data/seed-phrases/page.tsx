import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import SeedPhrasesList from "./SeedPhrasesList";
import CreateSeedPhrase from "./CreateSeedPhrase";
import PlanRestricted from "@/components/common/PlanRestricted";
import PremiumFeatureBannerFullScreen from "@/components/app/PremiumFeatureBannerFullScreen";

export default function SeedPhrases() {
  return (
    <PlanRestricted
      placeholder={<PremiumFeatureBannerFullScreen title="Seed Phrases" />}
    >
      <div className="w-full">
        <DesktopAndMobilePageHeader title="Seed Phrases">
          <CreateSeedPhrase />
        </DesktopAndMobilePageHeader>
        <div className="px-2 sm:px-4">
          <SeedPhrasesList />
        </div>
      </div>
    </PlanRestricted>
  );
}
