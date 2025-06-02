import { useQuery } from "convex/react";
import { ResponseStatus } from "@/types/enums";
import { api } from "@/convex/_generated/api";
import { GetUserByClerkIdData } from "@/types/convex-responses";

interface UseCurrentUserResult {
  data: GetUserByClerkIdData | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useCurrentUser = (): UseCurrentUserResult => {
  const response = useQuery<typeof api.users.getUserByClerkId>(
    api.users.getUserByClerkId
  );

  const isLoading = response === undefined;
  const isError = response?.status === ResponseStatus.ERROR;

  return {
    data: response?.status === ResponseStatus.SUCCESS ? response.data : null,
    isLoading,
    isError,
    errorMessage: isError
      ? (response.error ?? "Failed to load current user.")
      : null,
  };
};
