import AddFactor from "../../../components/app/factors/AddFactor";
import DevOnly from "../../../components/debug/DevOnly";
import FactorsList from "./FactorsList";
import KeyCount from "./KeyCount";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import FactorNotice from "@/components/app/factors/FactorNotice";

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
        <FactorNotice className="text-sm font-semibold text-red-700 max-w-xl mx-auto" />
      </div>
    </div>
  );
}
