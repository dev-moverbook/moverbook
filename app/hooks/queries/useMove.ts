import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { GetMoveData } from "@/types/convex-responses";

interface UseMoveResult {
  data: GetMoveData | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useMove = (moveId: Id<"move"> | null): UseMoveResult => {
  const response = useQuery<typeof api.move.getMove>(
    api.move.getMove,
    moveId ? { moveId } : "skip"
  );

  const isLoading = !response;
  const isError = response?.status === ResponseStatus.ERROR;

  return {
    data: response?.status === ResponseStatus.SUCCESS ? response.data : null,
    isLoading,
    isError,
    errorMessage: isError ? (response?.error ?? "Failed to load move.") : null,
  };
};
