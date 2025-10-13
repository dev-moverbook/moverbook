"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

export const useResetRoomsCategoriesItems = () => {
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const resetRoomsCategoriesItemsMutation = useMutation(
    api.rooms.resetRoomsAndCategoriesAndItems
  );

  const resetRoomsCategoriesItems = async (
    companyId: Id<"companies">
  ): Promise<boolean> => {
    setResetLoading(true);
    setResetError(null);

    try {
      await resetRoomsCategoriesItemsMutation({ companyId });

      return true;
    } catch (error) {
      setErrorFromConvexError(error, setResetError);
      return false;
    } finally {
      setResetLoading(false);
    }
  };

  return {
    resetRoomsCategoriesItems,
    resetLoading,
    resetError,
    setResetError,
  };
};
