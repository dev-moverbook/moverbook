import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";

export const useMovesForMoverCalendar = (args: {
  companyId: Id<"companies">;
  moverId: Id<"users"> | null;
  start: string;
  end: string;
}): Doc<"move">[] | undefined => {
  const response = useQuery(
    api.move.getMovesForMoverCalendar,
    args
      ? {
          companyId: args.companyId,
          moverId: args.moverId,
          start: args.start,
          end: args.end,
        }
      : "skip"
  );

  return response;
};
