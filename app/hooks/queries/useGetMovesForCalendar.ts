// app/hooks/queries/move/useMovesForCalendar.ts
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";
import { MoveStatus, MoveTimes, PriceOrder } from "@/types/types";
import { EnrichedMove } from "@/types/convex-responses";

type UseMovesForCalendarLoading = { status: QueryStatus.LOADING };
type UseMovesForCalendarError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseMovesForCalendarSuccess = {
  status: QueryStatus.SUCCESS;
  data: EnrichedMove[];
};

export type UseMovesForCalendarResult =
  | UseMovesForCalendarLoading
  | UseMovesForCalendarError
  | UseMovesForCalendarSuccess;

interface UseMovesForCalendarParams {
  start: string;
  end: string;
  companyId: Id<"companies"> | null;
  moveTimeFilter: MoveTimes[];
  statuses?: MoveStatus[];
  salesRepId?: Id<"users"> | null;
  priceOrder?: PriceOrder | null;
}

export const useMovesForCalendar = ({
  start,
  end,
  companyId,
  moveTimeFilter,
  statuses,
  salesRepId,
  priceOrder,
}: UseMovesForCalendarParams): UseMovesForCalendarResult => {
  const response = useQuery<typeof api.move.getMovesForCalendar>(
    api.move.getMovesForCalendar,
    companyId
      ? {
          start,
          end,
          companyId,
          statuses,
          salesRepId,
          priceOrder,
          moveTimeFilter,
        }
      : "skip"
  );

  if (!companyId || !response) {
    return { status: QueryStatus.LOADING };
  }

  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage: response.error ?? "Failed to load moves.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    data: response.data.moves,
  };
};
