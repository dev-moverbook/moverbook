import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";

export const useGetMoverLocation = (
  moveId: Id<"moves">
): Doc<"moverLocations"> | null | undefined => {
  return useQuery(api.moverLocations.getMoverLocation, {
    moveId,
  });
};
