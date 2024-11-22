import MobilePageHeader from "@/components/mobile/MobilePageHeader";
import MetaDetails from "./MetaDetails";
import PodDetails from "./PodDetails";

export default function DeviceLockViewer({ params }) {
  return (
    <div className="w-full">
      <MobilePageHeader path="/app/data/device-locks" />

      <div className="px-4 w-full">
        <MetaDetails id={params.id} />
        <div className="w-full max-w-md mt-4">
          <PodDetails id={params.id} />
        </div>
      </div>
    </div>
  );
}
