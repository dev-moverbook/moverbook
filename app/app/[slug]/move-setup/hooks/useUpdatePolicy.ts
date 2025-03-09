"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

interface UpdatePolicyData {
  weekdayHourMinimum?: number;
  weekendHourMinimum?: number;
  deposit?: number;
  cancellationFee?: number;
  cancellationCutoffHour?: number;
  billOfLandingDisclaimerAndTerms?: string;
}

export const useUpdatePolicy = () => {
  const [updatePolicyLoading, setUpdatePolicyLoading] =
    useState<boolean>(false);
  const [updatePolicyError, setUpdatePolicyError] = useState<string | null>(
    null
  );

  const updatePolicyMutation = useMutation(api.policies.updatePolicy);

  const updatePolicy = async (
    policyId: Id<"policies">,
    updates: UpdatePolicyData
  ): Promise<boolean> => {
    setUpdatePolicyLoading(true);
    setUpdatePolicyError(null);

    try {
      const response = await updatePolicyMutation({ policyId, updates });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setUpdatePolicyError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setUpdatePolicyError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setUpdatePolicyLoading(false);
    }
  };

  return {
    updatePolicy,
    updatePolicyLoading,
    updatePolicyError,
    setUpdatePolicyError,
  };
};
