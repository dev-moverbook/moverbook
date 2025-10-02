import {
  FunnelPoint,
  HistoricalPoint,
  LineGraphDatum,
  MetricKey,
  RechartsRow,
  StackedDay,
  TooltipRowPayload,
} from "@/types/types";
import { DateTime } from "luxon";

const DEFAULT_PALETTE = [
  "#F97316",
  "#FCA5A5",
  "#3B82F6",
  "#10B981",
  "#EAB308",
  "#A78BFA",
  "#22D3EE",
  "#FB7185",
];

export function hashStringToIndex(input: string, modulo: number): number {
  let hash = 0;
  for (let charIndex = 0; charIndex < input.length; charIndex++) {
    hash = (hash * 31 + input.charCodeAt(charIndex)) | 0;
  }
  return Math.abs(hash) % modulo;
}

export function collectSegmentNames(series: StackedDay[]): string[] {
  const nameSet = new Set<string>();
  for (const day of series) {
    for (const segment of day.segments) {
      nameSet.add(segment.name);
    }
  }
  return Array.from(nameSet).sort((left, right) => left.localeCompare(right));
}

export function resolveColorMap(
  segmentNames: string[],
  overrideByName?: Record<string, string>,
  palette: string[] = DEFAULT_PALETTE
): Record<string, string> {
  const colorMap: Record<string, string> = { ...(overrideByName ?? {}) };
  for (const segmentName of segmentNames) {
    if (!colorMap[segmentName]) {
      colorMap[segmentName] =
        palette[hashStringToIndex(segmentName, palette.length)];
    }
  }
  return colorMap;
}

export function toRechartsRows(
  series: StackedDay[],
  labelFormatter: (isoDate: string) => string
): RechartsRow[] {
  return series.map((day) => {
    const row: RechartsRow = {
      date: day.date,
      label: labelFormatter(day.date),
    };
    for (const segment of day.segments) {
      row[segment.name] = segment.amount ?? 0;
    }
    return row;
  });
}

export function isFunnelEmpty(series: FunnelPoint[] | null | undefined) {
  if (!Array.isArray(series) || series.length === 0) {
    return true;
  }
  return series.every(
    (p) => typeof p?.value !== "number" || Number.isNaN(p.value)
  );
}

export function startOfLocalDay(dateInput: Date): Date {
  const date = new Date(dateInput);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function addDaysLocal(dateInput: Date, daysToAdd: number): Date {
  const result = new Date(dateInput);
  result.setDate(result.getDate() + daysToAdd);
  return startOfLocalDay(result);
}

export function toDateString(dateInput: Date): string {
  const year = dateInput.getFullYear();
  const month = `${dateInput.getMonth() + 1}`.padStart(2, "0");
  const day = `${dateInput.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateString(value: string): Date {
  const [yearStr, monthStr, dayStr] = value.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  return startOfLocalDay(new Date(year, month - 1, day));
}

export function nextSundayOnOrAfter(dateInput: Date): Date {
  const date = startOfLocalDay(dateInput);
  const dayOfWeek = date.getDay(); // 0 = Sunday
  const daysUntilSunday = (7 - dayOfWeek) % 7;
  return addDaysLocal(date, daysUntilSunday);
}

export function initialForecastRange(): { startDate: string; endDate: string } {
  const today = startOfLocalDay(new Date());
  const tomorrow = addDaysLocal(today, 1);
  const sunday = nextSundayOnOrAfter(tomorrow);
  const saturday = addDaysLocal(sunday, 6);
  return { startDate: toDateString(sunday), endDate: toDateString(saturday) };
}

export function initialHistoricalRange(): {
  startDate: string;
  endDate: string;
} {
  // Most recent fully completed Sun–Sat week (ends on or before yesterday)
  const today = startOfLocalDay(new Date());
  const yesterday = addDaysLocal(today, -1);

  // Sunday on or after yesterday → step back 1 day = last Saturday
  const nextSunFromYesterday = nextSundayOnOrAfter(yesterday);
  const lastSaturday = addDaysLocal(nextSunFromYesterday, -1);
  const lastSunday = addDaysLocal(lastSaturday, -6);

  return {
    startDate: toDateString(lastSunday),
    endDate: toDateString(lastSaturday),
  };
}

export function moveRangeByWeeksGuarded(
  currentStartDate: string,
  weeksDelta: number
): { startDate: string; endDate: string; moved: boolean } {
  const today = startOfLocalDay(new Date());
  const currentStart = parseDateString(currentStartDate);
  const candidateStart = addDaysLocal(currentStart, weeksDelta * 7);
  if (candidateStart <= today) {
    const currentEnd = addDaysLocal(currentStart, 6);
    return {
      startDate: toDateString(currentStart),
      endDate: toDateString(currentEnd),
      moved: false,
    };
  }
  const candidateEnd = addDaysLocal(candidateStart, 6);
  return {
    startDate: toDateString(candidateStart),
    endDate: toDateString(candidateEnd),
    moved: true,
  };
}

export function planHistoricalWeekMove(
  currentStartDate: string,
  weeksDelta: number
): {
  nextStartDate: string;
  nextEndDate: string;
  canMove: boolean;
} {
  const todayStart = startOfLocalDay(new Date());
  const maxAllowedEnd = addDaysLocal(todayStart, -1);

  const currentStart = startOfLocalDay(parseDateString(currentStartDate));
  const candidateStart = addDaysLocal(currentStart, weeksDelta * 7);
  const candidateEnd = addDaysLocal(candidateStart, 6);

  const canMove = candidateEnd <= maxAllowedEnd;

  return {
    nextStartDate: toDateString(candidateStart),
    nextEndDate: toDateString(candidateEnd),
    canMove,
  };
}

export function canMoveBackOneWeek(currentStartDate: string): boolean {
  const today = startOfLocalDay(new Date());
  const previousStart = addDaysLocal(parseDateString(currentStartDate), -7);
  return previousStart > today;
}
export function canMoveForwardOneWeek(currentEndDate: string): boolean {
  const todayStart = startOfLocalDay(new Date());
  const yesterdayStart = addDaysLocal(todayStart, -1);

  const currentEnd = startOfLocalDay(parseDateString(currentEndDate)); // current Sat
  const nextStart = addDaysLocal(currentEnd, 1); // next Sun
  const nextEnd = addDaysLocal(nextStart, 6); // next Sat

  // allow only if the *entire* next week is in the past (ends ≤ yesterday)
  return nextEnd <= yesterdayStart;
}

export const toNumberOrZero = (
  value: number | string | null | undefined
): number => {
  const numeric =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  return Number.isFinite(numeric) ? numeric : 0;
};

export function mapPointsToLineData(
  points: HistoricalPoint[],
  key: MetricKey
): LineGraphDatum[] {
  return points.map((point) => ({
    label: point.date,
    value: toNumberOrZero(point[key]),
  }));
}

export function sortByDateAscending(
  points: HistoricalPoint[]
): HistoricalPoint[] {
  return [...points].sort((a, b) => a.date.localeCompare(b.date));
}
type StackedDayWithDate = StackedDay & {
  isoDate?: string;
  date?: string;
  iso?: string;
};
export function sundayFirst(days: StackedDay[]): StackedDay[] {
  if (!Array.isArray(days) || days.length === 0) {
    return days;
  }

  const getIsoDate = (stackedDay: StackedDayWithDate): string | null => {
    if (typeof stackedDay.isoDate === "string") {
      return stackedDay.isoDate;
    }
    if (typeof stackedDay.date === "string") {
      return stackedDay.date;
    }
    if (typeof stackedDay.iso === "string") {
      return stackedDay.iso;
    }
    return null;
  };

  const sundayStartIndex = days.findIndex((stackedDay) => {
    const isoDate = getIsoDate(stackedDay as StackedDayWithDate);
    return isoDate ? DateTime.fromISO(isoDate).weekday === 7 : false;
  });

  if (sundayStartIndex === -1) {
    return days;
  }
  if (days.length === 7) {
    return [
      ...days.slice(sundayStartIndex),
      ...days.slice(0, sundayStartIndex),
    ];
  }
  return days;
}

export const barChartMargin = { top: 12, right: 0, left: 0, bottom: 4 };

export function formatTooltipLabelFromPayloadStrict(
  currentLabel: string | number,
  payloadItems: ReadonlyArray<TooltipRowPayload> | undefined
): string {
  const payloadArray: ReadonlyArray<TooltipRowPayload> = Array.isArray(
    payloadItems
  )
    ? payloadItems
    : [];
  const firstPayloadItem: TooltipRowPayload | undefined = payloadArray[0];
  const isoDateString: string | undefined = firstPayloadItem?.payload?.date;

  if (typeof isoDateString === "string") {
    const formattedLabel: string =
      DateTime.fromISO(isoDateString).toFormat("cccc, LLL d, yyyy");
    return formattedLabel;
  }

  const fallbackLabel: string = String(currentLabel);
  return fallbackLabel;
}
