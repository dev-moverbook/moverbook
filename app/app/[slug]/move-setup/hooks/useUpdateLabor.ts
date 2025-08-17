"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";
import { LaborCreateInput } from "./useCreateLabor";

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
      const response = await updateLaborMutation({ laborId, updates });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setUpdateLaborError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setUpdateLaborError(FrontEndErrorMessages.GENERIC);
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
