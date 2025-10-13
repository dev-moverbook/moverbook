import { DateTime } from "luxon";

export function toEpochRangeForDates(
  startDateISO: string,
  endDateISO: string,
  timeZone: string
) {
  const startMs = DateTime.fromISO(startDateISO, { zone: timeZone })
    .startOf("day")
    .toMillis();

  const endMs = DateTime.fromISO(endDateISO, { zone: timeZone })
    .plus({ days: 1 })
    .startOf("day")
    .toMillis();

  return { startMs, endMs };
}
