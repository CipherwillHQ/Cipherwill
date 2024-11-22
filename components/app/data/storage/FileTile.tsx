import Link from "next/link";

export default function FileTile({ id, data: { title } }) {
  return (
    <div className="border border-default rounded-md p-2 bg-secondary">
      <Link href={`/app/data/storage/${id}`}>{title}</Link>
    </div>
  );
}
