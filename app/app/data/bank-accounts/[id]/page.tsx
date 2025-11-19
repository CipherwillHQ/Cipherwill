import MobilePageHeader from "@/components/mobile/MobilePageHeader";
import PodDetails from "./PodDetails";
import DataHeader from "@/components/app/data/DataHeader";

export default async function BankAccountViewer({ params }) {
  const { id } = await params;
  return (
    <div className="w-full">
      <MobilePageHeader path="/app/data/bank-accounts" />
      <DataHeader metamode_id={id} metamodel_type="bank_account" />
      <PodDetails id={id} />
    </div>
  );
}
