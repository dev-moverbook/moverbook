"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";
import { CreateFeeData } from "@/types/form-types";

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
      const response = await createFeeMutation({ companyId, ...feeData });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setCreateError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setCreateError(FrontEndErrorMessages.GENERIC);
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
