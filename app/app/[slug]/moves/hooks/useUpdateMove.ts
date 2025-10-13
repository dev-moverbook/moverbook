"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { TravelChargingTypes } from "@/types/enums";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { LocationInput, MoveFeeInput, MoveItemInput } from "@/types/form-types";
import {
  MoveStatus,
  MoveTimes,
  ServiceType,
  JobType,
  PaymentMethod,
  SegmentDistance,
  ArrivalTimes,
} from "@/types/types";

import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

export interface UpdateMoveInput {
  moveId: Id<"move">;
  updates: {
    actualArrivalTime?: number;
    actualBreakTime?: number;
    actualStartTime?: number;
    actualEndTime?: number;
    arrivalTimes?: ArrivalTimes;
    creditCardFee?: number;
    deposit?: number;
    destinationToOrigin?: number | null;
    endingMoveTime?: number | null;
    invoiceAmountPaid?: number;
    jobType?: JobType;
    jobTypeRate?: number | null;
    liabilityCoverage?: Doc<"insurancePolicies"> | null;
    locations?: LocationInput[];
    moveDate?: string | null;
    moveFees?: MoveFeeInput[];
    moveItems?: MoveItemInput[];
    moveStatus?: MoveStatus;
    moveWindow?: MoveTimes;
    movers?: number;
    notes?: string | null;
    officeToOrigin?: number | null;
    paymentMethod?: PaymentMethod;
    roundTripDrive?: number | null;
    roundTripMiles?: number | null;
    salesRep?: Id<"users">;
    segmentDistances?: SegmentDistance[];
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

  const updateMove = async (data: UpdateMoveInput): Promise<boolean> => {
    setUpdateMoveLoading(true);
    setUpdateMoveError(null);

    try {
      return await updateMoveMutation(data);
    } catch (error) {
      setErrorFromConvexError(error, setUpdateMoveError);
      return false;
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
