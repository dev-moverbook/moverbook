"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";
import { CreateLaborFormData } from "@/types/form-types";

export const useCreateLabor = () => {
  const [createLaborLoading, setCreateLaborLoading] = useState<boolean>(false);
  const [createLaborError, setCreateLaborError] = useState<string | null>(null);

  const createLaborMutation = useMutation(api.labor.createLabor);

  const createLabor = async (
    companyId: Id<"companies">,
    laborData: CreateLaborFormData
  ): Promise<boolean> => {
    setCreateLaborLoading(true);
    setCreateLaborError(null);

    try {
      const response = await createLaborMutation({ companyId, ...laborData });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setCreateLaborError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setCreateLaborError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setCreateLaborLoading(false);
    }
  };

  return {
    createLabor,
    createLaborLoading,
    createLaborError,
    setCreateLaborError,
  };
};
