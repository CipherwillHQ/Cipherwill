import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import AddFile from "@/components/app/data/storage/AddFile";
import AddFolder from "@/components/app/data/storage/AddFolder";
import FileList from "@/components/app/data/storage/FileList";
import FoldersList from "@/components/app/data/storage/FoldersList";
import PremiumFeatureBannerFullScreen from "@/components/app/PremiumFeatureBannerFullScreen";
import PlanRestricted from "@/components/common/PlanRestricted";

export default function StoragePage() {
  return (
    <PlanRestricted placeholder={<PremiumFeatureBannerFullScreen title="File Storage"  />}>
      <div className="w-full">
        <DesktopAndMobilePageHeader title="File Storage">
          <div className="flex gap-2">
            <AddFolder />
            <AddFile />
          </div>
        </DesktopAndMobilePageHeader>
        <FoldersList/>
        <FileList />
      </div>
    </PlanRestricted>
  );
}
