"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";
import { ChangeRequestStatus } from "@/types/types";

export interface ProcessMoveChangeRequestInput {
  moveChangeRequestId: Id<"moveChangeRequests">;
  updates: {
    status: ChangeRequestStatus;
    rejectionNotes?: string;
  };
}

export const useProcessMoveChange = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const processMoveChangeRequestMutation = useMutation(
    api.moveChangeRequests.processMoveChangeRequest
  );

  const processMoveChangeRequest = async (
    data: ProcessMoveChangeRequestInput
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await processMoveChangeRequestMutation(data);
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    processMoveChangeRequest,
    isLoading,
    error,
    setError,
  };
};
