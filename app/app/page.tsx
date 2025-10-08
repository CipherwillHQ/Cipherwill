import MobileMenu from "@/components/app/Sidebar/MobileMenu";
import FactorsSyncStatus from "../../components/app/FactorsSyncStatus";
import Greetings from "../../components/app/Greetings";
import ExecutorPermissions from "../../components/executor/ExecutorPermissions";
import GrantedBeneficiaryAccessList from "../../components/executor/GrantedBeneficiaryAccessList";
import Topbar from "@/components/app/Topbar";
import EmailVerificationCheck from "@/components/app/EmailVerificationCheck";
import OnboardingChecklist from "@/components/app/OnboardingChecklist";
import DevOnly from "@/components/debug/DevOnly";
import Link from "next/link";
import SegmentsIntroduction from "@/components/app/dashboard/SegmentsIntroduction";
import PendingActionsBox from "@/components/app/actions/PendingActionsBox";
import UserScore from "./actions/UserScore";
import SecuredCounter from "@/components/app/dashboard/SecuredCounter";

export default function App() {
  return (
    <div className="w-full">
      <MobileMenu />
      <Topbar />
      <div className="px-2">
        <div className="flex flex-col sm:flex-row items-center gap-4 p-2">
          <Greetings />
          <EmailVerificationCheck />
        </div>
        <div className="p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <UserScore improveScrollLink />
            <PendingActionsBox />
            <SecuredCounter />
            {/* <OnboardingChecklist /> */}
            <FactorsSyncStatus />
            <SegmentsIntroduction />
            <ExecutorPermissions />
            <GrantedBeneficiaryAccessList />
            <DevOnly>
              <Link
                href="/executor"
                className="border border-accent-500 p-1 rounded-md"
              >
                Executor Dashboard
              </Link>
            </DevOnly>
          </div>
        </div>
      </div>
    </div>
  );
}
