
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import PasswordsList from "./PasswordsList";


export default function Passwords() {
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Passwords" />
      <div className="px-4">
        <PasswordsList />
      </div>
    </div>
  );
}
