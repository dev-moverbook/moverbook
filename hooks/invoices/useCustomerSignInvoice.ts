"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";
import { PaymentMethod } from "@/types/types";

export const useCustomerSignInvoice = () => {
  const [customerSignInvoiceLoading, setCustomerSignInvoiceLoading] =
    useState<boolean>(false);
  const [customerSignInvoiceError, setCustomerSignInvoiceError] = useState<
    string | null
  >(null);

  const customerSignInvoiceAction = useAction(api.invoices.customerSignInvoice);

  const customerSignInvoice = async (
    invoiceId: Id<"invoices">,
    signature: string,
    paymentMethod: PaymentMethod,
    amount: number
  ): Promise<boolean> => {
    setCustomerSignInvoiceLoading(true);
    setCustomerSignInvoiceError(null);

    try {
      return await customerSignInvoiceAction({
        invoiceId,
        signature,
        paymentMethod,
        amount,
      });
    } catch (error) {
      setErrorFromConvexError(error, setCustomerSignInvoiceError);
      return false;
    } finally {
      setCustomerSignInvoiceLoading(false);
    }
  };

  return {
    customerSignInvoice,
    customerSignInvoiceLoading,
    customerSignInvoiceError,
    setCustomerSignInvoiceError,
  };
};
