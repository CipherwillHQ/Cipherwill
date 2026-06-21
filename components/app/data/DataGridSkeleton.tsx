// DataGridSkeleton
// What it does: Skeleton placeholder grid matching the DataTile card layout for all data segment list pages.
// What it owns: Loading state presentation — pulse-animated placeholder cards in a responsive grid.
// What it does NOT do: Does not handle error states or empty states.

export default function DataGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="border border-default bg-secondary rounded-2xl p-4 animate-pulse"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-4 rounded-md bg-neutral-200 dark:bg-neutral-800 w-3/4" />
          </div>
          <div className="h-3 rounded-md bg-neutral-200 dark:bg-neutral-800 w-1/2" />
        </div>
      ))}
    </div>
  );
}
