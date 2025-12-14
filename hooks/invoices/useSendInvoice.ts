"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";
import { DeliveryType } from "@/types/types";
// To Be Deleted

export const useSendInvoice = () => {
  const [sendInvoiceLoading, setSendInvoiceLoading] = useState<boolean>(false);
  const [sendInvoiceError, setSendInvoiceError] = useState<string | null>(null);

  const sendInvoiceAction = useAction(api.invoices.sendInvoice);

  const sendInvoice = async (
    moveId: Id<"moves">,
    channel: DeliveryType
  ): Promise<boolean> => {
    setSendInvoiceLoading(true);
    setSendInvoiceError(null);

    try {
      return await sendInvoiceAction({ moveId, channel });
    } catch (error) {
      setErrorFromConvexError(error, setSendInvoiceError);
      return false;
    } finally {
      setSendInvoiceLoading(false);
    }
  };

  return {
    sendInvoice,
    sendInvoiceLoading,
    sendInvoiceError,
    setSendInvoiceError,
  };
};
