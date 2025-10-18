import { LineSeries } from "@/types/types";

export function defaultValueFormatter(value: number): string {
  return value.toLocaleString();
}

export function defaultLabelFormatter(label: string | number): string {
  const asDate = new Date(String(label));
  if (!Number.isNaN(asDate.getTime())) {
    return asDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }
  return String(label);
}

export function pickEvenlySpaced<T>(items: T[], desiredCount: number): T[] {
  if (desiredCount <= 0) return [];
  if (desiredCount >= items.length) return items.slice();

  const indexStep = (items.length - 1) / (desiredCount - 1);
  return Array.from(
    { length: desiredCount },
    (_, i) => items[Math.round(i * indexStep)]
  );
}

export function isNarrowScreen(maxWidth = 480): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function")
    return false;
  return window.matchMedia(`(max-width: ${maxWidth}px)`).matches;
}

export function getCategoryTicksFromLabels(
  labels: Array<string | number>,
  options?: { maxWidth?: number; narrowCount?: number }
): Array<string | number> {
  const { maxWidth = 480, narrowCount = 3 } = options ?? {};
  const desired = isNarrowScreen(maxWidth) ? narrowCount : labels.length;
  return pickEvenlySpaced(labels, desired);
}

type MergedRow = {
  label: string | number;
} & { [seriesId: string]: number | null | string };

export function mergeSeriesByLabel(seriesList: LineSeries[]): {
  labels: Array<string | number>;
  rows: MergedRow[];
} {
  const labelOrder = new Map<string | number, number>();
  let nextIndex = 0;

  const rowByLabel = new Map<string | number, MergedRow>();

  for (const seriesItem of seriesList) {
    for (const dataPoint of seriesItem.data ?? []) {
      const labelValue = dataPoint.label;

      if (!labelOrder.has(labelValue)) {
        labelOrder.set(labelValue, nextIndex++);
      }

      let row = rowByLabel.get(labelValue);
      if (!row) {
        row = { label: labelValue };
        rowByLabel.set(labelValue, row);
      }

      row[seriesItem.id] = dataPoint.value;
    }
  }

  const labels = Array.from(labelOrder.keys()).sort(
    (a, b) => (labelOrder.get(a) ?? 0) - (labelOrder.get(b) ?? 0)
  );

  const rows: MergedRow[] = labels.map((labelValue) => {
    const row = rowByLabel.get(labelValue) ?? { label: labelValue };
    for (const seriesItem of seriesList) {
      if (row[seriesItem.id] === undefined) {
        row[seriesItem.id] = null;
      }
    }
    return row;
  });

  return { labels, rows };
}

export const DEFAULT_STROKES = [
  "#2563EB",
  "#22C55E",
  "#F97316",
  "#A855F7",
  "#06B6D4",
  "#EF4444",
];

export function isSeriesEmpty(
  seriesList: LineSeries[] | null | undefined
): boolean {
  if (!Array.isArray(seriesList) || seriesList.length === 0) return true;
  for (const line of seriesList) {
    if (Array.isArray(line.data) && line.data.length > 0) return false;
  }
  return true;
}

export const makeYAxisTickFormatter =
  (formatValue: (value: number) => string, { hideFirstZero = true } = {}) =>
  (tickValue: number, tickIndex: number) =>
    hideFirstZero && tickIndex === 0 && tickValue === 0
      ? ""
      : formatValue(tickValue);

export function seriesHasSignal(
  lineSeriesList: LineSeries[],
  minimumThreshold = 0
): boolean {
  return lineSeriesList.some((lineSeries) =>
    (lineSeries.data ?? []).some(
      (dataPoint) => (dataPoint.value ?? 0) > minimumThreshold
    )
  );
}
