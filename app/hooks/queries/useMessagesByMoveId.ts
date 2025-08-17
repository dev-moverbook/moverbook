// app/hooks/queries/messages/useMessagesByMoveId.ts
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";

type UseMessagesByMoveIdLoading = { status: QueryStatus.LOADING };
type UseMessagesByMoveIdError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseMessagesByMoveIdSuccess = {
  status: QueryStatus.SUCCESS;
  messages: Doc<"messages">[];
};

export type UseMessagesByMoveIdResult =
  | UseMessagesByMoveIdLoading
  | UseMessagesByMoveIdError
  | UseMessagesByMoveIdSuccess;

export const useMessagesByMoveId = (
  moveId: Id<"move"> | null
): UseMessagesByMoveIdResult => {
  const response = useQuery<typeof api.messages.getMessagesByMoveId>(
    api.messages.getMessagesByMoveId,
    moveId ? { moveId } : "skip"
  );

  // Loading (covers missing moveId or first render)
  if (!moveId || !response) {
    return { status: QueryStatus.LOADING };
  }

  // Error from Convex
  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage: response.error ?? "Failed to load messages.",
    };
  }

  // Success
  return {
    status: QueryStatus.SUCCESS,
    messages: response.data.messages,
  };
};
