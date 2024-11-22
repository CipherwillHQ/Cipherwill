import Link from "next/link";

export default function FolderTile({ id, name}) {
  return (
    <div className="border border-default rounded-md p-2 bg-secondary">
      <Link href={`/app/data/storage/folder/${id}`}>{name}</Link>
    </div>
  );
}
