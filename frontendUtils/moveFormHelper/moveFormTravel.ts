import { TravelChargingTypes } from "@/types/enums";
import { MoveFormData } from "@/types/form-types";
import { Doc } from "@/convex/_generated/dataModel";

export function applyTravelFeeDefaults(
  prev: MoveFormData,
  travelFeeOptions?: Doc<"travelFees">
): MoveFormData {
  if (prev.travelFeeMethod !== null) {
    return prev;
  }

  if (!travelFeeOptions) {
    return prev;
  }

  if (travelFeeOptions.defaultMethod === TravelChargingTypes.FLAT) {
    return {
      ...prev,
      travelFeeMethod: travelFeeOptions.defaultMethod,
      travelFeeRate: travelFeeOptions.flatRate ?? null,
    };
  }

  if (
    travelFeeOptions.defaultMethod === TravelChargingTypes.LABOR_HOURS &&
    prev.jobType === "hourly"
  ) {
    return {
      ...prev,
      travelFeeMethod: travelFeeOptions.defaultMethod,
      travelFeeRate: prev.jobTypeRate ?? null,
    };
  }

  if (travelFeeOptions.defaultMethod === TravelChargingTypes.MILEAGE) {
    return {
      ...prev,
      travelFeeMethod: travelFeeOptions.defaultMethod,
      travelFeeRate: travelFeeOptions.mileageRate ?? null,
    };
  }

  return prev;
}
