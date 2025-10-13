import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { GetMoveData } from "@/types/convex-responses";

export const useMoveContext = (moveId: Id<"move">): GetMoveData | undefined => {
  const response = useQuery<typeof api.move.getMoveContext>(
    api.move.getMoveContext,
    { moveId }
  );

  return response;
};
