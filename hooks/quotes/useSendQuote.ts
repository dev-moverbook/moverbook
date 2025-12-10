"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";
import { DeliveryType } from "@/types/types";

// To be Deleted

export const useSendQuote = () => {
  const [sendQuoteLoading, setSendQuoteLoading] = useState<boolean>(false);
  const [sendQuoteError, setSendQuoteError] = useState<string | null>(null);

  const sendQuoteAction = useAction(api.quotes.sendQuote);

  const sendQuote = async (
    moveId: Id<"moves">,
    channel: DeliveryType
  ): Promise<boolean> => {
    setSendQuoteLoading(true);
    setSendQuoteError(null);

    try {
      return await sendQuoteAction({ moveId, channel });
    } catch (error) {
      setErrorFromConvexError(error, setSendQuoteError);
      return false;
    } finally {
      setSendQuoteLoading(false);
    }
  };

  return {
    sendQuote,
    sendQuoteLoading,
    sendQuoteError,
    setSendQuoteError,
  };
};
