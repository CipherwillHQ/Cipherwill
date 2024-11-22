
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import PasswordsList from "./PasswordsList";
import CreatePassword from "./CreatePassword";


export default function Passwords() {
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Passwords">
        <CreatePassword />
      </DesktopAndMobilePageHeader>
      <div className="px-2 sm:px-4">
        <PasswordsList />
      </div>
    </div>
  );
}
