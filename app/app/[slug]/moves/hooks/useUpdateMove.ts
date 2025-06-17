"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import {
  LocationInput,
  MoveFeeInput,
  MoveItemInput,
  InsurancePolicyInput,
} from "@/types/form-types";
import { MoveStatus, MoveTimes, ServiceType, JobType } from "@/types/types";
import { ArrivalTimes, InsurancePolicySchema } from "@/types/convex-schemas";

interface UpdateMoveInput {
  moveId: Id<"move">;
  updates: {
    name?: string;
    phoneNumber?: string | null;
    altPhoneNumber?: string | null;
    email?: string | null;
    notes?: string | null;
    moveDate?: string | null;
    status?: MoveStatus;
    serviceType?: ServiceType | null;
    jobType?: JobType;
    jobTypeRate?: number | null;
    arrivalTimes?: ArrivalTimes;
    moveWindow?: MoveTimes;
    startingMoveTime?: number | null;
    endingMoveTime?: number | null;
    salesRep?: Id<"users">;
    locations?: LocationInput[];
    moveItems?: MoveItemInput[];
    moveFees?: MoveFeeInput[];
    trucks?: number;
    movers?: number;
    totalMiles?: number | null;
    officeToOrigin?: number | null;
    destinationToOrigin?: number | null;
    roundTripMiles?: number | null;
    roundTripDrive?: number | null;
    liabilityCoverage?: InsurancePolicySchema | null;
    referral?: string | null;
    deposit?: number | null;
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
