// DataTile
// What it does: Shared card tile for data segment list pages. Shows name + created/updated timestamps.
// What it owns: Card presentation for metamodel list items across all standard data segments.
// What it does NOT do: Does not touch pods, encryption, or detail editing.

import Link from "next/link";
import { ReactNode } from "react";
import getTimeAgo from "@/common/time/getTimeAgo";

export default function DataTile({
  id,
  name,
  updated_at,
  basePath,
  icon,
}: {
  id: string;
  name: string;
  updated_at: string;
  basePath: string;
  icon?: ReactNode;
}) {
  return (
    <Link
      href={`${basePath}/${id}`}
      prefetch={false}
      className="border border-default bg-secondary rounded-2xl p-4 hover:border-primary/30 transition-colors block"
    >
      <div className="flex items-center gap-2 mb-2">
        {icon && <span>{icon}</span>}
        <span className="font-semibold text-sm truncate">{name}</span>
      </div>
      <div className="text-xs text-neutral-500 dark:text-neutral-400">
        Updated {getTimeAgo(parseInt(updated_at))}
      </div>
    </Link>
  );
}
