import { LocationInput } from "@/types/form-types";
import { SegmentDistance } from "@/types/types";
import { segmentsEqual, toDistanceRef } from "./helper";

export const buildDefaultSegments = (): SegmentDistance[] => [
  { label: "Office → Starting", distance: null, duration: null },
  { label: "Starting → Ending", distance: null, duration: null },
  { label: "Ending → Office", distance: null, duration: null },
];

export function getMiddleRefs(locations: LocationInput[]): string[] {
  return locations
    .map((location) => toDistanceRef(location.address))
    .filter((ref): ref is string => Boolean(ref));
}

export function getEmptySegments(
  originRef: string | null,
  middles: string[]
): SegmentDistance[] | null {
  if (!originRef) {
    return buildDefaultSegments();
  }
  if (middles.length === 0) {
    return buildDefaultSegments();
  }
  return null;
}

export function hopLabel(i: number, count: number): string {
  if (i === 0) return count === 2 ? "Pickup → Dropoff" : "Pickup → Stop 1";
  if (i === count - 2) return `Stop ${i} → Dropoff`;
  return `Stop ${i} → Stop ${i + 1}`;
}

export async function computeSegmentDistances(
  originRef: string,
  middles: string[],
  fetchDistance: (args: { origin: string; destination: string }) => Promise<{
    distanceMiles?: number | null;
    durationMinutes?: number | null;
  }>,
  signal?: AbortSignal
): Promise<SegmentDistance[]> {
  const check = () => {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  };

  const legs: SegmentDistance[] = [];

  check();
  const rStart = await fetchDistance({
    origin: originRef,
    destination: middles[0],
  });
  legs.push({
    label: "Office → Pickup",
    distance: rStart.distanceMiles ?? null,
    duration:
      rStart.durationMinutes != null ? rStart.durationMinutes / 60 : null,
  });

  const count = middles.length;
  for (let i = 0; i < count - 1; i++) {
    check();
    const r = await fetchDistance({
      origin: middles[i],
      destination: middles[i + 1],
    });
    legs.push({
      label: hopLabel(i, count),
      distance: r.distanceMiles ?? null,
      duration: r.durationMinutes != null ? r.durationMinutes / 60 : null,
    });
  }

  check();
  const rEnd = await fetchDistance({
    origin: middles[count - 1],
    destination: originRef,
  });
  legs.push({
    label: "Dropoff → Office",
    distance: rEnd.distanceMiles ?? null,
    duration: rEnd.durationMinutes != null ? rEnd.durationMinutes / 60 : null,
  });

  return legs;
}

export async function updateSegmentDistances(
  originRef: string,
  middles: string[],
  fetchDistance: (args: { origin: string; destination: string }) => Promise<{
    distanceMiles?: number | null;
    durationMinutes?: number | null;
  }>,
  setSegmentDistances: React.Dispatch<React.SetStateAction<SegmentDistance[]>>,
  signal?: AbortSignal
) {
  try {
    const legs = await computeSegmentDistances(
      originRef,
      middles,
      fetchDistance,
      signal
    );
    setSegmentDistances((prev) => (segmentsEqual(prev, legs) ? prev : legs));
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return;
    }
    console.error("Failed to update segment distances:", err);
  }
}
