import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";

type UseActiveReferralsLoading = { status: QueryStatus.LOADING };
type UseActiveReferralsError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseActiveReferralsSuccess = {
  status: QueryStatus.SUCCESS;
  referrals: Doc<"referrals">[];
};

export type UseActiveReferralsResult =
  | UseActiveReferralsLoading
  | UseActiveReferralsError
  | UseActiveReferralsSuccess;

export const useActiveReferrals = (
  companyId: Id<"companies"> | null
): UseActiveReferralsResult => {
  const response = useQuery(
    api.referrals.getActiveReferralsByCompanyId,
    companyId ? { companyId } : "skip"
  );

  if (!companyId || !response) {
    return { status: QueryStatus.LOADING };
  }

  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage: response.error ?? "Failed to load company referrals.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    referrals: response.data.referrals,
  };
};
