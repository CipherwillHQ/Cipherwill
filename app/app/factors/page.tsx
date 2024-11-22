import MobilePageHeader from "@/components/mobile/MobilePageHeader";
import AddFactor from "../../../components/app/factors/AddFactor";
import DevOnly from "../../../components/debug/DevOnly";
import FactorsList from "./FactorsList";
import KeyCount from "./KeyCount";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";

export default function Factors() {
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Security Factors">
        <AddFactor continuous={true} />
        <DevOnly>
          <AddFactor continuous={false} />
        </DevOnly>
      </DesktopAndMobilePageHeader>

      <div className="px-4">
        <KeyCount />
        <FactorsList />
      </div>
    </div>
  );
}
