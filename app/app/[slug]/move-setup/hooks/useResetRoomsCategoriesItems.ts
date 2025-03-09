"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

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
      const response = await resetRoomsCategoriesItemsMutation({ companyId });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setResetError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setResetError(FrontEndErrorMessages.GENERIC);
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
