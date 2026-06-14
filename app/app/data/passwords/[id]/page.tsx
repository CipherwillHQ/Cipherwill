import PodDetails from "./PodDetails";
import DataHeader from "@/components/app/data/DataHeader";

export default async function PasswordViewer({ params }) {
  const { id } = await params;
  return (
    <div className="w-full">
      <DataHeader metamodel_id={id} metamodel_type="password" backPath="/app/data/passwords" />
      <br />
      <PodDetails id={id} />
    </div>
  );
}
