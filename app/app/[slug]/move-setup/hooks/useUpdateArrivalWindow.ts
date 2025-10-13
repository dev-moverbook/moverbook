"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

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
      await updateArrivalWindowMutation({
        arrivalWindowId,
        updates,
      });

      return true;
    } catch (error) {
      setErrorFromConvexError(error, setUpdateArrivalWindowError);
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
