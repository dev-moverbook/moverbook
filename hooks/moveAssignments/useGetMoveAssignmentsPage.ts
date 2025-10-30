"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GetMoveAssignmentsPageData } from "@/types/convex-responses";

export const useGetMoveAssignmentsPage = (
  moveId: Id<"moves">
): GetMoveAssignmentsPageData | undefined => {
  const response = useQuery<typeof api.moveAssignments.getMoveAssignmentsPage>(
    api.moveAssignments.getMoveAssignmentsPage,
    { moveId }
  );

  return response;
};
