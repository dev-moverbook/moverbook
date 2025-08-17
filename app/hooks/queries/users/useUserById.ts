import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";

interface UseUsersByStatusResult {
  user: Doc<"users"> | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useUserById = (
  userId: Id<"users"> | null
): UseUsersByStatusResult => {
  const response = useQuery(
    api.users.getUserById,
    userId ? { userId } : "skip"
  );

  const isLoading = response === undefined;
  const isError = response?.status === ResponseStatus.ERROR;

  return {
    user:
      response?.status === ResponseStatus.SUCCESS ? response.data.user : null,
    isLoading,
    isError,
    errorMessage: isError ? (response?.error ?? "Failed to load user.") : null,
  };
};
