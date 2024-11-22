import Link from "next/link";
import SimpleButton from "../common/SimpleButton";
import DesktopAndMobilePageHeader from "./common/page/DesktopAndMobilePageHeader";

export default function PremiumFeatureBannerFullScreen({
  title
}:{
  title: string
}) {
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title={title} />
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Premium Feature</h1>
          <p className="font-medium max-w-md py-6 px-2">
            This feature is only available to Premium users. Please upgrade to
            Premium to access this feature.
          </p>
          <div className="flex flex-col items-center justify-center gap-2">
            <Link href="/app/billing">
              <SimpleButton>Upgrade to Premium</SimpleButton>
            </Link>
            <Link href="/app" className="sm:hidden">
              <SimpleButton>Back to dashboard</SimpleButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
