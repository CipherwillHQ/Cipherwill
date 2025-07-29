import { DateTime } from "luxon";

/**
 * Calculates the time remaining until a specified end time and returns it as a human-readable string.
 *
 * @param endTime - The end time in Unix millisecond timestamp format.
 * @param do_not_allow_past - If true, returns "any time now" if the end time is in the past.
 * @returns A string representing the time remaining in days, hours, minutes, or seconds.
 */
export default function getTimeRemaining(
  endTime: number,
  do_not_allow_past = false
): string {
  const now = new Date().getTime();
  const remaining = endTime - now;
  if (remaining < 0 && do_not_allow_past) {
    return "any time now";
  }
  const seconds = Math.floor(remaining / 1000) % 60;
  const minutes = Math.floor(remaining / 1000 / 60) % 60;
  const hours = Math.floor(remaining / 1000 / 60 / 60) % 24;
  const days = Math.floor(remaining / 1000 / 60 / 60 / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ${hours} hour${
      hours > 1 ? "s" : ""
    }`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${
      minutes > 1 ? "s" : ""
    }`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ${seconds} second${
      seconds > 1 ? "s" : ""
    }`;
  } else if (seconds > 0) {
    return `${seconds} second${seconds > 1 ? "s" : ""}`;
  } else {
    return DateTime.fromMillis(endTime).toRelative() ?? "unknown";
  }
}
