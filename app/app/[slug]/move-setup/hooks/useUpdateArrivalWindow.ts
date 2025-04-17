"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

interface UpdateArrivalWindowData {
  morningArrival?: string;
  morningEnd?: string;
  afternoonArrival?: string;
  afternoonEnd?: string;
}

export const useUpdateArrivalWindow = () => {
  const [updateArrivalWindowLoading, setUpdateArrivalWindowLoading] =
    useState<boolean>(false);
  const [updateArrivalWindowError, setUpdateArrivalWindowError] = useState<
    string | null
  >(null);

  const updateArrivalWindowMutation = useMutation(
    api.arrivalWindow.updateArrivalWindow
  );

  const updateArrivalWindow = async (
    arrivalWindowId: Id<"arrivalWindow">,
    updates: UpdateArrivalWindowData
  ): Promise<boolean> => {
    setUpdateArrivalWindowLoading(true);
    setUpdateArrivalWindowError(null);

    try {
      const response = await updateArrivalWindowMutation({
        arrivalWindowId,
        updates,
      });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setUpdateArrivalWindowError(response.error);
      return false;
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setUpdateArrivalWindowError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setUpdateArrivalWindowLoading(false);
    }
  };

  return {
    updateArrivalWindow,
    updateArrivalWindowLoading,
    updateArrivalWindowError,
    setUpdateArrivalWindowError,
  };
};
