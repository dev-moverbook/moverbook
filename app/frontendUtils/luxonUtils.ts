import { DateTime } from "luxon";

export function toLocalDateTime(millis: number, zone: string): string {
  return DateTime.fromMillis(millis, { zone }).toFormat("yyyy-LL-dd'T'HH:mm");
}

export function fromLocalDateTime(value: string, zone: string): number {
  return DateTime.fromISO(value, { zone }).toMillis();
}

export const formatLongDateTime = (ms: number, timeZone = "UTC"): string => {
  return DateTime.fromMillis(ms, { zone: timeZone }).toFormat(
    "MMM d, yyyy h:mm a"
  );
};
