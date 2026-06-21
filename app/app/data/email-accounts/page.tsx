
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import EmailAccountsList from "./EmailAccountsList";

export default function EmailAccounts() {
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Email Accounts" />
      <div className="px-2 sm:px-4">
        <EmailAccountsList />
      </div>
    </div>
  );
}
