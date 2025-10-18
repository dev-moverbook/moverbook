"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CreateFeeData } from "@/types/form-types";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

export const useCreateFee = () => {
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const createFeeMutation = useMutation(api.fees.createFee);

  const createFee = async (
    companyId: Id<"companies">,
    feeData: CreateFeeData
  ): Promise<boolean> => {
    setCreateLoading(true);
    setCreateError(null);

    try {
      return await createFeeMutation({ companyId, ...feeData });
    } catch (error) {
      setErrorFromConvexError(error, setCreateError);
      return false;
    } finally {
      setCreateLoading(false);
    }
  };

  return {
    createFee,
    createLoading,
    createError,
    setCreateError,
  };
};
