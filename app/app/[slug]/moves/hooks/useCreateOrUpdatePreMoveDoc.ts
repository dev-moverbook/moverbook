"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

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
  ): Promise<{ success: boolean; preMoveDocId?: Id<"preMoveDocs"> }> => {
    setCreateOrUpdatePreMoveDocLoading(true);
    setCreateOrUpdatePreMoveDocError(null);

    try {
      const response = await mutationFn({ moveId, updates });

      if (response.status === ResponseStatus.SUCCESS) {
        return { success: true, preMoveDocId: response.data.preMoveDocId };
      }

      console.error(response.error);
      setCreateOrUpdatePreMoveDocError(response.error);
      return { success: false };
    } catch (error) {
      console.error(FrontEndErrorMessages.GENERIC, error);
      setCreateOrUpdatePreMoveDocError(FrontEndErrorMessages.GENERIC);
      return { success: false };
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
