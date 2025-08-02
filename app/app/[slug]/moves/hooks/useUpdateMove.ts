"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { ResponseStatus, TravelChargingTypes } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { LocationInput, MoveFeeInput, MoveItemInput } from "@/types/form-types";
import { MoveStatus, MoveTimes, ServiceType, JobType } from "@/types/types";
import { ArrivalTimes, InsurancePolicySchema } from "@/types/convex-schemas";

export interface UpdateMoveInput {
  moveId: Id<"move">;
  updates: {
    arrivalTimes?: ArrivalTimes;
    creditCardFee?: number | null;
    deposit?: number;
    destinationToOrigin?: number | null;
    endingMoveTime?: number | null;
    jobType?: JobType;
    jobTypeRate?: number | null;
    liabilityCoverage?: InsurancePolicySchema | null;
    locations?: LocationInput[];
    moveDate?: string | null;
    moveFees?: MoveFeeInput[];
    moveItems?: MoveItemInput[];
    moveStatus?: MoveStatus;
    moveWindow?: MoveTimes;
    movers?: number;
    notes?: string | null;
    officeToOrigin?: number | null;
    roundTripDrive?: number | null;
    roundTripMiles?: number | null;
    salesRep?: Id<"users">;
    serviceType?: ServiceType | null;
    startingMoveTime?: number | null;
    totalMiles?: number | null;
    travelFeeRate?: number | null;
    travelFeeMethod?: TravelChargingTypes | null;
    trucks?: number;
  };
}

export const useUpdateMove = () => {
  const [updateMoveLoading, setUpdateMoveLoading] = useState<boolean>(false);
  const [updateMoveError, setUpdateMoveError] = useState<string | null>(null);

  const updateMoveMutation = useMutation(api.move.updateMove);

  const updateMove = async (
    data: UpdateMoveInput
  ): Promise<{ success: boolean }> => {
    setUpdateMoveLoading(true);
    setUpdateMoveError(null);

    try {
      const response = await updateMoveMutation(data);

      if (response.status === ResponseStatus.SUCCESS) {
        return { success: true };
      }

      console.error(response.error);
      setUpdateMoveError(response.error);
      return { success: false };
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setUpdateMoveError(FrontEndErrorMessages.GENERIC);
      return { success: false };
    } finally {
      setUpdateMoveLoading(false);
    }
  };

  return {
    updateMove,
    updateMoveLoading,
    updateMoveError,
    setUpdateMoveError,
  };
};
