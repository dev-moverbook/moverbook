"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";

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
  ): Promise<{
    success: boolean;
    additionalFeeId?: Id<"additionalFees">;
  }> => {
    setUpdateFeeLoading(true);
    setUpdateFeeError(null);

    try {
      const response = await updateMutation(input);

      if (response.status === ResponseStatus.SUCCESS) {
        return {
          success: true,
          additionalFeeId: response.data.additionalFeeId,
        };
      }

      console.error(response.error);
      setUpdateFeeError(response.error);
      return { success: false };
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setUpdateFeeError(FrontEndErrorMessages.GENERIC);
      return { success: false };
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
