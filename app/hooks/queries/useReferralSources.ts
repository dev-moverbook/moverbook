// app/hooks/queries/referrals/useReferralSources.ts
"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";
import { SelectOption } from "@/types/types";

type UseReferralSourcesLoading = { status: QueryStatus.LOADING };
type UseReferralSourcesError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseReferralSourcesSuccess = {
  status: QueryStatus.SUCCESS;
  options: SelectOption[];
};

export type UseReferralSourcesResult =
  | UseReferralSourcesLoading
  | UseReferralSourcesError
  | UseReferralSourcesSuccess;

export const useReferralSources = (
  companyId: Id<"companies"> | null
): UseReferralSourcesResult => {
  const response = useQuery<typeof api.referrals.getActiveReferralsByCompanyId>(
    api.referrals.getActiveReferralsByCompanyId,
    companyId ? { companyId } : "skip"
  );

  // loading (also covers no companyId yet)
  if (!companyId || !response) {
    return { status: QueryStatus.LOADING };
  }

  // error
  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage: response.error ?? "Failed to load referrals.",
    };
  }

  // success
  return {
    status: QueryStatus.SUCCESS,
    options:
      response.data.referrals?.map((ref) => ({
        label: ref.name,
        value: ref.name,
      })) ?? [],
  };
};
