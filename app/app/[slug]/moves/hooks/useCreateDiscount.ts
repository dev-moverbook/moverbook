"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";

export interface CreateDiscountInput {
  moveId: Id<"move">;
  name: string;
  price: number;
}

export const useCreateDiscount = () => {
  const [createDiscountLoading, setCreateDiscountLoading] =
    useState<boolean>(false);
  const [createDiscountError, setCreateDiscountError] = useState<string | null>(
    null
  );

  const createMutation = useMutation(api.discounts.createDiscount);

  const createDiscount = async (
    input: CreateDiscountInput
  ): Promise<{
    success: boolean;
    discountId?: Id<"discounts">;
  }> => {
    setCreateDiscountLoading(true);
    setCreateDiscountError(null);

    try {
      const response = await createMutation(input);

      if (response.status === ResponseStatus.SUCCESS) {
        return {
          success: true,
          discountId: response.data.discountId,
        };
      }

      console.error(response.error);
      setCreateDiscountError(response.error);
      return { success: false };
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setCreateDiscountError(FrontEndErrorMessages.GENERIC);
      return { success: false };
    } finally {
      setCreateDiscountLoading(false);
    }
  };

  return {
    createDiscount,
    createDiscountLoading,
    createDiscountError,
    setCreateDiscountError,
  };
};
