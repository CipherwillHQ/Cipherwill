// Skeleton loading placeholder for pod details — mirrors PodFormLayout structure.
// Owns: shimmer animation, placeholder layout. Does NOT own form data or preview logic.
"use client";

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl bg-neutral-200 dark:bg-neutral-700 animate-pulse ${className}`}
    />
  );
}

function FormFieldSkeleton() {
  return (
    <div>
      <Shimmer className="h-3.5 w-20 mb-1" />
      <Shimmer className="h-11 w-full" />
    </div>
  );
}

export default function PodFormSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:min-h-0 sm:flex-1 w-full p-2 gap-4">
      {/* Form skeleton */}
      <div className="sm:w-1/2 flex flex-col w-full gap-4">
        <FormFieldSkeleton />
        <FormFieldSkeleton />
        <FormFieldSkeleton />
        <FormFieldSkeleton />
        <FormFieldSkeleton />
        <div className="flex items-center gap-2 mt-1">
          <Shimmer className="h-11 sm:hidden w-24 rounded-xl" />
          <Shimmer className="h-11 w-full rounded-xl" />
        </div>
      </div>

      {/* Preview skeleton */}
      <div className="hidden sm:block sm:w-1/2 border-l border-default bg-white dark:bg-darkCard overflow-y-auto rounded-xl">
        <div className="p-6 sm:p-8">
          <Shimmer className="h-3.5 w-16 mb-4" />
          <Shimmer className="h-11 w-full" />
        </div>
      </div>
    </div>
  );
}
