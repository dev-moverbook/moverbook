import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { GetMoveData } from "@/types/convex-responses";

export const useMoveContext = (
  moveId: Id<"moves">
): GetMoveData | undefined => {
  const response = useQuery<typeof api.moves.getMoveContext>(
    api.moves.getMoveContext,
    { moveId }
  );

  return response;
};
