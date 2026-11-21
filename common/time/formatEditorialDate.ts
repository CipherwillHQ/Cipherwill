/**
 * Formats an ISO YYYY-MM-DD date string into a readable editorial date.
 * Owns deterministic UTC-safe date formatting for public research and editorial pages.
 * Does NOT handle relative "time ago" calculations or user-local timezone conversions.
 */

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function formatEditorialDate(isoDate: string): string {
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  const year = Number.parseInt(parts[0], 10);
  const monthIndex = Number.parseInt(parts[1], 10) - 1;
  const day = Number.parseInt(parts[2], 10);
  const monthName = MONTHS[monthIndex];
  if (!monthName || Number.isNaN(year) || Number.isNaN(day)) return isoDate;
  return `${monthName} ${day}, ${year}`;
}
