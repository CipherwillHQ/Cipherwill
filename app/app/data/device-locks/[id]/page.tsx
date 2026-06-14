import PodDetails from "./PodDetails";
import DataHeader from "@/components/app/data/DataHeader";

export default async function DeviceLockViewer({ params }) {
  const { id } = await params;
  return (
    <div className="w-full">
      <DataHeader metamodel_id={id} metamodel_type="device_lock" backPath="/app/data/device-locks" />
      <br />
      <PodDetails id={id} />
    </div>
  );
}
