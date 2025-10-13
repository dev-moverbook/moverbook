"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

interface CreateOrUpdateInvoiceInput {
  moveId: Id<"move">;
  updates: {
    customerSignature?: string;
    customerSignedAt?: number;
    repSignature?: string;
    repSignedAt?: number;
    status?: "completed" | "pending";
  };
}

export const useCreateOrUpdateInvoice = () => {
  const [invoiceUpdateLoading, setInvoiceUpdateLoading] =
    useState<boolean>(false);
  const [invoiceUpdateError, setInvoiceUpdateError] = useState<string | null>(
    null
  );

  const createOrUpdateMutation = useMutation(
    api.invoices.createOrUpdateInvoice
  );

  const createOrUpdateInvoice = async ({
    moveId,
    updates,
  }: CreateOrUpdateInvoiceInput): Promise<boolean> => {
    setInvoiceUpdateLoading(true);
    setInvoiceUpdateError(null);

    try {
      return await createOrUpdateMutation({ moveId, updates });
    } catch (error) {
      setErrorFromConvexError(error, setInvoiceUpdateError);
      return false;
    } finally {
      setInvoiceUpdateLoading(false);
    }
  };

  return {
    createOrUpdateInvoice,
    invoiceUpdateLoading,
    invoiceUpdateError,
    setInvoiceUpdateError,
  };
};
