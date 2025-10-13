"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

export type LaborCreateInput = {
  name: string;
  startDate: number;
  endDate: number;
  twoMovers: number;
  threeMovers: number;
  fourMovers: number;
  extra: number;
  isDefault?: boolean;
};

export const useCreateLabor = () => {
  const [createLaborLoading, setCreateLaborLoading] = useState<boolean>(false);
  const [createLaborError, setCreateLaborError] = useState<string | null>(null);

  const createLaborMutation = useMutation(api.labor.createLabor);

  const createLabor = async (
    companyId: Id<"companies">,
    laborData: LaborCreateInput
  ): Promise<boolean> => {
    setCreateLaborLoading(true);
    setCreateLaborError(null);

    try {
      await createLaborMutation({ companyId, ...laborData });

      return true;
    } catch (error) {
      setErrorFromConvexError(error, setCreateLaborError);
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
