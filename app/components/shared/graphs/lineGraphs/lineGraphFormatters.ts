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
  if (desiredCount <= 0) {
    return [];
  }
  if (desiredCount >= items.length) {
    return items.slice();
  }

  const indexStep = (items.length - 1) / (desiredCount - 1);

  return Array.from({ length: desiredCount }, (_, i) => {
    const index = Math.round(i * indexStep);
    return items[index];
  });
}

export function isNarrowScreen(maxWidth = 480): boolean {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }
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
