"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";

interface CreateAdditionalFeeInput {
  moveId: Id<"move">;
  name: string;
  price: number;
  quantity: number;
  feeId?: Id<"fees">;
}

export const useCreateAdditionalFee = () => {
  const [createFeeLoading, setCreateFeeLoading] = useState<boolean>(false);
  const [createFeeError, setCreateFeeError] = useState<string | null>(null);

  const createMutation = useMutation(api.additionalFees.createAdditionalFee);

  const createAdditionalFee = async (
    input: CreateAdditionalFeeInput
  ): Promise<{
    success: boolean;
    additionalFeeId?: Id<"additionalFees">;
  }> => {
    setCreateFeeLoading(true);
    setCreateFeeError(null);

    try {
      const response = await createMutation(input);

      if (response.status === ResponseStatus.SUCCESS) {
        return {
          success: true,
          additionalFeeId: response.data.additionalFeeId,
        };
      }

      console.error(response.error);
      setCreateFeeError(response.error);
      return { success: false };
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setCreateFeeError(FrontEndErrorMessages.GENERIC);
      return { success: false };
    } finally {
      setCreateFeeLoading(false);
    }
  };

  return {
    createAdditionalFee,
    createFeeLoading,
    createFeeError,
    setCreateFeeError,
  };
};
