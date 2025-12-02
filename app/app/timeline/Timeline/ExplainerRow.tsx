import { DateTime } from "luxon";

export default function ExplainerRow({
  title,
  cumulative_ms,
  interval,
}: {
  title: string;
  cumulative_ms: number;
  interval: number;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white text-center sm:text-left">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
          Total {Math.floor(cumulative_ms / 86400000)} Days From Failed Check-In
        </p>
      </div>
      <div className="flex-shrink-0 text-sm text-gray-900 dark:text-white">
        {DateTime.now()
          .plus({
            milliseconds:
              interval * 86400000 + // interval in days * 86400000 to convert to milliseconds
              cumulative_ms,
          })
          .toJSDate()
          .toDateString()}
      </div>
    </div>
  );
}
