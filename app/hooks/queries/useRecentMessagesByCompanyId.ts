import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { RecentMoveMessageSummary } from "@/types/types";

interface UseRecentMessagesResult {
  messages: RecentMoveMessageSummary[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useRecentMessagesByCompanyId = (
  companyId: Id<"companies"> | null
): UseRecentMessagesResult => {
  const response = useQuery<typeof api.messages.getRecentMessagesByCompanyId>(
    api.messages.getRecentMessagesByCompanyId,
    companyId ? { companyId } : "skip"
  );

  const isLoading = response === undefined;
  const isError = response?.status === ResponseStatus.ERROR;

  return {
    messages:
      response?.status === ResponseStatus.SUCCESS ? response.data.messages : [],
    isLoading,
    isError,
    errorMessage: isError
      ? (response?.error ?? "Failed to load recent messages.")
      : null,
  };
};
