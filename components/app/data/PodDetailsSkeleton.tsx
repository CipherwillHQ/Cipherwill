// PodDetailsSkeleton
// What it does: Skeleton placeholder for PodDetails form fields — label + input rows matching the form layout for all data segment detail pages.
// What it owns: Loading state presentation — pulse-animated form rows with a spinner.
// What it does NOT do: Does not handle error states or empty states.

export default function PodDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4 w-full max-w-xl animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded-md w-1/4" />
          <div className="h-11 bg-neutral-200 dark:bg-neutral-800 rounded-xl w-full" />
        </div>
      ))}

      {/* <div className="flex flex-col items-center justify-center pt-6 pb-4">
        <div className="w-10 h-10 border-2 border-primary-100 border-t-primary rounded-full animate-spin mb-3" />
        <p className="text-xs text-neutral-400 font-semibold tracking-wide uppercase">
          loading...
        </p>
      </div> */}
    </div>
  );
}
