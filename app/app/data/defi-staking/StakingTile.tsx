import Link from "next/link";

export default function StakingTile({ id, data }: { id: string; data: any }) {
  return (
    <div className="border border-default bg-secondary rounded-md p-2 w-full sm:max-w-sm hover:underline">
      <Link href={`/app/data/defi-staking/${id}`}>
        <div>{data.name}</div>
      </Link>
    </div>
  );
}
