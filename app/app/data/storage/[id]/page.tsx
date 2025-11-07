import MetaDetails from "./MetaDetails";
import PodDetails from "./PodDetails";

export default async function FileViewer({ params }) {
  const { id } = await params;
  return (
    <div className="w-full">
      <MetaDetails id={id} />
      <div className="p-4">
        <PodDetails id={id} />
      </div>
    </div>
  );
}
