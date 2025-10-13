"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

interface UpdateAdditionalFeeInput {
  additionalFeeId: Id<"additionalFees">;
  updates: {
    name?: string;
    price?: number;
    quantity?: number;
    feeId?: Id<"fees">;
    isActive?: boolean;
  };
}

export const useUpdateAdditionalFee = () => {
  const [updateFeeLoading, setUpdateFeeLoading] = useState<boolean>(false);
  const [updateFeeError, setUpdateFeeError] = useState<string | null>(null);

  const updateMutation = useMutation(api.additionalFees.updateAdditionalFee);

  const updateAdditionalFee = async (
    input: UpdateAdditionalFeeInput
  ): Promise<boolean> => {
    setUpdateFeeLoading(true);
    setUpdateFeeError(null);

    try {
      return await updateMutation(input);
    } catch (error) {
      setErrorFromConvexError(error, setUpdateFeeError);
      return false;
    } finally {
      setUpdateFeeLoading(false);
    }
  };

  return {
    updateAdditionalFee,
    updateFeeLoading,
    updateFeeError,
    setUpdateFeeError,
  };
};
