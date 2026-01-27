"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

interface UpdateCustomerInvoiceInput {
  invoiceId: Id<"invoices">;
  updates: {
    customerSignature?: string;
    status?: "completed" | "pending";
  };
}

export const useUpdateCustomerInvoice = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateCustomerInvoiceMutation = useMutation(
    api.invoices.updateInvoiceCustomerInvoice
  );

  const updateCustomerInvoice = async ({
    invoiceId,
    updates,
  }: UpdateCustomerInvoiceInput): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      return await updateCustomerInvoiceMutation({ invoiceId, updates });
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateCustomerInvoice,
    loading,
    error,
    setError,
  };
};
