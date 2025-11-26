import MobilePageHeader from "@/components/mobile/MobilePageHeader";
import PodDetails from "./PodDetails";
import DataHeader from "@/components/app/data/DataHeader";

export default async function EmailAccountViewer({ params }) {
  const { id } = await params;
  return (
    <div className="w-full">
      <MobilePageHeader path="/app/data/email-accounts" />
      <DataHeader metamodel_id={id} metamodel_type="email_account" />
      <PodDetails id={id} />
    </div>
  );
}
