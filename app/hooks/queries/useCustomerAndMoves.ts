import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { Doc } from "@/convex/_generated/dataModel";

interface UseCustomerAndMovesResult {
  data?: {
    moveCustomer: Doc<"moveCustomers">;
    moves: Doc<"move">[];
  } | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useCustomerAndMoves = (
  moveCustomerId: Id<"moveCustomers"> | null
): UseCustomerAndMovesResult => {
  const response = useQuery<typeof api.moveCustomers.getCustomerAndMoves>(
    api.moveCustomers.getCustomerAndMoves,
    moveCustomerId ? { moveCustomerId } : "skip"
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
      ? (response?.error ?? "Failed to load customer and moves.")
      : null,
  };
};
