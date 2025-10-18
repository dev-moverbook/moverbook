"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { QuoteStatus } from "@/types/types";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

interface CreateOrUpdateQuoteInput {
  moveId: Id<"move">;
  updates: {
    customerSignature?: string;
    customerSignedAt?: number;
    repSignature?: string;
    repSignedAt?: number;
    status?: QuoteStatus;
  };
}

export const useCreateOrUpdateQuote = () => {
  const [quoteUpdateLoading, setQuoteUpdateLoading] = useState(false);
  const [quoteUpdateError, setQuoteUpdateError] = useState<string | null>(null);

  const createOrUpdateMutation = useMutation(api.quotes.createOrUpdateQuote);

  const createOrUpdateQuote = async ({
    moveId,
    updates,
  }: CreateOrUpdateQuoteInput): Promise<boolean> => {
    setQuoteUpdateLoading(true);
    setQuoteUpdateError(null);

    try {
      return await createOrUpdateMutation({ moveId, updates });
    } catch (error) {
      setErrorFromConvexError(error, setQuoteUpdateError);
      return false;
    } finally {
      setQuoteUpdateLoading(false);
    }
  };

  return {
    createOrUpdateQuote,
    quoteUpdateLoading,
    quoteUpdateError,
    setQuoteUpdateError,
  };
};
