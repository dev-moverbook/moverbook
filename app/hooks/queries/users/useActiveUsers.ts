import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";

interface UseUsersByStatusResult {
  users: Doc<"users">[] | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useUsersByStatus = (
  companyId: Id<"companies"> | null,
  isActive: boolean
): UseUsersByStatusResult => {
  const response = useQuery(
    api.users.getAllUsersByCompanyId,
    companyId ? { companyId, isActive } : "skip"
  );

  const isLoading = response === undefined;
  const isError = response?.status === ResponseStatus.ERROR;

  return {
    users:
      response?.status === ResponseStatus.SUCCESS ? response.data.users : null,
    isLoading,
    isError,
    errorMessage: isError
      ? (response?.error ?? "Failed to load company users.")
      : null,
  };
};
