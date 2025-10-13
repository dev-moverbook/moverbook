"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

interface AdditionalLiabilityCoverageUpdates {
  customerSignature?: string;
  customerSignedAt?: number;
  repSignature?: string;
  repSignedAt?: number;
}

export const useCreateOrUpdateAdditionalLiabilityCoverage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutationFn = useMutation(
    api.additionalLiabilityCoverage.createOrUpdateAdditionalLiabilityCoverage
  );

  const createOrUpdateAdditionalLiabilityCoverage = async (
    moveId: Id<"move">,
    updates: AdditionalLiabilityCoverageUpdates
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await mutationFn({ moveId, updates });

      return true;
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createOrUpdateAdditionalLiabilityCoverage,
    isLoading,
    error,
    setError,
  };
};
