import { AddressInput, LocationInput } from "@/types/form-types";
import { SegmentDistance } from "@/types/types";
import { toDistanceRef, segmentsEqual } from "../helper";
import {
  getMiddleRefs,
  getEmptySegments,
  updateSegmentDistances,
} from "../segmentDistanceHelper";

interface CalculateSegmentDistancesArgs {
  companyAddress: AddressInput | null | undefined;
  locations: LocationInput[];
  fetchDistance: (args: { origin: string; destination: string }) => Promise<{
    distanceMiles?: number | null;
    durationMinutes?: number | null;
  }>;
  setSegmentDistances: React.Dispatch<React.SetStateAction<SegmentDistance[]>>;
}

async function calculateSegmentDistances({
  companyAddress,
  locations,
  fetchDistance,
  setSegmentDistances,
}: CalculateSegmentDistancesArgs) {
  const originRef = toDistanceRef(companyAddress);
  const middles = getMiddleRefs(locations);
  const empty = getEmptySegments(originRef, middles);

  if (empty) {
    setSegmentDistances((prev) => (segmentsEqual(prev, empty) ? prev : empty));
    return;
  }
  if (!originRef) return;

  await updateSegmentDistances(
    originRef,
    middles,
    fetchDistance,
    setSegmentDistances
  );
}

export default calculateSegmentDistances;
