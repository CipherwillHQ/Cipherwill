import MobilePageHeader from "@/components/mobile/MobilePageHeader";
import CreateNote from "./CreateNote";
import NotesList from "./NotesList";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";

export default function BankAccounts() {
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Notes">
        <CreateNote />
      </DesktopAndMobilePageHeader>
      <div className="px-2 sm:px-4">
        <NotesList />
      </div>
    </div>
  );
}
