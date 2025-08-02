"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

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
      const response = await updateInsurancePolicyMutation({
        insurancePolicyId,
        updates: {
          coverageType: updates.coverageType ?? undefined,
          coverageAmount: updates.coverageAmount ?? undefined,
          name: updates.name ?? undefined,
          premium: updates.premium ?? undefined,
        },
      });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setUpdateInsurancePolicyError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setUpdateInsurancePolicyError(FrontEndErrorMessages.GENERIC);
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
