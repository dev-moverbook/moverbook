"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { QuoteStatus } from "@/types/types";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

interface CreateOrUpdateQuoteInput {
  moveId: Id<"moves">;
  updates: {
    customerSignature?: string;
    repSignature?: string;
    status?: QuoteStatus;
  };
}

export const useCreateOrUpdateQuote = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createOrUpdateMutation = useMutation(api.quotes.createOrUpdateQuote);

  const createOrUpdateQuote = async ({
    moveId,
    updates,
  }: CreateOrUpdateQuoteInput): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      return await createOrUpdateMutation({ moveId, updates });
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrUpdateQuote,
    loading,
    error,
    setError,
  };
};
