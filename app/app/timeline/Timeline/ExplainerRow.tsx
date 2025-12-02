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
    <div className="flex flex-col sm:flex-row w-full justify-between items-center p-2">
      <div className="opacity-70 font-medium text-center sm:text-left">
        {title}
        <div className="font-bold text-sm">
          Total {Math.floor(cumulative_ms / 86400000)} Days From Failed Check-In
        </div>
      </div>
      <div className="text-sm">
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
