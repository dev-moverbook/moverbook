import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { MessageSchema } from "@/types/convex-schemas";

interface UseMessagesByMoveIdResult {
  messages: MessageSchema[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useMessagesByMoveId = (
  moveId: Id<"move"> | null
): UseMessagesByMoveIdResult => {
  const response = useQuery<typeof api.messages.getMessagesByMoveId>(
    api.messages.getMessagesByMoveId,
    moveId ? { moveId } : "skip"
  );

  const isLoading = response === undefined;
  const isError = response?.status === ResponseStatus.ERROR;

  return {
    messages:
      response?.status === ResponseStatus.SUCCESS ? response.data.messages : [],
    isLoading,
    isError,
    errorMessage: isError
      ? (response.error ?? "Failed to load messages.")
      : null,
  };
};
