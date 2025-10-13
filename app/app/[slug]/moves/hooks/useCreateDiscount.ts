"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

interface CreateDiscountInput {
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

  const createDiscount = useCallback(
    async (input: CreateDiscountInput): Promise<boolean> => {
      setCreateDiscountLoading(true);
      setCreateDiscountError(null);
      try {
        return await createMutation(input);
      } catch (error) {
        setErrorFromConvexError(error, (msg) => setCreateDiscountError(msg));
        return false;
      } finally {
        setCreateDiscountLoading(false);
      }
    },
    [createMutation]
  );

  return {
    createDiscount,
    createDiscountLoading,
    createDiscountError,
    setCreateDiscountError,
  };
};
