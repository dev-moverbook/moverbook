"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { EnrichedMoveAssignment } from "@/types/convex-responses";

export const useMoveAssignments = (
  moveId: Id<"moves">
): EnrichedMoveAssignment[] | undefined => {
  const response = useQuery(api.moveAssignments.getMoveAssignments, { moveId });

  return response;
};
