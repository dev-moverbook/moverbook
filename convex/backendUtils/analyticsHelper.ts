import { ForecastPoint, MoveAnalyticsPoint } from "@/types/types";
import { Doc } from "../_generated/dataModel";
import { enumerateDaysInclusive, toIsoDateInTimeZone } from "./helper";
import { computeMoveTotal } from "@/app/frontendUtils/helper";

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
