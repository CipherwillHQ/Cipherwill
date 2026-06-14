import PodDetails from "./PodDetails";
import DataHeader from "@/components/app/data/DataHeader";

export default async function EmailAccountViewer({ params }) {
  const { id } = await params;
  return (
    <div className="w-full">
      <DataHeader metamodel_id={id} metamodel_type="email_account" backPath="/app/data/email-accounts" />
      <br />
      <PodDetails id={id} />
    </div>
  );
}
