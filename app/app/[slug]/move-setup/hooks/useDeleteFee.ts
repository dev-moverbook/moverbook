"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

export const useDeleteFee = () => {
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteFeeMutation = useMutation(api.fees.updateFee);

  const deleteFee = async (feeId: Id<"fees">): Promise<boolean> => {
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      const response = await deleteFeeMutation({
        feeId,
        updates: { isActive: false },
      });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setDeleteError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setDeleteError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    deleteFee,
    deleteLoading,
    deleteError,
    setDeleteError,
  };
};
