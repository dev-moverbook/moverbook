"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";

interface UpdateDiscountInput {
  discountId: Id<"discounts">;
  updates: {
    name?: string;
    price?: number;
    isActive?: boolean;
  };
}

export const useUpdateDiscount = () => {
  const [updateDiscountLoading, setUpdateDiscountLoading] =
    useState<boolean>(false);
  const [updateDiscountError, setUpdateDiscountError] = useState<string | null>(
    null
  );

  const updateMutation = useMutation(api.discounts.updateDiscount);

  const updateDiscount = async (
    input: UpdateDiscountInput
  ): Promise<{
    success: boolean;
    discountId?: Id<"discounts">;
  }> => {
    setUpdateDiscountLoading(true);
    setUpdateDiscountError(null);

    try {
      const response = await updateMutation(input);

      if (response.status === ResponseStatus.SUCCESS) {
        return {
          success: true,
          discountId: response.data.discountId,
        };
      }

      console.error(response.error);
      setUpdateDiscountError(response.error);
      return { success: false };
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setUpdateDiscountError(FrontEndErrorMessages.GENERIC);
      return { success: false };
    } finally {
      setUpdateDiscountLoading(false);
    }
  };

  return {
    updateDiscount,
    updateDiscountLoading,
    updateDiscountError,
    setUpdateDiscountError,
  };
};
