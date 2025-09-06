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

export function isSameDayOrLater(
  moveDate: string | Date | null,
  timeZone: string
): boolean {
  if (!moveDate) {
    return false;
  }
  const moveDateLuxon = DateTime.fromJSDate(
    typeof moveDate === "string" ? new Date(moveDate) : moveDate,
    { zone: timeZone }
  ).startOf("day");
  const nowLuxon = DateTime.now().setZone(timeZone).startOf("day");
  return nowLuxon >= moveDateLuxon;
}
