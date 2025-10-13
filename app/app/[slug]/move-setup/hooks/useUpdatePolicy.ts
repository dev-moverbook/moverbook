"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

interface UpdatePolicyData {
  weekdayHourMinimum?: number;
  weekendHourMinimum?: number;
  deposit?: number;
  cancellationFee?: number;
  cancellationCutoffHour?: number;
  additionalTermsAndConditions?: string;
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
      return await updatePolicyMutation({ policyId, updates });
    } catch (error) {
      setErrorFromConvexError(error, setUpdatePolicyError);
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
