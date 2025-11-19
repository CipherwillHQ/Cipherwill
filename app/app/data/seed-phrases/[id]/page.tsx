import MobilePageHeader from "@/components/mobile/MobilePageHeader";
import PodDetails from "./PodDetails";
import DataHeader from "@/components/app/data/DataHeader";

export default async function SeedPhraseViewer({ params }) {
  const { id } = await params;
  return (
    <div className="w-full">
      <MobilePageHeader path="/app/data/seed-phrases" />
      <DataHeader metamode_id={id} metamodel_type="seed_phrase" />
      <PodDetails id={id} />
    </div>
  );
}
