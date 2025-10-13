"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { LaborCreateInput } from "./useCreateLabor";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

export const useUpdateLabor = () => {
  const [updateLaborLoading, setUpdateLaborLoading] = useState<boolean>(false);
  const [updateLaborError, setUpdateLaborError] = useState<string | null>(null);

  const updateLaborMutation = useMutation(api.labor.updateLabor);

  const updateLabor = async (
    laborId: Id<"labor">,
    updates: LaborCreateInput
  ): Promise<boolean> => {
    setUpdateLaborLoading(true);
    setUpdateLaborError(null);

    try {
      await updateLaborMutation({ laborId, updates });
      return true;
    } catch (error) {
      setErrorFromConvexError(error, setUpdateLaborError);
      return false;
    } finally {
      setUpdateLaborLoading(false);
    }
  };

  return {
    updateLabor,
    updateLaborLoading,
    updateLaborError,
    setUpdateLaborError,
  };
};
