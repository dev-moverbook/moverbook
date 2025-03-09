"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

interface UpdateFeeData {
  name?: string;
  price?: number;
}

export const useUpdateFee = () => {
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const updateFeeMutation = useMutation(api.fees.updateFee);

  const updateFee = async (
    feeId: Id<"fees">,
    updates: UpdateFeeData
  ): Promise<boolean> => {
    setUpdateLoading(true);
    setUpdateError(null);

    try {
      const response = await updateFeeMutation({ feeId, updates });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setUpdateError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setUpdateError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setUpdateLoading(false);
    }
  };

  return {
    updateFee,
    updateLoading,
    updateError,
    setUpdateError,
  };
};
