"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

interface UpdateInsurancePolicyData {
  coverageType?: number | null;
  coverageAmount?: number | null;
  name?: string | null;
  premium?: number | null;
}

export const useUpdateInsurancePolicy = () => {
  const [updateInsurancePolicyLoading, setUpdateInsurancePolicyLoading] =
    useState<boolean>(false);
  const [updateInsurancePolicyError, setUpdateInsurancePolicyError] = useState<
    string | null
  >(null);

  const updateInsurancePolicyMutation = useMutation(
    api.insurancePolicies.updateInsurancePolicy
  );

  const updateInsurancePolicy = async (
    insurancePolicyId: Id<"insurancePolicies">,
    updates: UpdateInsurancePolicyData
  ): Promise<boolean> => {
    setUpdateInsurancePolicyLoading(true);
    setUpdateInsurancePolicyError(null);

    try {
      return await updateInsurancePolicyMutation({
        insurancePolicyId,
        updates: {
          coverageType: updates.coverageType ?? undefined,
          coverageAmount: updates.coverageAmount ?? undefined,
          name: updates.name ?? undefined,
          premium: updates.premium ?? undefined,
        },
      });
    } catch (error) {
      setErrorFromConvexError(error, setUpdateInsurancePolicyError);
      return false;
    } finally {
      setUpdateInsurancePolicyLoading(false);
    }
  };

  return {
    updateInsurancePolicy,
    updateInsurancePolicyLoading,
    updateInsurancePolicyError,
    setUpdateInsurancePolicyError,
  };
};
