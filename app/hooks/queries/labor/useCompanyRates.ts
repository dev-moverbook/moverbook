"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";

type UseCompanyRatesLoading = { status: QueryStatus.LOADING };
type UseCompanyRatesError = { status: QueryStatus.ERROR; errorMessage: string };
type UseCompanyRatesSuccess = {
  status: QueryStatus.SUCCESS;
  data: {
    labor: Doc<"labor">[];
    insurancePolicies: Doc<"insurancePolicies">[];
    travelFee: Doc<"travelFee">;
    creditCardFee: Doc<"creditCardFees">;
    fees: Doc<"fees">[];
  };
};

export type UseCompanyRatesResult =
  | UseCompanyRatesLoading
  | UseCompanyRatesError
  | UseCompanyRatesSuccess;

export const useCompanyRates = (
  companyId: Id<"companies"> | null
): UseCompanyRatesResult => {
  const response = useQuery(
    api.labor.getCompanyRates,
    companyId ? { companyId } : "skip"
  );

  if (!companyId || !response) {
    return { status: QueryStatus.LOADING };
  }

  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage: response.error ?? "Failed to load company rates.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    data: {
      labor: response.data.labor,
      insurancePolicies: response.data.insurancePolicies,
      travelFee: response.data.travelFee,
      creditCardFee: response.data.creditCardFee,
      fees: response.data.fees,
    },
  };
};
