// app/hooks/queries/search/useSearchMoveCustomersAndJobId.ts
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";

type UseSearchMoveCustomersResultLoading = { status: QueryStatus.LOADING };
type UseSearchMoveCustomersResultError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseSearchMoveCustomersResultSuccess = {
  status: QueryStatus.SUCCESS;
  data: {
    moveCustomers: Doc<"moveCustomers">[];
    moves: Doc<"move">[];
  };
};

export type UseSearchMoveCustomersAndJobIdResult =
  | UseSearchMoveCustomersResultLoading
  | UseSearchMoveCustomersResultError
  | UseSearchMoveCustomersResultSuccess;

export const useSearchMoveCustomersAndJobId = (
  companyId: Id<"companies"> | null,
  searchTerm: string
): UseSearchMoveCustomersAndJobIdResult => {
  const trimmed = searchTerm?.trim() ?? "";

  const response = useQuery(
    api.moveCustomers.searchMoveCustomersAndJobId,
    companyId && trimmed ? { companyId, searchTerm: trimmed } : "skip"
  );

  if (!companyId || !trimmed || !response) {
    return { status: QueryStatus.LOADING };
  }

  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage: response.error ?? "Failed to search customers.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    data: {
      moveCustomers: response.data.moveCustomers,
      moves: response.data.moves,
    },
  };
};
