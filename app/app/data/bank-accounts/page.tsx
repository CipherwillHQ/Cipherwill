import BankAccountsList from "./BankAccountsList";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";

export default function BankAccounts() {
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Bank Accounts" />
      <div className="px-4">
        <BankAccountsList />
      </div>
    </div>
  );
}
