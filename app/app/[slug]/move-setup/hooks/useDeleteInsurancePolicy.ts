"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

export const useDeleteInsurancePolicy = () => {
  const [deleteInsurancePolicyLoading, setDeleteInsurancePolicyLoading] =
    useState<boolean>(false);
  const [deleteInsurancePolicyError, setDeleteInsurancePolicyError] = useState<
    string | null
  >(null);

  const deleteInsurancePolicyMutation = useMutation(
    api.insurancePolicies.updateInsurancePolicy
  );

  const deleteInsurancePolicy = async (
    insurancePolicyId: Id<"insurancePolicies">
  ): Promise<boolean> => {
    setDeleteInsurancePolicyLoading(true);
    setDeleteInsurancePolicyError(null);

    try {
      const response = await deleteInsurancePolicyMutation({
        insurancePolicyId,
        updates: { isActive: false },
      });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setDeleteInsurancePolicyError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setDeleteInsurancePolicyError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setDeleteInsurancePolicyLoading(false);
    }
  };

  return {
    deleteInsurancePolicy,
    deleteInsurancePolicyLoading,
    deleteInsurancePolicyError,
    setDeleteInsurancePolicyError,
  };
};
