"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";
import { StackedDay } from "@/types/types";

type Args = {
  companyId: Id<"companies">;
  startDate: string;
  endDate: string;
};

export function useStackedHistoricalRevenueByRep({
  companyId,
  startDate,
  endDate,
}: Args): StackedDay[] | undefined {
  const response = useQuery(api.moves.getStackedHistoricalRevenueByRep, {
    companyId,
    startDate,
    endDate,
  });

  return response;
}
