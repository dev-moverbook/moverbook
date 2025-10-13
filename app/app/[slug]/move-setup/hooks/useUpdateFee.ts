"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

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
      await updateFeeMutation({ feeId, updates });

      return true;
    } catch (error) {
      setErrorFromConvexError(error, setUpdateError);
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
