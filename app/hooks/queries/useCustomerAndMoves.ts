// app/hooks/queries/moves/useCustomerAndMoves.ts
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";
import { EnrichedMoveForMover } from "@/types/convex-responses";

type UseCustomerAndMovesLoading = { status: QueryStatus.LOADING };
type UseCustomerAndMovesError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseCustomerAndMovesSuccess = {
  status: QueryStatus.SUCCESS;
  data: {
    moveCustomer: Doc<"moveCustomers">;
    moves: EnrichedMoveForMover[];
  };
};

export type UseCustomerAndMovesResult =
  | UseCustomerAndMovesLoading
  | UseCustomerAndMovesError
  | UseCustomerAndMovesSuccess;

export const useCustomerAndMoves = (
  moveCustomerId: Id<"moveCustomers">
): UseCustomerAndMovesResult => {
  const response = useQuery<typeof api.moveCustomers.getCustomerAndMoves>(
    api.moveCustomers.getCustomerAndMoves,
    { moveCustomerId }
  );

  if (!response) {
    return { status: QueryStatus.LOADING };
  }

  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage: response.error ?? "Failed to load customer and moves.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    data: {
      moveCustomer: response.data.moveCustomer,
      moves: response.data.moves,
    },
  };
};
