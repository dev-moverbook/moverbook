"use client";

import { useEffect } from "react";
import { toDistanceRef, segmentsEqual } from "../helper";
import { SegmentDistance } from "@/types/types";
import { AddressInput, LocationInput } from "@/types/form-types";
import { getEmptySegments, getMiddleRefs } from "../segmentDistanceHelper";
import { updateSegmentDistances } from "../segmentDistanceHelper";

export function useSegmentDistances(
  companyAddress: AddressInput | null | undefined,
  locations: LocationInput[],
  fetchDistance: (args: { origin: string; destination: string }) => Promise<{
    distanceMiles?: number | null;
    durationMinutes?: number | null;
  }>,
  setSegmentDistances: React.Dispatch<React.SetStateAction<SegmentDistance[]>>
) {
  useEffect(() => {
    const originRef = toDistanceRef(companyAddress);
    const middles = getMiddleRefs(locations);
    const empty = getEmptySegments(originRef, middles);

    if (empty) {
      setSegmentDistances((prev) =>
        segmentsEqual(prev, empty) ? prev : empty
      );
      return;
    }
    if (!originRef) return;

    updateSegmentDistances(
      originRef,
      middles,
      fetchDistance,
      setSegmentDistances
    );
  }, [companyAddress, locations, fetchDistance, setSegmentDistances]);
}
