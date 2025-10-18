"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

export const useDeleteFee = () => {
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteFeeMutation = useMutation(api.fees.updateFee);

  const deleteFee = async (feeId: Id<"fees">): Promise<boolean> => {
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await deleteFeeMutation({
        feeId,
        updates: { isActive: false },
      });

      return true;
    } catch (error) {
      setErrorFromConvexError(error, setDeleteError);
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
