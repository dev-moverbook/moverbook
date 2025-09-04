// hooks/queries/moves/useMovesForMoverCalendar.ts
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";

type UseMovesForMoverCalendarLoading = { status: QueryStatus.LOADING };
type UseMovesForMoverCalendarError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseMovesForMoverCalendarSuccess = {
  status: QueryStatus.SUCCESS;
  data: Doc<"move">[];
};

export type UseMovesForMoverCalendarResult =
  | UseMovesForMoverCalendarLoading
  | UseMovesForMoverCalendarError
  | UseMovesForMoverCalendarSuccess;

export const useMovesForMoverCalendar = (args?: {
  companyId: Id<"companies">;
  moverId: Id<"users"> | null;
  start: string;
  end: string;
}): UseMovesForMoverCalendarResult => {
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

  if (!args || !response) {
    return { status: QueryStatus.LOADING };
  }

  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage: response.error ?? "Failed to load mover calendar moves.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    data: response.data.moves as Doc<"move">[],
  };
};
