"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

interface MarkAsBookedArgs {
  moveId: Id<"moves">;
  customerSignature?: string | null;
  salesRepSignature?: string | null;
  updateQuote?: boolean;
}

export const useMarkAsBooked = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const markAsBookedMutation = useAction(api.actions.messages.markMoveAsBooked);

  const markAsBooked = async ({
    moveId,
    customerSignature,
    salesRepSignature,
    updateQuote,
  }: MarkAsBookedArgs): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await markAsBookedMutation({
        moveId,
        customerSignature: customerSignature || undefined,
        salesRepSignature: salesRepSignature || undefined,
        updateQuote,
      });
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    markAsBooked,
    isLoading,
    error,
    setError,
  };
};
