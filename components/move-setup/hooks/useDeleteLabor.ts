"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

export const useDeleteLabor = () => {
  const [deleteLaborLoading, setDeleteLaborLoading] = useState<boolean>(false);
  const [deleteLaborError, setDeleteLaborError] = useState<string | null>(null);

  const deleteLaborMutation = useMutation(api.labor.updateLabor);

  const deleteLabor = async (laborId: Id<"labor">): Promise<boolean> => {
    setDeleteLaborLoading(true);
    setDeleteLaborError(null);

    try {
      await deleteLaborMutation({
        laborId,
        updates: { isActive: false },
      });
      return true;
    } catch (error) {
      setErrorFromConvexError(error, setDeleteLaborError);
      return false;
    } finally {
      setDeleteLaborLoading(false);
    }
  };

  return {
    deleteLabor,
    deleteLaborLoading,
    deleteLaborError,
    setDeleteLaborError,
  };
};
