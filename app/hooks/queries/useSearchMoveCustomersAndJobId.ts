import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { Doc } from "@/convex/_generated/dataModel";

interface UseSearchMoveCustomersResult {
  data?: {
    moveCustomers: Doc<"moveCustomers">[];
    moves: Doc<"move">[];
  } | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useSearchMoveCustomersAndJobId = (
  companyId: Id<"companies"> | null,
  searchTerm: string
): UseSearchMoveCustomersResult => {
  const response = useQuery(
    api.moveCustomers.searchMoveCustomersAndJobId,
    companyId && searchTerm.trim() ? { companyId, searchTerm } : "skip"
  );

  const isLoading = response === undefined;
  const isError = response?.status === ResponseStatus.ERROR;
  const data =
    response?.status === ResponseStatus.SUCCESS ? response.data : null;

  return {
    data,
    isLoading,
    isError,
    errorMessage: isError
      ? (response?.error ?? "Failed to search customers.")
      : null,
  };
};
