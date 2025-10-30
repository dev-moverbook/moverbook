import { MoveFormData } from "@/types/form-types";
import { Doc } from "@/convex/_generated/dataModel";

export function ensureArrivalDefaults(
  prev: MoveFormData,
  arrivalWindowOptions?: Doc<"arrivalWindows">
): MoveFormData {
  if (!arrivalWindowOptions) {
    return prev;
  }
  if (
    prev.arrivalTimes.arrivalWindowStarts ||
    prev.arrivalTimes.arrivalWindowEnds
  ) {
    return prev;
  }
  return {
    ...prev,
    arrivalTimes: {
      arrivalWindowStarts: arrivalWindowOptions.morningArrival,
      arrivalWindowEnds: arrivalWindowOptions.morningEnd,
    },
    moveWindow: "morning",
  };
}
