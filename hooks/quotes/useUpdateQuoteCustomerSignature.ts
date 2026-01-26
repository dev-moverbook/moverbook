"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

export const useUpdateQuoteCustomerSignature = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateQuoteCustomerSignatureMutation = useMutation(
    api.quotes.updateQuoteCustomerSignature
  );

  const updateQuoteCustomerSignature = async (
    quoteId: Id<"quotes">,
    customerSignature: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      return await updateQuoteCustomerSignatureMutation({
        quoteId,
        updates: { customerSignature },
      });
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateQuoteCustomerSignature,
    loading,
    error,
    setError,
  };
};
