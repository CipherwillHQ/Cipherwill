import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import DeviceLocksList from "./DeviceLocksList";
import CreateDeviceLock from "./CreateDeviceLock";

export default function DeviceLocks() {
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Device Locks">
        <CreateDeviceLock />
      </DesktopAndMobilePageHeader>
      <div className="px-2 sm:px-4">
        <DeviceLocksList />
      </div>
    </div>
  );
}
