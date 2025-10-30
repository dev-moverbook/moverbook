"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

interface WaiverUpdates {
  customerSignature?: string;
  customerSignedAt?: number;
  repSignature?: string;
  repSignedAt?: number;
}

export const useCreateOrUpdateWaiver = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutationFn = useMutation(api.waivers.createOrUpdateWaiver);

  const createOrUpdateWaiver = async (
    moveId: Id<"moves">,
    updates: WaiverUpdates
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await mutationFn({ moveId, updates });
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createOrUpdateWaiver,
    isLoading,
    error,
    setError,
  };
};
