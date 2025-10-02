import { DateTime } from "luxon";
import { isNarrowScreen } from "../components/shared/graphs/lineGraphs/lineGraphUtils";

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

export function formatDateRangeLabel(
  startISO?: string | null,
  endISO?: string | null
): string | null {
  if (!startISO || !endISO) return null;
  const start = DateTime.fromISO(startISO);
  const end = DateTime.fromISO(endISO);
  if (!start.isValid || !end.isValid) return null;

  if (start.hasSame(end, "day")) {
    return start.toFormat("LLL d, yyyy");
  }

  if (start.year === end.year) {
    if (start.month === end.month) {
      return `${start.toFormat("LLL d")}–${end.toFormat("d")}, ${end.toFormat("yyyy")}`;
    }
    return `${start.toFormat("LLL d")} – ${end.toFormat("LLL d")}, ${end.toFormat("yyyy")}`;
  }

  return `${start.toFormat("LLL d, yyyy")} – ${end.toFormat("LLL d, yyyy")}`;
}

export const todayISO = (timezone: string): string => {
  const dateTime = DateTime.now().setZone(timezone);
  if (!dateTime.isValid) {
    throw new Error(`Invalid timezone: ${timezone}`);
  }
  const isoString = dateTime.toISODate();
  if (isoString === null) {
    throw new Error("Unable to format ISO date");
  }
  return isoString;
};

export const tomorrowISO = (timezone: string): string => {
  const dateTime = DateTime.now().setZone(timezone).plus({ days: 1 });
  if (!dateTime.isValid) {
    throw new Error(`Invalid timezone: ${timezone}`);
  }
  const isoString = dateTime.toISODate();
  if (isoString === null) {
    throw new Error("Unable to format ISO date");
  }
  return isoString;
};

export const addDaysISO = (
  dateISO: string,
  daysToAdd: number,
  timezone: string
): string => {
  const dateTime = DateTime.fromISO(dateISO, { zone: timezone }).plus({
    days: daysToAdd,
  });
  if (!dateTime.isValid) {
    throw new Error(`Invalid date or timezone: ${dateISO}, ${timezone}`);
  }
  const isoString = dateTime.toISODate();
  if (isoString === null) {
    throw new Error("Unable to format ISO date");
  }
  return isoString;
};

export const computeEndMinISO = (
  startDateISO: string | null | undefined,
  timezone: string
): string => {
  if (startDateISO) {
    return addDaysISO(startDateISO, 1, timezone);
  }
  return tomorrowISO(timezone);
};

export const clampEndAfterStart = (
  startDateISO: string | null,
  endDateISO: string | null,
  timezone: string
): string | null => {
  if (!startDateISO) {
    return endDateISO;
  }
  const minimumEndISO = addDaysISO(startDateISO, 1, timezone);
  if (!endDateISO) {
    return minimumEndISO;
  }
  if (endDateISO < minimumEndISO) {
    return minimumEndISO;
  }
  return endDateISO;
};

export const clampStartToTomorrow = (
  startDateISO: string | null,
  timezone: string
): string | null => {
  if (!startDateISO) {
    return null;
  }
  const minimumStartISO = tomorrowISO(timezone);
  if (startDateISO < minimumStartISO) {
    return minimumStartISO;
  }
  return startDateISO;
};

export function lastNDaysCompleteTZ(numberOfDays: number, timeZone: string) {
  const endOfRangeDateTime = DateTime.now()
    .setZone(timeZone)
    .startOf("day")
    .minus({ days: 1 });

  const startOfRangeDateTime = endOfRangeDateTime
    .minus({ days: numberOfDays - 1 })
    .startOf("day");

  return {
    startISO: startOfRangeDateTime.toISO(),
    endISO: endOfRangeDateTime.endOf("day").toISO(),
  };
}

export const clampEndNotBeforeStart = (
  startISO: string | null,
  endISO: string | null
): string | null => {
  if (!startISO || !endISO) {
    return endISO;
  }
  if (endISO < startISO) {
    return startISO;
  }
  return endISO;
};

export function nextRangeISO(
  days: number,
  tz: string
): { start: string; end: string } {
  const start = DateTime.now().setZone(tz).plus({ days: 1 }).startOf("day");
  const end = start.plus({ days: days - 1 }); // exclude today, inclusive range
  return { start: start.toISODate()!, end: end.toISODate()! };
}

export type RangeDirection = "forward" | "backward";

export function rollingRangeISO(
  tz: string,
  days: number,
  direction: RangeDirection,
  opts?: { includeToday?: boolean; anchor?: DateTime }
): { start: string; end: string } {
  const includeToday = opts?.includeToday ?? false;
  const anchor = (opts?.anchor ?? DateTime.now().setZone(tz)).startOf("day");

  if (direction === "forward") {
    const start = includeToday ? anchor : anchor.plus({ days: 1 });
    const end = start.plus({ days: Math.max(0, days - 1) });
    return { start: start.toISODate()!, end: end.toISODate()! };
  } else {
    const end = includeToday ? anchor : anchor.minus({ days: 1 });
    const start = end.minus({ days: Math.max(0, days - 1) });
    return { start: start.toISODate()!, end: end.toISODate()! };
  }
}

export function nextNDaysISO(
  tz: string,
  days: number,
  includeToday = false
): { start: string; end: string } {
  return rollingRangeISO(tz, days, "forward", { includeToday });
}

export function prevNDaysISO(
  tz: string,
  days: number,
  includeToday = false
): { start: string; end: string } {
  return rollingRangeISO(tz, days, "backward", { includeToday });
}

export const formatXLabel = (labelValue: string | number): string => {
  const isMobileViewport = isNarrowScreen();
  const mobileViewportFormat = "LLL d";
  const desktopViewportFormat = "M/d";

  const formatDateTimeForViewport = (dateTime: DateTime): string => {
    if (!dateTime.isValid) return String(labelValue);
    return dateTime.toFormat(
      isMobileViewport ? mobileViewportFormat : desktopViewportFormat
    );
  };

  if (typeof labelValue === "number") {
    const dateTime = DateTime.fromMillis(labelValue);
    return formatDateTimeForViewport(dateTime);
  }

  const dateTime = DateTime.fromISO(labelValue);
  return formatDateTimeForViewport(dateTime);
};

export function formatMonthDayLabelStrict(
  input: string | number | Date,
  options?: { zone?: string; locale?: string }
): string {
  const dateTime =
    input instanceof Date
      ? DateTime.fromJSDate(input, { zone: options?.zone })
      : typeof input === "number"
        ? DateTime.fromMillis(input, { zone: options?.zone })
        : DateTime.fromISO(input, { zone: options?.zone });

  const localized = options?.locale
    ? dateTime.setLocale(options.locale)
    : dateTime;
  if (!localized.isValid) {
    return String(input);
  }

  return localized.toFormat("LLL d");
}

export function formatWeekdayShort(isoDate: string): string {
  const formatted: string = DateTime.fromISO(isoDate).toFormat("ccc"); // "Sun"
  return formatted;
}

export function formatWeekdayShortWithDate(isoDateString: string): string {
  const dateTime = DateTime.fromISO(isoDateString);

  if (!dateTime.isValid) {
    const fallback = isoDateString;
    return fallback;
  }

  const formatted = dateTime.toFormat("LLL d, yyyy");
  return formatted;
}
