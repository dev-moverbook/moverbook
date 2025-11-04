import type { Dispatch, SetStateAction } from "react";
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
    .filter((reference): reference is string => Boolean(reference));
}

export function getEmptySegments(
  originReference: string | null,
  middleReferences: string[]
): SegmentDistance[] | null {
  if (!originReference) {
    return buildDefaultSegments();
  }

  if (middleReferences.length === 0) {
    return buildDefaultSegments();
  }

  return null;
}

export function hopLabel(hopIndex: number, hopCount: number): string {
  if (hopIndex === 0) {
    return hopCount === 2 ? "Pickup → Dropoff" : "Pickup → Stop 1";
  }

  if (hopIndex === hopCount - 2) {
    return `Stop ${hopIndex} → Dropoff`;
  }

  return `Stop ${hopIndex} → Stop ${hopIndex + 1}`;
}

export async function computeSegmentDistances(
  originReference: string,
  middleReferences: string[],
  fetchDistance: (args: { origin: string; destination: string }) => Promise<{
    distanceMiles?: number | null;
    durationMinutes?: number | null;
  }>
): Promise<SegmentDistance[]> {
  console.log("computeSegmentDistances originReference", originReference);

  const segments: SegmentDistance[] = [];

  const startLegResponse = await fetchDistance({
    origin: originReference,
    destination: middleReferences[0],
  });

  console.log("startLegResponse", startLegResponse);

  segments.push({
    label: "Office → Pickup",
    distance: startLegResponse.distanceMiles ?? null,
    duration:
      startLegResponse.durationMinutes != null
        ? startLegResponse.durationMinutes
        : null,
  });

  const middleCount = middleReferences.length;

  for (let hopIndex = 0; hopIndex < middleCount - 1; hopIndex++) {
    const legResponse = await fetchDistance({
      origin: middleReferences[hopIndex],
      destination: middleReferences[hopIndex + 1],
    });

    segments.push({
      label: hopLabel(hopIndex, middleCount),
      distance: legResponse.distanceMiles ?? null,
      duration:
        legResponse.durationMinutes != null
          ? legResponse.durationMinutes
          : null,
    });
  }

  const endLegResponse = await fetchDistance({
    origin: middleReferences[middleCount - 1],
    destination: originReference,
  });

  segments.push({
    label: "Dropoff → Office",
    distance: endLegResponse.distanceMiles ?? null,
    duration:
      endLegResponse.durationMinutes != null
        ? endLegResponse.durationMinutes
        : null,
  });

  return segments;
}

export async function updateSegmentDistances(
  originReference: string,
  middleReferences: string[],
  fetchDistance: (args: { origin: string; destination: string }) => Promise<{
    distanceMiles?: number | null;
    durationMinutes?: number | null;
  }>,
  setSegmentDistances: Dispatch<SetStateAction<SegmentDistance[]>>
) {
  if (!fetchDistance) {
    return;
  }

  try {
    const computedSegments = await computeSegmentDistances(
      originReference,
      middleReferences,
      fetchDistance
    );

    setSegmentDistances((previousSegments) =>
      segmentsEqual(previousSegments, computedSegments)
        ? previousSegments
        : computedSegments
    );
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return;
    }

    console.error("Failed to update segment distances:", error);
  }
}
