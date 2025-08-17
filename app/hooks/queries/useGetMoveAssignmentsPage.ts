// app/hooks/queries/moves/useGetMoveAssignmentsPage.ts
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";
import { GetMoveAssignmentsPageData } from "@/types/convex-responses";

type UseGetMoveAssignmentsPageLoading = { status: QueryStatus.LOADING };
type UseGetMoveAssignmentsPageError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseGetMoveAssignmentsPageSuccess = {
  status: QueryStatus.SUCCESS;
  data: GetMoveAssignmentsPageData;
};

export type UseGetMoveAssignmentsPageResult =
  | UseGetMoveAssignmentsPageLoading
  | UseGetMoveAssignmentsPageError
  | UseGetMoveAssignmentsPageSuccess;

export const useGetMoveAssignmentsPage = (
  moveId: Id<"move">
): UseGetMoveAssignmentsPageResult => {
  const response = useQuery<typeof api.moveAssignments.getMoveAssignmentsPage>(
    api.moveAssignments.getMoveAssignmentsPage,
    { moveId }
  );

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
    data: response.data,
  };
};
