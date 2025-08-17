"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";
import { RecentMoveMessageSummary } from "@/types/types";

type UseRecentMessagesLoading = { status: QueryStatus.LOADING };
type UseRecentMessagesError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseRecentMessagesSuccess = {
  status: QueryStatus.SUCCESS;
  data: RecentMoveMessageSummary[];
};

export type UseRecentMessagesResult =
  | UseRecentMessagesLoading
  | UseRecentMessagesError
  | UseRecentMessagesSuccess;

export const useRecentMessagesByCompanyId = (
  companyId: Id<"companies"> | null
): UseRecentMessagesResult => {
  const response = useQuery(
    api.messages.getRecentMessagesByCompanyId,
    companyId ? { companyId } : "skip"
  );

  if (!companyId || !response) {
    return { status: QueryStatus.LOADING };
  }

  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage: response.error ?? "Failed to load recent messages.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    data: response.data.messages,
  };
};
