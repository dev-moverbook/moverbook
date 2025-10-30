"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

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
    api.arrivalWindows.updateArrivalWindow
  );

  const updateArrivalWindow = async (
    arrivalWindowId: Id<"arrivalWindows">,
    updates: UpdateArrivalWindowData
  ): Promise<boolean> => {
    setUpdateArrivalWindowLoading(true);
    setUpdateArrivalWindowError(null);

    try {
      return await updateArrivalWindowMutation({
        arrivalWindowId,
        updates,
      });
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
