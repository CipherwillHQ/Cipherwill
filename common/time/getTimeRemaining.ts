import { DateTime } from "luxon";

export default function getTimeRemaining(endTime) {
  const now = new Date().getTime();
  const remaining = endTime - now;
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
    return DateTime.fromMillis(endTime).toRelative();
  }
}
