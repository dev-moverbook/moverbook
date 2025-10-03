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

export function collectSegmentNames(series: StackedDay[]): string[] {
  const nameSet = new Set<string>();
  for (const day of series) {
    for (const segment of day.segments) {
      nameSet.add(segment.name);
    }
  }
  return Array.from(nameSet).sort((left, right) => left.localeCompare(right));
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

export function buildDistinctPalette(
  desiredCount: number,
  options?: {
    saturation?: number;
    lightness?: number;
    startHue?: number;
    hueStep?: number;
    alternateLightness?: number;
  }
): string[] {
  const saturation = options?.saturation ?? 85;
  const lightness = options?.lightness ?? 56;
  const startHue = options?.startHue ?? 10;
  const hueStep = options?.hueStep ?? 137.508;
  const alternateLightness = options?.alternateLightness ?? 48;
  const colors: string[] = [];
  let currentHue = startHue;
  for (let indexNumber = 0; indexNumber < desiredCount; indexNumber++) {
    const useAlternate = indexNumber % 2 === 1;
    const chosenLightness = useAlternate ? alternateLightness : lightness;
    colors.push(
      hslToHex(((currentHue % 360) + 360) % 360, saturation, chosenLightness)
    );
    currentHue += hueStep;
  }
  return maximizeAdjacentContrast(colors);
}

export function maximizeAdjacentContrast(inputColors: string[]): string[] {
  if (inputColors.length <= 2) return inputColors.slice();
  const hueOf = (hexColor: string) => {
    const red = parseInt(hexColor.slice(1, 3), 16) / 255;
    const green = parseInt(hexColor.slice(3, 5), 16) / 255;
    const blue = parseInt(hexColor.slice(5, 7), 16) / 255;
    const maxValue = Math.max(red, green, blue);
    const minValue = Math.min(red, green, blue);
    const delta = maxValue - minValue;
    let hue = 0;
    if (delta !== 0) {
      if (maxValue === red) hue = ((green - blue) / delta) % 6;
      else if (maxValue === green) hue = (blue - red) / delta + 2;
      else hue = (red - green) / delta + 4;
    }
    hue *= 60;
    if (hue < 0) hue += 360;
    return hue;
  };
  const sorted = inputColors.slice().sort((a, b) => hueOf(a) - hueOf(b));
  const result: string[] = [];
  let leftIndex = 0;
  let rightIndex = sorted.length - 1;
  while (leftIndex <= rightIndex) {
    result.push(sorted[leftIndex]);
    if (leftIndex !== rightIndex) result.push(sorted[rightIndex]);
    leftIndex += 1;
    rightIndex -= 1;
  }
  return result;
}

export const DEFAULT_PALETTE: string[] = [
  "#22D3EE",
  "#F59E0B",
  "#10B981",
  "#8B5CF6",
  "#EF4444",
  "#14B8A6",
  "#EAB308",
  "#3B82F6",
  "#EC4899",
  "#84CC16",
  "#FB923C",
  "#06B6D4",
  "#A855F7",
  "#DC2626",
  "#0EA5E9",
  "#F43F5E",
];

export function ensurePaletteLength(
  basePalette: string[],
  requiredLength: number
): string[] {
  if (requiredLength <= basePalette.length)
    return basePalette.slice(0, requiredLength);
  const additionalCount = requiredLength - basePalette.length;
  const generated = buildDistinctPalette(additionalCount, {
    startHue: 23,
    hueStep: 137.508,
    saturation: 86,
    lightness: 55,
    alternateLightness: 47,
  });
  const combined = basePalette.concat(generated);
  return maximizeAdjacentContrast(combined).slice(0, requiredLength);
}

export type NeonVariationOptions = {
  hueShiftPerCycle?: number;
  saturationDeltaPerCycle?: number;
  lightnessDeltaPerCycle?: number;
  startHue?: number;
  baseNeonCount?: number;
  baseSaturation?: number;
  baseLightness?: number;
};

export function generateNeonBasePalette(
  neonCount: number,
  startHue: number,
  baseSaturation: number,
  baseLightness: number
): string[] {
  const hues: number[] = [];
  let hue = startHue;
  const hueStep = 360 / neonCount;
  for (let indexNumber = 0; indexNumber < neonCount; indexNumber++) {
    hues.push(((hue % 360) + 360) % 360);
    hue += hueStep;
  }
  return hues.map((h) => hslToHex(h, baseSaturation, baseLightness));
}

export function adjustNeonColor(
  hexColor: string,
  cycleIndex: number,
  options: NeonVariationOptions
): string {
  const hueShift = options.hueShiftPerCycle ?? 8;
  const saturationDelta = options.saturationDeltaPerCycle ?? -4;
  const lightnessDelta = options.lightnessDeltaPerCycle ?? -3;
  const baseSaturation = options.baseSaturation ?? 100;
  const baseLightness = options.baseLightness ?? 56;
  const adjustedHue =
    (((hexToHue(hexColor) + hueShift * cycleIndex) % 360) + 360) % 360;
  const adjustedSaturation = clamp(
    baseSaturation + saturationDelta * cycleIndex,
    70,
    100
  );
  const adjustedLightness = clamp(
    baseLightness + lightnessDelta * cycleIndex,
    42,
    70
  );
  return hslToHex(adjustedHue, adjustedSaturation, adjustedLightness);
}

export function hexToHue(hexColor: string): number {
  const red = parseInt(hexColor.slice(1, 3), 16) / 255;
  const green = parseInt(hexColor.slice(3, 5), 16) / 255;
  const blue = parseInt(hexColor.slice(5, 7), 16) / 255;
  const maxValue = Math.max(red, green, blue);
  const minValue = Math.min(red, green, blue);
  const delta = maxValue - minValue;
  let hue = 0;
  if (delta !== 0) {
    if (maxValue === red) hue = ((green - blue) / delta) % 6;
    else if (maxValue === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
  }
  hue *= 60;
  if (hue < 0) hue += 360;
  return hue;
}

export function buildNeonPalette(
  requiredCount: number,
  options?: NeonVariationOptions
): string[] {
  const baseNeonCount = options?.baseNeonCount ?? 12;
  const startHue = options?.startHue ?? 0;
  const baseSaturation = options?.baseSaturation ?? 100;
  const baseLightness = options?.baseLightness ?? 56;
  const basePalette = generateNeonBasePalette(
    baseNeonCount,
    startHue,
    baseSaturation,
    baseLightness
  );
  if (requiredCount <= basePalette.length)
    return basePalette.slice(0, requiredCount);
  const result: string[] = [];
  const cyclesNeeded = Math.ceil(requiredCount / basePalette.length);
  for (let cycleIndex = 0; cycleIndex < cyclesNeeded; cycleIndex++) {
    const adjustedCycle =
      cycleIndex === 0
        ? basePalette
        : basePalette.map((hex) =>
            adjustNeonColor(hex, cycleIndex, {
              ...options,
              baseSaturation,
              baseLightness,
            })
          );
    for (const colorHex of adjustedCycle) {
      result.push(colorHex);
      if (result.length === requiredCount) return result;
    }
  }
  return result.slice(0, requiredCount);
}

export type NeonCycleOptions = {
  hueShiftPerCycle?: number;
  saturationDeltaPerCycle?: number;
  lightnessDeltaPerCycle?: number;
  perIndexHueJitter?: number;
  minSaturation?: number;
  maxSaturation?: number;
  minLightness?: number;
  maxLightness?: number;
};

export const BASE_NEON_PALETTE: string[] = [
  "#0072B2", // blue
  "#E69F00", // orange
  "#009E73", // green
  "#CC79A7", // magenta
  "#D55E00", // vermillion
];

function clamp(value: number, minValue: number, maxValue: number): number {
  return Math.min(maxValue, Math.max(minValue, value));
}

function hexToHsl(hexColor: string): { h: number; s: number; l: number } {
  const red = parseInt(hexColor.slice(1, 3), 16) / 255;
  const green = parseInt(hexColor.slice(3, 5), 16) / 255;
  const blue = parseInt(hexColor.slice(5, 7), 16) / 255;
  const maxValue = Math.max(red, green, blue);
  const minValue = Math.min(red, green, blue);
  const lightness = (maxValue + minValue) / 2;
  const delta = maxValue - minValue;
  let hue = 0;
  let saturation = 0;
  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
    if (maxValue === red) hue = ((green - blue) / delta) % 6;
    else if (maxValue === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }
  return { h: hue, s: saturation * 100, l: lightness * 100 };
}

function hslToHex(hue: number, saturation: number, lightness: number): string {
  const s = saturation / 100;
  const l = lightness / 100;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const huePrime = hue / 60;
  const secondary = chroma * (1 - Math.abs((huePrime % 2) - 1));
  let red = 0;
  let green = 0;
  let blue = 0;
  if (0 <= huePrime && huePrime < 1) {
    red = chroma;
    green = secondary;
    blue = 0;
  } else if (1 <= huePrime && huePrime < 2) {
    red = secondary;
    green = chroma;
    blue = 0;
  } else if (2 <= huePrime && huePrime < 3) {
    red = 0;
    green = chroma;
    blue = secondary;
  } else if (3 <= huePrime && huePrime < 4) {
    red = 0;
    green = secondary;
    blue = chroma;
  } else if (4 <= huePrime && huePrime < 5) {
    red = secondary;
    green = 0;
    blue = chroma;
  } else {
    red = chroma;
    green = 0;
    blue = secondary;
  }
  const matchValue = l - chroma / 2;
  const r = Math.round((red + matchValue) * 255);
  const g = Math.round((green + matchValue) * 255);
  const b = Math.round((blue + matchValue) * 255);
  const toHex = (value: number) =>
    value.toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function shiftNeonColor(
  hexColor: string,
  cycleIndex: number,
  colorIndex: number,
  options?: NeonCycleOptions
): string {
  const base = hexToHsl(hexColor);
  const hueShiftPerCycle = options?.hueShiftPerCycle ?? 10;
  const perIndexHueJitter = options?.perIndexHueJitter ?? 2;
  const saturationDeltaPerCycle = options?.saturationDeltaPerCycle ?? -3;
  const lightnessDeltaPerCycle = options?.lightnessDeltaPerCycle ?? -2;
  const minSaturation = options?.minSaturation ?? 70;
  const maxSaturation = options?.maxSaturation ?? 100;
  const minLightness = options?.minLightness ?? 45;
  const maxLightness = options?.maxLightness ?? 70;

  const newHue =
    (((base.h +
      hueShiftPerCycle * cycleIndex +
      perIndexHueJitter * (colorIndex % 2 ? 1 : -1)) %
      360) +
      360) %
    360;
  const newSaturation = clamp(
    base.s + saturationDeltaPerCycle * cycleIndex,
    minSaturation,
    maxSaturation
  );
  const newLightness = clamp(
    base.l + lightnessDeltaPerCycle * cycleIndex,
    minLightness,
    maxLightness
  );

  return hslToHex(newHue, newSaturation, newLightness);
}

export function buildNeonPaletteFromBase(
  requiredCount: number,
  baseColors: string[] = BASE_NEON_PALETTE,
  options?: NeonCycleOptions
): string[] {
  if (requiredCount <= baseColors.length)
    return baseColors.slice(0, requiredCount);
  const result: string[] = [];
  const cyclesNeeded = Math.ceil(requiredCount / baseColors.length);
  for (let cycleIndex = 0; cycleIndex < cyclesNeeded; cycleIndex++) {
    const cycleColors =
      cycleIndex === 0
        ? baseColors
        : baseColors.map((hexColor, colorIndex) =>
            shiftNeonColor(hexColor, cycleIndex, colorIndex, options)
          );
    for (const colorHex of cycleColors) {
      result.push(colorHex);
      if (result.length === requiredCount) return result;
    }
  }
  return result.slice(0, requiredCount);
}

export function hashStringToIndex(input: string, modulus: number): number {
  let hashValue = 2166136261;
  for (let indexNumber = 0; indexNumber < input.length; indexNumber++) {
    hashValue ^= input.charCodeAt(indexNumber);
    hashValue +=
      (hashValue << 1) +
      (hashValue << 4) +
      (hashValue << 7) +
      (hashValue << 8) +
      (hashValue << 24);
  }
  const safeModulus = Math.max(1, modulus);
  return Math.abs(hashValue >>> 0) % safeModulus;
}

export function resolveColorMap(
  segmentNames: string[],
  overrideByName?: Record<string, string>,
  options?: NeonCycleOptions & { requiredCount?: number; baseColors?: string[] }
): Record<string, string> {
  const baseColors = options?.baseColors ?? BASE_NEON_PALETTE;
  const requiredCount = options?.requiredCount ?? segmentNames.length;
  const palette = buildNeonPaletteFromBase(requiredCount, baseColors, options);

  const colorMap: Record<string, string> = {};
  const usedIndices = new Set<number>();

  if (overrideByName) {
    for (const [name, color] of Object.entries(overrideByName)) {
      colorMap[name] = color;
      const paletteIndex = palette.indexOf(color);
      if (paletteIndex >= 0) usedIndices.add(paletteIndex);
    }
  }

  const sortedNames = [...segmentNames].sort((a, b) => a.localeCompare(b));

  for (const name of sortedNames) {
    if (colorMap[name]) continue;
    let paletteIndex = hashStringToIndex(name, palette.length);
    let attempts = 0;
    while (usedIndices.has(paletteIndex) && attempts < palette.length) {
      paletteIndex = (paletteIndex + 1) % palette.length;
      attempts += 1;
    }
    colorMap[name] = palette[paletteIndex];
    usedIndices.add(paletteIndex);
  }

  return colorMap;
}

export const AREA_TOP_OPACITY = 0.38;
export const AREA_MID_OPACITY = 0.18;
export const AREA_BOTTOM_OPACITY = 0.08;

export const ANIM_DURATION = 1200;
export const ANIM_EASING:
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "linear" = "ease-out";
