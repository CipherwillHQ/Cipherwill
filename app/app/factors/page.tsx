// Displays security factors while reserving management for desktop in the wrapper.
// Owns the page boundary and desktop-required notice.
// Does not alter existing browser factor controls.
import AddFactor from "../../../components/app/factors/AddFactor";
import MobileDesktopGate from "@/components/app/common/DesktopRequired";
import DevOnly from "../../../components/debug/DevOnly";
import FactorsList from "./FactorsList";
import KeyCount from "./KeyCount";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import FactorNotice from "@/components/app/factors/FactorNotice";

export default function Factors() {
  return (
    <div className="w-full">
      <MobileDesktopGate action="manage your security factors">
      <DesktopAndMobilePageHeader title="Security Factors">
        <AddFactor continuous={true} />
        <DevOnly>
          <AddFactor continuous={false} />
        </DevOnly>
      </DesktopAndMobilePageHeader>

      <div className="px-4">
        <KeyCount />
        <FactorsList />
        <FactorNotice className="text-sm font-semibold text-red-700 max-w-xl mx-auto mt-8" />
      </div>
      </MobileDesktopGate>
    </div>
  );
}
