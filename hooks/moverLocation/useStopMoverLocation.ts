"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

interface CreateMoveCustomerInput {
  moveId: Id<"moves">;
}

export const useStopMoverLocation = () => {
  const [stopMoverLocationLoading, setLoading] = useState<boolean>(false);
  const [stopMoverLocationError, setError] = useState<string | null>(null);

  const stopMoverLocationMutation = useMutation(
    api.moverLocations.stopMoverLocationSharing
  );

  const stopMoverLocation = async (
    data: CreateMoveCustomerInput
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      return await stopMoverLocationMutation(data);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    stopMoverLocation,
    stopMoverLocationLoading,
    stopMoverLocationError,
    setStopMoverLocationError: setError,
  };
};
