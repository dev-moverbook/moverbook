"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

interface CreateAdditionalFeeInput {
  moveId: Id<"moves">;
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
  ): Promise<boolean> => {
    setCreateFeeLoading(true);
    setCreateFeeError(null);

    try {
      return await createMutation(input);
    } catch (error) {
      setErrorFromConvexError(error, setCreateFeeError);
      return false;
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
