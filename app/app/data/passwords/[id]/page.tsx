import MobilePageHeader from "@/components/mobile/MobilePageHeader";
import PodDetails from "./PodDetails";
import DataHeader from "@/components/app/data/DataHeader";

export default async function PasswordViewer({ params }) {
  const { id } = await params;
  
  return (
    <div className="w-full">
      <MobilePageHeader path="/app/data/passwords" />
      <DataHeader metamode_id={id} metamodel_type="password" />
      <PodDetails id={id} />
    </div>
  );
}
