import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import {
  GetMovePageForMoverLeadData,
  GetMovePageForMoverMemberData,
} from "@/types/convex-responses";

export const useMovePageForMover = (
  moveId: Id<"moves">
): GetMovePageForMoverMemberData | GetMovePageForMoverLeadData | undefined => {
  const response = useQuery(api.moveAssignments.getMovePageForMover, {
    moveId,
  });

  return response;
};
