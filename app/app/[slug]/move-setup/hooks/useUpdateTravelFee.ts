"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus, TravelChargingTypes } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

interface UpdateTravelFeeData {
  isDefault?: boolean;
  chargingMethod?: TravelChargingTypes;
  rate?: number;
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
      const response = await updateTravelFeeMutation({ travelFeeId, updates });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setUpdateTravelFeeError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setUpdateTravelFeeError(FrontEndErrorMessages.GENERIC);
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
