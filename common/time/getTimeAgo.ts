import { DateTime } from "luxon";

export default function getTimeAgo(
  timestamp: number,
  only_date: boolean = false
) {
  const now = new Date().getTime();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (only_date) {
    const date = new Date(timestamp);
    return date.toDateString();
  }

  if (days > 0) {
    const date = new Date(timestamp);
    return date.toDateString();
  } else if (seconds > -10 && seconds < 10) {
    return "Just now";
  } else {
    return DateTime.fromMillis(timestamp).toRelative();
  }
}
