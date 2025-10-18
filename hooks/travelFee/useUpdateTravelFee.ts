"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TravelChargingTypes } from "@/types/enums";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

interface UpdateTravelFeeData {
  mileageRate?: number;
  flatRate?: number;
  defaultMethod?: TravelChargingTypes | null;
}

export const useUpdateTravelFee = () => {
  const [updateTravelFeeLoading, setUpdateTravelFeeLoading] =
    useState<boolean>(false);
  const [updateTravelFeeError, setUpdateTravelFeeError] = useState<
    string | null
  >(null);

  const updateTravelFeeMutation = useMutation(api.travelFee.updateTravelFee);

  const updateTravelFee = async (
    travelFeeId: Id<"travelFee">,
    updates: UpdateTravelFeeData
  ): Promise<boolean> => {
    setUpdateTravelFeeLoading(true);
    setUpdateTravelFeeError(null);

    try {
      return await updateTravelFeeMutation({ travelFeeId, updates });
    } catch (error) {
      setErrorFromConvexError(error, setUpdateTravelFeeError);
      return false;
    } finally {
      setUpdateTravelFeeLoading(false);
    }
  };

  return {
    updateTravelFee,
    updateTravelFeeLoading,
    updateTravelFeeError,
    setUpdateTravelFeeError,
  };
};
