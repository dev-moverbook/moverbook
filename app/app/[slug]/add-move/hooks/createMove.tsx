"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { ResponseStatus, TravelChargingTypes } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { LocationInput, MoveFeeInput, MoveItemInput } from "@/types/form-types"; // <-- Define these based on your form shape
import { api } from "@/convex/_generated/api";
import {
  JobType,
  MoveStatus,
  MoveTimes,
  PaymentMethod,
  SegmentDistance,
  ServiceType,
} from "@/types/types";
import { ArrivalTimes } from "@/types/convex-schemas";

export interface CreateMoveInput {
  arrivalTimes: ArrivalTimes;
  companyId: Id<"companies">;
  creditCardFee: number;
  deposit: number;
  destinationToOrigin: number | null;
  endingMoveTime: number | null;
  jobType: JobType;
  jobTypeRate: number | null;
  liabilityCoverage: Doc<"insurancePolicies"> | null;
  locations: LocationInput[];
  moveCustomerId: Id<"moveCustomers">;
  moveDate: string | null;
  moveFees: MoveFeeInput[];
  moveItems: MoveItemInput[];
  moveStatus: MoveStatus;
  moveWindow: MoveTimes;
  movers: number;
  notes: string | null;
  officeToOrigin: number | null;
  paymentMethod: PaymentMethod;
  roundTripDrive: number | null;
  roundTripMiles: number | null;
  salesRep: Id<"users">;
  segmentDistances: SegmentDistance[];
  serviceType: ServiceType | null;
  startingMoveTime: number | null;
  totalMiles: number | null;
  trucks: number;
  travelFeeRate?: number | null;
  travelFeeMethod?: TravelChargingTypes | null;
}

export const useCreateMove = () => {
  const [createMoveLoading, setCreateMoveLoading] = useState<boolean>(false);
  const [createMoveError, setCreateMoveError] = useState<string | null>(null);

  const createMoveMutation = useMutation(api.move.createMove);

  const createMove = async (
    data: CreateMoveInput
  ): Promise<{
    success: boolean;
    moveId?: Id<"move">;
    companyId?: Id<"companies">;
  }> => {
    setCreateMoveLoading(true);
    setCreateMoveError(null);

    try {
      const response = await createMoveMutation(data);

      if (response.status === ResponseStatus.SUCCESS) {
        return {
          success: true,
          moveId: response.data.moveId,
          companyId: data.companyId,
        };
      }

      console.error(response.error);
      setCreateMoveError(response.error);
      return { success: false };
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setCreateMoveError(FrontEndErrorMessages.GENERIC);
      return { success: false };
    } finally {
      setCreateMoveLoading(false);
    }
  };

  return {
    createMove,
    createMoveLoading,
    createMoveError,
    setCreateMoveError,
  };
};
