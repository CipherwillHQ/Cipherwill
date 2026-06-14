import PodDetails from "./PodDetails";
import DataHeader from "@/components/app/data/DataHeader";

export default async function BankAccountViewer({ params }) {
  const { id } = await params;
  return (
    <div className="w-full">
      <DataHeader metamodel_id={id} metamodel_type="bank_account" backPath="/app/data/bank-accounts" />
      <br />
      <PodDetails id={id} />
    </div>
  );
}
