import {
  ForecastPoint,
  MoveAnalyticsPoint,
  StackedDay,
  TooltipRow,
  RechartsTooltipProps,
  TooltipPayloadItem,
} from "@/types/types";
import { Doc, Id } from "../_generated/dataModel";
import { enumerateDaysInclusive, toIsoDateInTimeZone } from "./helper";
import { computeMoveTotal } from "@/app/frontendUtils/helper";
import { UNKNOWN_NAME } from "@/types/const";
import { StackedSegment } from "@/types/types";

function inferHoursFromTimestamps(
  startTimestamp: number,
  endTimestamp: number,
  breakAmount: number | null | undefined
): number | null {
  if (typeof startTimestamp !== "number" || typeof endTimestamp !== "number") {
    return null;
  }
  const rawDuration = endTimestamp - startTimestamp - (breakAmount ?? 0);
  if (!Number.isFinite(rawDuration) || rawDuration <= 0) {
    return null;
  }
  const usesMilliseconds =
    Math.max(startTimestamp, endTimestamp) > 10_000_000_000;
  const hoursDivisor = usesMilliseconds ? 3_600_000 : 3_600;
  return rawDuration / hoursDivisor;
}

export function computeActualMoveDurationHours(
  move: Doc<"move">
): number | null {
  const startTimestamp = move.actualStartTime ?? null;
  const endTimestamp = move.actualEndTime ?? null;
  const breakAmount = move.actualBreakTime ?? 0;

  if (startTimestamp == null || endTimestamp == null) {
    return null;
  }
  return inferHoursFromTimestamps(startTimestamp, endTimestamp, breakAmount);
}

type DayAccumulator = {
  timeSampleCount: number;
  totalRevenueSum: number;
  totalMovesCount: number;
  totalTimeHoursSum: number;
};

function createEmptyAccumulator(): DayAccumulator {
  return {
    timeSampleCount: 0,
    totalRevenueSum: 0,
    totalMovesCount: 0,
    totalTimeHoursSum: 0,
  };
}

function initializeAggregatesByDay(
  dateKeys: string[]
): Record<string, DayAccumulator> {
  const aggregates: Record<string, DayAccumulator> = {};
  for (const dateKey of dateKeys) {
    aggregates[dateKey] = createEmptyAccumulator();
  }
  return aggregates;
}

function getBucketDayForMove(
  move: Doc<"move">,
  timeZone: string
): string | null {
  if (!move.moveDate) {
    return null;
  }
  const bucketDay = toIsoDateInTimeZone(move.moveDate, timeZone);
  return bucketDay;
}

function updateAggregatesForMove(
  aggregatesByDay: Record<string, DayAccumulator>,
  move: Doc<"move">,
  timeZone: string
): void {
  const bucketDay = getBucketDayForMove(move, timeZone);
  if (!bucketDay) {
    return;
  }
  if (!aggregatesByDay[bucketDay]) {
    aggregatesByDay[bucketDay] = createEmptyAccumulator();
  }
  const depositAmount = Number(move.deposit ?? 0);
  const invoicePaidAmount = Number(move.invoiceAmountPaid ?? 0);
  const totalRevenueForMove = depositAmount + invoicePaidAmount;
  aggregatesByDay[bucketDay].totalRevenueSum += totalRevenueForMove;
  aggregatesByDay[bucketDay].totalMovesCount += 1;
  const moveDurationHours = computeActualMoveDurationHours(move);
  if (
    typeof moveDurationHours !== "number" ||
    !Number.isFinite(moveDurationHours)
  ) {
    return;
  }
  aggregatesByDay[bucketDay].totalTimeHoursSum += moveDurationHours;
  aggregatesByDay[bucketDay].timeSampleCount += 1;
}

function computePointFromStats(
  dateKey: string,
  stats: DayAccumulator
): MoveAnalyticsPoint {
  const averageRevenue =
    stats.totalMovesCount > 0
      ? stats.totalRevenueSum / stats.totalMovesCount
      : 0;
  const averageMoveTimeHours =
    stats.timeSampleCount > 0
      ? stats.totalTimeHoursSum / stats.timeSampleCount
      : 0;
  return {
    averageMoveTimeHours,
    averageRevenue,
    count: stats.totalMovesCount,
    date: dateKey,
  };
}

export function buildDailyAveragesSeries(
  endDay: string,
  moves: Doc<"move">[],
  startDay: string,
  timeZone: string
): MoveAnalyticsPoint[] {
  const seededDates = enumerateDaysInclusive(startDay, endDay);
  const aggregatesByDay = initializeAggregatesByDay(seededDates);
  for (const move of moves) {
    updateAggregatesForMove(aggregatesByDay, move, timeZone);
  }
  const series = Object.keys(aggregatesByDay)
    .sort()
    .map((dateKey) => computePointFromStats(dateKey, aggregatesByDay[dateKey]));
  return series;
}

function forecastMinTotalForMove(move: Doc<"move">): number {
  const { minTotal } = computeMoveTotal({
    endingMoveTime: move.endingMoveTime ?? null,
    jobType: move.jobType,
    jobTypeRate: move.jobTypeRate ?? null,
    liabilityCoverage: move.liabilityCoverage
      ? { premium: move.liabilityCoverage.premium }
      : null,
    moveFees: move.moveFees.map((feeLine) => ({
      name: feeLine.name,
      price: feeLine.price,
      quantity: feeLine.quantity,
    })),
    segmentDistances: move.segmentDistances,
    startingMoveTime: move.startingMoveTime ?? null,
    travelFeeMethod: move.travelFeeMethod ?? null,
    travelFeeRate: move.travelFeeRate ?? null,
  });
  return Number.isFinite(minTotal) ? minTotal : 0;
}

function seedRevenueMapForDates(dateKeys: string[]): Record<string, number> {
  const revenueByDayMap: Record<string, number> = {};
  for (const dateKey of dateKeys) {
    revenueByDayMap[dateKey] = 0;
  }
  return revenueByDayMap;
}

function addForecastRevenueForMove(
  moveRecord: Doc<"move">,
  revenueByDayMap: Record<string, number>,
  timeZone: string
): void {
  if (!moveRecord.moveDate) {
    return;
  }
  const bucketDay = toIsoDateInTimeZone(moveRecord.moveDate, timeZone);
  const previousTotal = revenueByDayMap[bucketDay] ?? 0;
  const moveForecast = forecastMinTotalForMove(moveRecord);
  revenueByDayMap[bucketDay] = previousTotal + moveForecast;
  return;
}

function convertRevenueMapToSeries(
  revenueByDayMap: Record<string, number>
): ForecastPoint[] {
  const sortedDates = Object.keys(revenueByDayMap).sort();
  const series = sortedDates.map((dateKey) => ({
    date: dateKey,
    revenue: revenueByDayMap[dateKey],
  }));
  return series;
}

export function buildForecastedSeries(
  endDay: string,
  moves: Doc<"move">[],
  startDay: string,
  timeZone: string
): ForecastPoint[] {
  const dateKeys = enumerateDaysInclusive(startDay, endDay);
  const revenueByDayMap = seedRevenueMapForDates(dateKeys);
  for (const moveRecord of moves) {
    addForecastRevenueForMove(moveRecord, revenueByDayMap, timeZone);
  }
  const series = convertRevenueMapToSeries(revenueByDayMap);
  return series;
}

export type IdNameReferral = { id: Id<"referrals">; name: string };

export function toIdNameReferrals(
  referralDocs: Doc<"referrals">[]
): IdNameReferral[] {
  return referralDocs
    .map((referralDoc) => ({
      id: referralDoc._id as Id<"referrals">,
      name: (referralDoc.name ?? "Unknown").trim(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export type IdNameUser = { id: Id<"users">; name: string };

export function toIdNameUsers(userDocs: Doc<"users">[]): IdNameUser[] {
  return userDocs
    .map((userDoc) => ({
      id: userDoc._id as Id<"users">,
      name: (userDoc.name ?? "Unknown").trim(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export type IdNameGeneric<GroupId extends string> = {
  id: GroupId;
  name: string;
};

function seedDayTotals(
  dateKeys: string[]
): Record<string, Record<string, number>> {
  const sumsByDay: Record<string, Record<string, number>> = {};
  for (const dateKey of dateKeys) sumsByDay[dateKey] = {};
  return sumsByDay;
}

function sortGroupsByName<GroupId extends string>(
  groups: IdNameGeneric<GroupId>[]
): IdNameGeneric<GroupId>[] {
  return groups.slice().sort((a, b) => a.name.localeCompare(b.name));
}

function addMoveToTotalsByName(
  move: Doc<"move">,
  timeZone: string,
  sumsByDay: Record<string, Record<string, number>>,
  getGroupName: (move: Doc<"move">) => string | null | undefined
): boolean {
  if (!move.moveDate) {
    return false;
  }

  const dayKey = toIsoDateInTimeZone(move.moveDate, timeZone);
  if (!(dayKey in sumsByDay)) {
    return false;
  }

  const rawName = getGroupName(move);
  const bucketName = (rawName ?? UNKNOWN_NAME).trim() || UNKNOWN_NAME;

  const amount = forecastMinTotalForMove(move);
  const dayTotals = sumsByDay[dayKey];
  dayTotals[bucketName] = (dayTotals[bucketName] ?? 0) + amount;

  return rawName == null;
}

function buildSegmentsForDay(
  orderedNames: string[],
  dayTotals: Record<string, number>,
  includeUnknown: boolean
): StackedSegment[] {
  const segs: StackedSegment[] = [];

  for (const name of orderedNames) {
    segs.push({ name, amount: dayTotals[name] ?? 0 });
  }

  if (includeUnknown) {
    segs.push({ name: UNKNOWN_NAME, amount: dayTotals[UNKNOWN_NAME] ?? 0 });
  }

  return segs;
}

function sortNames(names: string[]): string[] {
  return names.slice().sort((a, b) => a.localeCompare(b));
}

export function buildStackedForecastedRevenueSeriesByName(
  endDay: string,
  moves: Doc<"move">[],
  groupNames: string[], // e.g. reps.map(r => r.name) or sources.map(s => s.name)
  startDay: string,
  timeZone: string,
  getGroupName: (move: Doc<"move">) => string | null | undefined // how to pull the name from a move
): StackedDay[] {
  const dateKeys = enumerateDaysInclusive(startDay, endDay);
  const sumsByDay = seedDayTotals(dateKeys);
  const orderedNames = sortNames(groupNames);

  let sawUnknown = false;
  for (const move of moves) {
    const wasUnknown = addMoveToTotalsByName(
      move,
      timeZone,
      sumsByDay,
      getGroupName
    );
    if (wasUnknown) sawUnknown = true;
  }

  const series: StackedDay[] = [];
  for (const dateKey of dateKeys) {
    series.push({
      date: dateKey,
      segments: buildSegmentsForDay(
        orderedNames,
        sumsByDay[dateKey],
        sawUnknown
      ),
    });
  }
  return series;
}

function historicalRevenueForMove(move: Doc<"move">): number {
  const depositAmount = Number(move.deposit ?? 0);
  const invoicePaidAmount = Number(move.invoiceAmountPaid ?? 0);
  const sum = depositAmount + invoicePaidAmount;
  return Number.isFinite(sum) && sum > 0 ? sum : 0;
}

function addHistoricalMoveTotalsByName(
  move: Doc<"move">,
  timeZone: string,
  sumsByDay: Record<string, Record<string, number>>,
  getGroupName: (move: Doc<"move">) => string | null | undefined
): boolean {
  if (!move.moveDate) {
    return false;
  }

  const dayKey = toIsoDateInTimeZone(move.moveDate, timeZone);
  if (!(dayKey in sumsByDay)) {
    return false;
  }

  const rawName = getGroupName(move);
  const bucketName = (rawName ?? UNKNOWN_NAME).trim() || UNKNOWN_NAME;

  const amount = historicalRevenueForMove(move);
  const dayTotals = sumsByDay[dayKey];
  dayTotals[bucketName] = (dayTotals[bucketName] ?? 0) + amount;

  return rawName == null; // indicates we used "Unknown"
}

export function buildStackedHistoricalRevenueSeriesByName(
  endDay: string,
  moves: Doc<"move">[],
  groupNames: string[], // legend/order (e.g., reps.map(r => r.name ?? UNKNOWN_NAME))
  startDay: string,
  timeZone: string,
  getGroupName: (move: Doc<"move">) => string | null | undefined // must return a NAME, not an ID
): StackedDay[] {
  // 1) Setup
  const dateKeys = enumerateDaysInclusive(startDay, endDay);
  const sumsByDay = seedDayTotals(dateKeys);
  const orderedNames = sortNames(groupNames);

  // 2) Accumulate
  let sawUnknown = false;
  for (const move of moves) {
    const usedUnknown = addHistoricalMoveTotalsByName(
      move,
      timeZone,
      sumsByDay,
      getGroupName
    );
    if (usedUnknown) sawUnknown = true;
  }

  // 3) Build series
  const series: StackedDay[] = [];
  for (const dateKey of dateKeys) {
    const dayTotals = sumsByDay[dateKey];
    const segments = buildSegmentsForDay(orderedNames, dayTotals, sawUnknown);
    series.push({ date: dateKey, segments });
  }

  return series;
}

export function buildTooltipRows(
  payload: RechartsTooltipProps["payload"]
): TooltipRow[] {
  if (!payload || payload.length === 0) {
    return [];
  }
  const rows: TooltipRow[] = payload
    .filter(
      (item): item is TooltipPayloadItem & { value: number } =>
        typeof item.value === "number"
    )
    .map((item) => ({
      name: String(item.name ?? item.dataKey ?? ""),
      value: item.value,
      color: typeof item.color === "string" ? item.color : "#ffffff",
    }))
    .sort((left, right) => right.value - left.value);
  return rows;
}

export function defaultValueFormat(value: number): string {
  return value.toLocaleString();
}

export function defaultLabelFromIso(isoDate: string): string {
  const dateObj = new Date(isoDate);
  const weekday = dateObj.toLocaleDateString(undefined, { weekday: "short" });
  return weekday.slice(0, 1);
}

export function isStackedSeriesEmpty(
  series: StackedDay[] | null | undefined
): boolean {
  if (!Array.isArray(series) || series.length === 0) {
    return true;
  }
  return series.every((day) =>
    day.segments.every(
      (segment) =>
        typeof segment.amount !== "number" || Number.isNaN(segment.amount)
    )
  );
}
