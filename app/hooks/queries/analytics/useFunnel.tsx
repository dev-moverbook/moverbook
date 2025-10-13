"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { FunnelPoint } from "@/types/types";

type UseFunnelArgs = {
  companyId: Id<"companies">;
  startDate: string;
  endDate: string;
  salesRepId: Id<"users"> | null;
  referralId: Id<"referrals"> | null;
};

export function useFunnel({
  companyId,
  startDate,
  endDate,
  salesRepId,
  referralId,
}: UseFunnelArgs): FunnelPoint[] | undefined {
  const response = useQuery(
    api.move.getFunnel,

    {
      companyId,
      startDate,
      endDate,
      salesRepId,
      referralId,
    }
  );

  return response;
}
