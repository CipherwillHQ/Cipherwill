import Link from "next/link";
import { MetamodelMetadata } from "../../../../types/interfaces";

export default function NoteTile({ id, data }: { id: string; data: MetamodelMetadata }) {
  return (
    <div className="border-b border-default p-2 hover:underline">
      <Link href={`/app/data/notes/${id}`}>
        <div className="line-clamp-1">{(data as any).title || data.name}</div>
      </Link>
    </div>
  );
}
