"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";
import { HistoricalPoint } from "@/types/types";

export const useHistoricalAnalytics = (
  companyId: Id<"companies">,
  startDate: string,
  endDate: string,
  salesRepId: Id<"users"> | null,
  referralId: Id<"referrals"> | null
): HistoricalPoint[] | undefined => {
  const response = useQuery(
    api.moves.getHistoricalAnalytics,

    {
      companyId,
      startDate,
      endDate,
      salesRepId,
      referralId,
    }
  );
  return response;
};
