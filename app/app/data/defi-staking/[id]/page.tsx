import MobilePageHeader from "@/components/mobile/MobilePageHeader";
import PodDetails from "./PodDetails";
import DataHeader from "@/components/app/data/DataHeader";

export default async function DeFiStaking({ params }) {
  const { id } = await params;
  return (
    <div className="w-full">
      <MobilePageHeader path="/app/data/defi-staking" />
      <DataHeader metamode_id={id} metamodel_type="defi_staking" />
      <PodDetails id={id} />
    </div>
  );
}
