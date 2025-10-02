"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";
import { FunnelPoint } from "@/types/types";

type UseFunnelLoading = { status: QueryStatus.LOADING };
type UseFunnelError = { status: QueryStatus.ERROR; errorMessage: string };
type UseFunnelSuccess = {
  status: QueryStatus.SUCCESS;
  data: { funnel: FunnelPoint[] };
};

export type UseFunnelResult =
  | UseFunnelLoading
  | UseFunnelError
  | UseFunnelSuccess;

type UseFunnelArgs = {
  companyId: Id<"companies"> | null;
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
}: UseFunnelArgs): UseFunnelResult {
  if (!companyId) {
    return {
      status: QueryStatus.ERROR,
      errorMessage: "Company ID is required",
    };
  }

  const response = useQuery(api.move.getFunnel, {
    companyId,
    startDate,
    endDate,
    salesRepId,
    referralId,
  });

  if (!response) {
    return { status: QueryStatus.LOADING };
  }

  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage: response.error ?? "Failed to load funnel.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    data: {
      funnel: response.data.funnel,
    },
  };
}
