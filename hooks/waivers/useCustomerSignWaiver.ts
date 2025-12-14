"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

interface WaiverUpdates {
  customerSignature: string;
}

export const useCustomerSignWaiver = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutationFn = useMutation(api.waivers.customerSignWaiver);

  const customerSignWaiver = async (
    waiverId: Id<"waivers">,
    updates: WaiverUpdates
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await mutationFn({ waiverId, updates });
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    customerSignWaiver,
    isLoading,
    error,
    setError,
  };
};
