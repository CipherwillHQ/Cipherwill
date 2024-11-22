import MetaDetails from "./MetaDetails";
import DeleteButton from "./DeleteButton";
import PodDetails from "./PodDetails";

export default function FileViewer({ params }) {
  return (
    <div className="w-full">
      <MetaDetails id={params.id} />
      <div className="px-4">
        <PodDetails id={params.id} />
      </div>
    </div>
  );
}
