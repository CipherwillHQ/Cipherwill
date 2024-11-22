import Link from "next/link";

export default function NoteTile({ id, data }: { id: string; data: any }) {
  return (
    <div className="border-b border-default p-2 hover:underline">
      <Link href={`/app/data/notes/${id}`}>
        <div className="line-clamp-1">{data.title}</div>
      </Link>
    </div>
  );
}
