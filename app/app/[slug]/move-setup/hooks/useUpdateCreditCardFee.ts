"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

interface UpdateCreditCardFeeData {
  rate?: number;
}

export const useUpdateCreditCardFee = () => {
  const [updateCreditCardFeeLoading, setUpdateCreditCardFeeLoading] =
    useState<boolean>(false);
  const [updateCreditCardFeeError, setUpdateCreditCardFeeError] = useState<
    string | null
  >(null);

  const updateCreditCardFeeMutation = useMutation(
    api.creditCardFee.updateCreditCardFee
  );

  const updateCreditCardFee = async (
    creditCardFeeId: Id<"creditCardFees">,
    updates: UpdateCreditCardFeeData
  ): Promise<boolean> => {
    setUpdateCreditCardFeeLoading(true);
    setUpdateCreditCardFeeError(null);

    try {
      return await updateCreditCardFeeMutation({
        creditCardFeeId,
        updates,
      });
    } catch (error) {
      setErrorFromConvexError(error, setUpdateCreditCardFeeError);
      return false;
    } finally {
      setUpdateCreditCardFeeLoading(false);
    }
  };

  return {
    updateCreditCardFee,
    updateCreditCardFeeLoading,
    updateCreditCardFeeError,
    setUpdateCreditCardFeeError,
  };
};
