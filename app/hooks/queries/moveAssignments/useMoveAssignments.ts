"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";
import { EnrichedMoveAssignment } from "@/types/convex-responses";

export interface GetMoveAssignmentsSuccessData {
  assignments: EnrichedMoveAssignment[];
}

type UseMoveAssignmentsLoading = { status: QueryStatus.LOADING };
type UseMoveAssignmentsError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseMoveAssignmentsSuccess = {
  status: QueryStatus.SUCCESS;
  data: GetMoveAssignmentsSuccessData;
};

export type UseMoveAssignmentsResult =
  | UseMoveAssignmentsLoading
  | UseMoveAssignmentsError
  | UseMoveAssignmentsSuccess;

export const useMoveAssignments = (
  moveId: Id<"move">
): UseMoveAssignmentsResult => {
  const response = useQuery(api.moveAssignments.getMoveAssignments, { moveId });

  if (!response) {
    return { status: QueryStatus.LOADING };
  }

  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage: response.error ?? "Failed to load move assignments.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    data: response.data as GetMoveAssignmentsSuccessData,
  };
};
