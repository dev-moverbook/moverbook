"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

export interface UpdateCustomerAcknowledgedAtInput {
  moveChangeRequestId: Id<"moveChangeRequests">;
}

export const useUpdateCustomerAcknowledgedAt = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const requestMoveUpdateMutation = useMutation(
    api.moveChangeRequests.updateCustomerAcknowledgedAt
  );

  const customerAcknowledgedAt = async (
    data: UpdateCustomerAcknowledgedAtInput
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await requestMoveUpdateMutation(data);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    customerAcknowledgedAt,
    isLoading,
    error,
    setError,
  };
};
