"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { QuoteStatus } from "@/types/types";

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
  }: CreateOrUpdateQuoteInput): Promise<{
    success: boolean;
    quoteId?: Id<"quotes">;
  }> => {
    setQuoteUpdateLoading(true);
    setQuoteUpdateError(null);

    try {
      const response = await createOrUpdateMutation({ moveId, updates });

      if (response.status === ResponseStatus.SUCCESS) {
        return {
          success: true,
          quoteId: response.data.quoteId,
        };
      }

      console.error(response.error);
      setQuoteUpdateError(response.error);
      return { success: false };
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setQuoteUpdateError(FrontEndErrorMessages.GENERIC);
      return { success: false };
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
