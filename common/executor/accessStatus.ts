// Formats the access deadline shown throughout the executor workspace.
// Owns the distinction between available and expired access.
// Does not grant, extend, or revoke access.

import { DateTime } from "luxon";

export function getExecutorAccessStatus(
  expireAt: string,
  now = new Date().getTime(),
) {
  const deadline = Number(expireAt);
  const expired = deadline <= now;

  return {
    expired,
    label: expired ? "Access ended" : "Access granted",
    deadlineLabel: DateTime.fromMillis(deadline, { zone: "UTC" }).toFormat("d LLL yyyy, h:mm a 'UTC'"),
    deadlineIso: new Date(deadline).toISOString(),
  };
}
