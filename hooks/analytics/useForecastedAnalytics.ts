"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";
import { ForecastPoint } from "@/types/types";

export const useForecastedAnalytics = (
  companyId: Id<"companies">,
  startDate: string,
  endDate: string,
  salesRepId: Id<"users"> | null,
  referralId: Id<"referrals"> | null
): ForecastPoint[] | undefined => {
  const response = useQuery(api.move.getForecastedAnalytics, {
    companyId,
    startDate,
    endDate,
    salesRepId,
    referralId,
  });

  return response;
};
