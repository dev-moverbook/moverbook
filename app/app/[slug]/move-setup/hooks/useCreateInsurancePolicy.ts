"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { InsurancePolicyFormData } from "@/types/form-types";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

export const useCreateInsurancePolicy = () => {
  const [createInsurancePolicyLoading, setCreateInsurancePolicyLoading] =
    useState<boolean>(false);
  const [createInsurancePolicyError, setCreateInsurancePolicyError] = useState<
    string | null
  >(null);

  const createInsurancePolicyMutation = useMutation(
    api.insurancePolicies.createInsurancePolicy
  );

  const createInsurancePolicy = async (
    companyId: Id<"companies">,
    policy: InsurancePolicyFormData
  ): Promise<boolean> => {
    setCreateInsurancePolicyLoading(true);
    setCreateInsurancePolicyError(null);

    try {
      await createInsurancePolicyMutation({
        companyId,
        name: policy.name,
        coverageType: policy.coverageType!,
        coverageAmount: policy.coverageAmount!,
        premium: policy.premium!,
      });

      return true;
    } catch (error) {
      setErrorFromConvexError(error, setCreateInsurancePolicyError);
      return false;
    } finally {
      setCreateInsurancePolicyLoading(false);
    }
  };

  return {
    createInsurancePolicy,
    createInsurancePolicyLoading,
    createInsurancePolicyError,
    setCreateInsurancePolicyError,
  };
};
