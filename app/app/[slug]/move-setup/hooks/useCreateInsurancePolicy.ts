"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";
import { InsurancePolicyFormData } from "@/types/form-types";

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
      const response = await createInsurancePolicyMutation({
        companyId,
        ...policy,
      });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setCreateInsurancePolicyError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setCreateInsurancePolicyError(FrontEndErrorMessages.GENERIC);
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
