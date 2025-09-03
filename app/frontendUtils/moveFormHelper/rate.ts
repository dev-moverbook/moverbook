import { TravelChargingTypes } from "@/types/enums";
import { MoveFormData } from "@/types/form-types";

export function applyHourlyRateIfNeeded(
  prev: MoveFormData,
  calc: (movers: number) => number | null
): MoveFormData {
  if (prev.jobType !== "hourly") {
    return prev;
  }
  const next = calc(prev.movers);
  if (next == null || prev.jobTypeRate === next) {
    return prev;
  }
  return { ...prev, jobTypeRate: next };
}

export function followLaborRateForTravel(prev: MoveFormData): MoveFormData {
  if (prev.travelFeeMethod !== TravelChargingTypes.LABOR_HOURS) {
    return prev;
  }
  if (prev.jobType !== "hourly") {
    return prev;
  }
  if (prev.travelFeeRate === prev.jobTypeRate) {
    return prev;
  }
  return { ...prev, travelFeeRate: prev.jobTypeRate ?? null };
}
