import { DateTime } from "luxon";

export function toEpochRangeForDates(
  startDateISO: string, // "YYYY-MM-DD"
  endDateISO: string, // "YYYY-MM-DD"
  timeZone: string // e.g., "America/Los_Angeles"
) {
  const startMs = DateTime.fromISO(startDateISO, { zone: timeZone })
    .startOf("day")
    .toMillis();

  // Exclusive end: the *start of the day after* endDate
  const endMs = DateTime.fromISO(endDateISO, { zone: timeZone })
    .plus({ days: 1 })
    .startOf("day")
    .toMillis();

  return { startMs, endMs };
}
