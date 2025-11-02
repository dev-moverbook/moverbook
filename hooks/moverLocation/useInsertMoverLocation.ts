"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

interface InsertMoverLocationInput {
  moveId: Id<"moves">;
}

export const useInsertMoverLocation = () => {
  const [insertMoverLocationLoading, setLoading] = useState<boolean>(false);
  const [insertMoverLocationError, setError] = useState<string | null>(null);

  const insertMoverLocationMutation = useMutation(
    api.moverLocations.inserMoverLocationSharing
  );

  const insertMoverLocation = async (
    data: InsertMoverLocationInput
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      return await insertMoverLocationMutation(data);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    insertMoverLocation,
    insertMoverLocationLoading,
    insertMoverLocationError,
    setInsertMoverLocationError: setError,
  };
};
