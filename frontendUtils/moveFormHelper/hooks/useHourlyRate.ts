import { useEffect } from "react";
import { MoveFormData } from "@/types/form-types";
import { Doc } from "@/convex/_generated/dataModel";

export function useHourlyRate(
  laborRates: Doc<"labors">[] | undefined,
  movers: number,
  jobType: MoveFormData["jobType"],
  setMoveFormData: React.Dispatch<React.SetStateAction<MoveFormData>>,
  calc: (movers: number) => number | null
) {
  useEffect(() => {
    if (!laborRates) {
      return;
    }
    setMoveFormData((prev) => {
      if (prev.jobType !== "hourly") {
        return prev;
      }
      const next = calc(movers);
      if (next == null || prev.jobTypeRate === next) {
        return prev;
      }
      return { ...prev, jobTypeRate: next };
    });
  }, [laborRates, movers, jobType, setMoveFormData, calc]);
}
