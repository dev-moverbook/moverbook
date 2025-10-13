"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

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
  ): Promise<boolean> => {
    setUpdateDiscountLoading(true);
    setUpdateDiscountError(null);

    try {
      await updateMutation(input);

      return true;
    } catch (error) {
      setErrorFromConvexError(error, setUpdateDiscountError);
      return false;
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
