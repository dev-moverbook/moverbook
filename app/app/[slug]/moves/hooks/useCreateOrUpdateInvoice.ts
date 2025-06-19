"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";

interface CreateOrUpdateInvoiceInput {
  moveId: Id<"move">;
  updates: {
    customerSignature?: string;
    customerSignedAt?: number;
    repSignature?: string;
    repSignedAt?: number;
  };
}

export const useCreateOrUpdateInvoice = () => {
  const [invoiceUpdateLoading, setInvoiceUpdateLoading] = useState(false);
  const [invoiceUpdateError, setInvoiceUpdateError] = useState<string | null>(
    null
  );

  const createOrUpdateMutation = useMutation(
    api.invoices.createOrUpdateInvoice
  );

  const createOrUpdateInvoice = async ({
    moveId,
    updates,
  }: CreateOrUpdateInvoiceInput): Promise<{
    success: boolean;
    invoiceId?: Id<"invoices">;
  }> => {
    setInvoiceUpdateLoading(true);
    setInvoiceUpdateError(null);

    try {
      const response = await createOrUpdateMutation({ moveId, updates });

      if (response.status === ResponseStatus.SUCCESS) {
        return {
          success: true,
          invoiceId: response.data.invoiceId,
        };
      }

      console.error(response.error);
      setInvoiceUpdateError(response.error);
      return { success: false };
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setInvoiceUpdateError(FrontEndErrorMessages.GENERIC);
      return { success: false };
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
