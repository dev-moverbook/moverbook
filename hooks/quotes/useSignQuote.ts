"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

export const useSignQuote = () => {
  const [signQuoteLoading, setSignQuoteLoading] = useState<boolean>(false);
  const [signQuoteError, setSignQuoteError] = useState<string | null>(null);

  const signQuoteAction = useAction(api.quotes.signQuote);

  const signQuote = async (
    moveId: Id<"moves">,
    signature: string
  ): Promise<boolean> => {
    setSignQuoteLoading(true);
    setSignQuoteError(null);

    try {
      return await signQuoteAction({ moveId, signature });
    } catch (error) {
      setErrorFromConvexError(error, setSignQuoteError);
      return false;
    } finally {
      setSignQuoteLoading(false);
    }
  };

  return {
    signQuote,
    signQuoteLoading,
    signQuoteError,
    setSignQuoteError,
  };
};
