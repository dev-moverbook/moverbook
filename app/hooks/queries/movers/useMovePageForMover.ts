import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";

type MovePageForMoverMember = {
  isLead: false;
  assignment: Doc<"moveAssignments">;
};

type MovePageForMoverLead = {
  isLead: true;
  assignment: Doc<"moveAssignments">;
  preMoveDoc: Doc<"preMoveDocs"> | null;
  discounts: Doc<"discounts">[];
  additionalFees: Doc<"additionalFees">[];
  invoice: Doc<"invoices"> | null;
  additionalLiabilityCoverage: Doc<"additionalLiabilityCoverage"> | null;
  fees: Doc<"fees">[];
};

export type GetMovePageForMoverSuccessData =
  | MovePageForMoverMember
  | MovePageForMoverLead;

type UseMovePageForMoverLoading = { status: QueryStatus.LOADING };
type UseMovePageForMoverError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseMovePageForMoverSuccess = {
  status: QueryStatus.SUCCESS;
  data: GetMovePageForMoverSuccessData;
};

export type UseMovePageForMoverResult =
  | UseMovePageForMoverLoading
  | UseMovePageForMoverError
  | UseMovePageForMoverSuccess;

export const useMovePageForMover = (
  moveId: Id<"move">
): UseMovePageForMoverResult => {
  const response = useQuery(api.moveAssignments.getMovePageForMover, {
    moveId,
  });

  if (!moveId || !response) {
    return { status: QueryStatus.LOADING };
  }

  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage: response.error ?? "Failed to load move page for mover.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    data: response.data,
  };
};
