"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";
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
import { ArrivalTimes, InsurancePolicySchema } from "@/types/convex-schemas";

interface CreateMoveInput {
  companyId: Id<"companies">;
  status: MoveStatus;
  salesRep: Id<"users">;
  liabilityCoverage: InsurancePolicySchema | null;
  name: string;
  email: string | null;
  phoneNumber: string | null;
  altPhoneNumber: string | null;
  notes: string | null;
  serviceType: ServiceType | null;
  referral: string | null;
  moveDate: string | null;
  moveWindow: MoveTimes;
  arrivalTimes: ArrivalTimes;
  trucks: number;
  movers: number;
  startingMoveTime: number;
  endingMoveTime: number;
  jobType: JobType;
  jobTypeRate: number | null;
  deposit: number | null;
  moveFees: MoveFeeInput[];
  moveItems: MoveItemInput[];
  locations: LocationInput[];
  totalMiles: number | null;
  officeToOrigin: number | null;
  destinationToOrigin: number | null;
  roundTripMiles: number | null;
  roundTripDrive: number | null;
  segmentDistances: SegmentDistance[];
  depositMethod: PaymentMethod;
}

export const useCreateMove = () => {
  const [createMoveLoading, setCreateMoveLoading] = useState(false);
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
