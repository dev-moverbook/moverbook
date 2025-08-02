"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

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
  ): Promise<{
    success: boolean;
    additionalLiabilityCoverageId?: Id<"additionalLiabilityCoverage">;
  }> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mutationFn({ moveId, updates });

      if (response.status === ResponseStatus.SUCCESS) {
        return {
          success: true,
          additionalLiabilityCoverageId:
            response.data.additionalLiabilityCoverageId,
        };
      }

      console.error(response.error);
      setError(response.error);
      return { success: false };
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setError(FrontEndErrorMessages.GENERIC);
      return { success: false };
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
