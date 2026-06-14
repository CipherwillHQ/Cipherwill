import PodDetails from "./PodDetails";
import DataHeader from "@/components/app/data/DataHeader";

export default async function SeedPhraseViewer({ params }) {
  const { id } = await params;
  return (
    <div className="w-full">
      <DataHeader metamodel_id={id} metamodel_type="seed_phrase" backPath="/app/data/seed-phrases" />
      <br />
      <PodDetails id={id} />
    </div>
  );
}
