"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MoveStatus, MoveTimes, PriceOrder } from "@/types/types";
import { EnrichedMove } from "@/types/convex-responses";

interface UseMovesForCalendarParams {
  start: string;
  end: string;
  companyId: Id<"companies">;
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
}: UseMovesForCalendarParams): EnrichedMove[] | undefined => {
  const response = useQuery<typeof api.moves.getMovesForCalendar>(
    api.moves.getMovesForCalendar,
    {
      start,
      end,
      companyId,
      statuses,
      salesRepId,
      priceOrder,
      moveTimeFilter,
    }
  );

  return response;
};
