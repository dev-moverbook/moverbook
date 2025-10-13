"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

interface PreMoveDocUpdates {
  customerSignature?: string;
  customerSignedAt?: number;
  repSignature?: string;
  repSignedAt?: number;
}

export const useCreateOrUpdatePreMoveDoc = () => {
  const [createOrUpdatePreMoveDocLoading, setCreateOrUpdatePreMoveDocLoading] =
    useState<boolean>(false);
  const [createOrUpdatePreMoveDocError, setCreateOrUpdatePreMoveDocError] =
    useState<string | null>(null);

  const mutationFn = useMutation(api.preMoveDocs.createOrUpdatePreMoveDoc);

  const createOrUpdatePreMoveDoc = async (
    moveId: Id<"move">,
    updates: PreMoveDocUpdates
  ): Promise<boolean> => {
    setCreateOrUpdatePreMoveDocLoading(true);
    setCreateOrUpdatePreMoveDocError(null);

    try {
      await mutationFn({ moveId, updates });

      return true;
    } catch (error) {
      setErrorFromConvexError(error, setCreateOrUpdatePreMoveDocError);
      return false;
    } finally {
      setCreateOrUpdatePreMoveDocLoading(false);
    }
  };

  return {
    createOrUpdatePreMoveDoc,
    createOrUpdatePreMoveDocLoading,
    createOrUpdatePreMoveDocError,
    setCreateOrUpdatePreMoveDocError,
  };
};
