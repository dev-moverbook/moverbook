"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

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
      await deleteInsurancePolicyMutation({
        insurancePolicyId,
        updates: { isActive: false },
      });

      return true;
    } catch (error) {
      setErrorFromConvexError(error, setDeleteInsurancePolicyError);
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
