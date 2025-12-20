"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";
import { LocationInput, MoveItemInput } from "@/types/form-types";

export interface RequestMoveUpdateInput {
  moveId: Id<"moves">;
  requestedLocations?: LocationInput[];
  requestedMoveItems?: MoveItemInput[];
}

export const useCreateMoveChangeRequest = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const requestMoveUpdateMutation = useMutation(
    api.moveChangeRequests.insertMoveUpdate
  );

  const requestMoveUpdate = async (
    data: RequestMoveUpdateInput
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await requestMoveUpdateMutation(data);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requestMoveUpdate,
    isLoading,
    error,
    setError,
  };
};
