"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

export const useDeleteLabor = () => {
  const [deleteLaborLoading, setDeleteLaborLoading] = useState<boolean>(false);
  const [deleteLaborError, setDeleteLaborError] = useState<string | null>(null);

  const deleteLaborMutation = useMutation(api.labor.updateLabor);

  const deleteLabor = async (laborId: Id<"labor">): Promise<boolean> => {
    setDeleteLaborLoading(true);
    setDeleteLaborError(null);

    try {
      const response = await deleteLaborMutation({
        laborId,
        updates: { isActive: false },
      });
      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setDeleteLaborError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setDeleteLaborError(FrontEndErrorMessages.GENERIC);
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
