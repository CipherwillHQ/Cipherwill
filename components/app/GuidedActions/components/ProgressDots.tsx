export default function ProgressDots({
  total,
  completed,
  skipped,
}: {
  total: number | null;
  completed: number | null;
  skipped: number | null;
}) {
  if (total === null || completed === null || skipped === null || total <= 0) {
    return null;
  }

  const boundedCompleted = Math.max(0, Math.min(completed, total));
  const boundedSkipped = Math.max(0, Math.min(skipped, total - boundedCompleted));
  const remaining = Math.max(0, total - boundedCompleted - boundedSkipped);

  return (
    <div className="flex items-center justify-center gap-2 pt-1" aria-label="Progress dots">
      {Array.from({ length: boundedCompleted }).map((_, i) => (
        <span
          key={`completed-${i}`}
          className="h-2.5 w-2.5 rounded-full bg-green-500"
          aria-label="Completed step"
        />
      ))}
      {Array.from({ length: boundedSkipped }).map((_, i) => (
        <span
          key={`skipped-${i}`}
          className="h-2.5 w-2.5 rounded-full bg-orange-500"
          aria-label="Skipped step"
        />
      ))}
      {Array.from({ length: remaining }).map((_, i) => (
        <span
          key={`remaining-${i}`}
          className="h-2.5 w-2.5 rounded-full border border-black/40 dark:border-white/40"
          aria-label="Remaining step"
        />
      ))}
    </div>
  );
}
