import BankAccountsList from "./BankAccountsList";
import CreateBankAccount from "./CreateBankAccount";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";

export default function BankAccounts() {
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Bank Accounts">
        <CreateBankAccount />
      </DesktopAndMobilePageHeader>
      <div className="px-2 sm:px-4">
        <BankAccountsList />
      </div>
    </div>
  );
}
