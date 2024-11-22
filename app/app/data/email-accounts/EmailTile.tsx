import Link from "next/link";

export default function EmailTile({ id, data }: { id: string; data: any }) {
  return (
    <div className="border border-default bg-secondary rounded-md p-2 w-full sm:max-w-sm hover:underline">
      <Link href={`/app/data/email-accounts/${id}`}>
        <div>{data.name}</div>
      </Link>
    </div>
  );
}