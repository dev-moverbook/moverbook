"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";

type UseSalesRepsAndReferralsLoading = { status: QueryStatus.LOADING };
type UseSalesRepsAndReferralsError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseSalesRepsAndReferralsSuccess = {
  status: QueryStatus.SUCCESS;
  data: {
    users: Doc<"users">[];
    referrals: Doc<"referrals">[];
  };
};

export type UseSalesRepsAndReferralsResult =
  | UseSalesRepsAndReferralsLoading
  | UseSalesRepsAndReferralsError
  | UseSalesRepsAndReferralsSuccess;

export const useSalesRepsAndReferrals = (
  companyId: Id<"companies"> | null
): UseSalesRepsAndReferralsResult => {
  const response = useQuery(
    api.users.getSalesRepsAndReferralByCompanyId,
    companyId ? { companyId } : "skip"
  );

  if (!companyId || !response) {
    return { status: QueryStatus.LOADING };
  }

  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage:
        response.error ?? "Failed to load sales reps and referrals.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    data: {
      users: response.data.users as Doc<"users">[],
      referrals: response.data.referrals as Doc<"referrals">[],
    },
  };
};
