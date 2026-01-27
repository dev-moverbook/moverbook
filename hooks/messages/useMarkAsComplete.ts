"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

interface MarkAsCompleteArgs {
  moveId: Id<"moves">;
  customerSignature?: string | null;
  salesRepSignature?: string | null;
  updateInvoice?: boolean;
}

export const useMarkAsComplete = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const markAsCompleteMutation = useAction(
    api.actions.messages.markInvoiceAsComplete
  );

  const markAsComplete = async ({
    moveId,
  }: MarkAsCompleteArgs): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await markAsCompleteMutation({
        moveId,
      });
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    markAsComplete,
    isLoading,
    error,
    setError,
  };
};
