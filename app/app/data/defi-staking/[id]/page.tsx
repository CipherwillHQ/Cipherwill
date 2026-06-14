import PodDetails from "./PodDetails";
import DataHeader from "@/components/app/data/DataHeader";

export default async function DeFiStaking({ params }) {
  const { id } = await params;
  return (
    <div className="w-full">
      <DataHeader metamodel_id={id} metamodel_type="defi_staking" backPath="/app/data/defi-staking" />
      <br />
      <PodDetails id={id} />
    </div>
  );
}
