// app/hooks/queries/insurance/useCompanyInsurance.ts
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";
import { GetInsurancePoliciesData } from "@/types/convex-responses";

type UseCompanyInsuranceLoading = { status: QueryStatus.LOADING };
type UseCompanyInsuranceError = {
  status: QueryStatus.ERROR;
  errorMessage: string;
};
type UseCompanyInsuranceSuccess = {
  status: QueryStatus.SUCCESS;
  data: GetInsurancePoliciesData;
};

export type UseCompanyInsuranceResult =
  | UseCompanyInsuranceLoading
  | UseCompanyInsuranceError
  | UseCompanyInsuranceSuccess;

export const useCompanyInsurance = (
  companyId: Id<"companies"> | null
): UseCompanyInsuranceResult => {
  const response = useQuery<typeof api.insurancePolicies.getInsurancePolicies>(
    api.insurancePolicies.getInsurancePolicies,
    companyId ? { companyId } : "skip"
  );

  if (!companyId || !response) {
    return { status: QueryStatus.LOADING };
  }

  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage: response.error ?? "Failed to load insurance policies.",
    };
  }

  return {
    status: QueryStatus.SUCCESS,
    data: response.data,
  };
};
