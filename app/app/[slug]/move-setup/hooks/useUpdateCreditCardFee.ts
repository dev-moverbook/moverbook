"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

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
      const response = await updateCreditCardFeeMutation({
        creditCardFeeId,
        updates,
      });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setUpdateCreditCardFeeError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setUpdateCreditCardFeeError(FrontEndErrorMessages.GENERIC);
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
