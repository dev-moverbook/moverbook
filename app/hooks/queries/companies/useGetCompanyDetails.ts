"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { QueryStatus, ResponseStatus } from "@/types/enums";

type CompanyDetailsData = {
  company: Doc<"companies">;
  compliance: Doc<"compliance">;
  webIntegrations: Doc<"webIntegrations">;
  companyContact: Doc<"companyContact">;
};

type CompanyDetailsLoading = { status: QueryStatus.LOADING };
type CompanyDetailsError = { status: QueryStatus.ERROR; errorMessage: string };
type CompanyDetailsSuccess = {
  status: QueryStatus.SUCCESS;
  data: CompanyDetailsData;
};

export type UseGetCompanyDetailsResult =
  | CompanyDetailsLoading
  | CompanyDetailsError
  | CompanyDetailsSuccess;

export function isCompanyDetailsSuccess(
  r: UseGetCompanyDetailsResult
): r is CompanyDetailsSuccess {
  return r.status === QueryStatus.SUCCESS;
}

export const useGetCompanyDetails = (
  companyId: Id<"companies"> | null
): UseGetCompanyDetailsResult => {
  const response = useQuery<typeof api.companies.getCompanyDetails>(
    api.companies.getCompanyDetails,
    companyId ? { companyId } : "skip"
  );

  if (!companyId || !response) {
    return { status: QueryStatus.LOADING };
  }

  if (response.status === ResponseStatus.ERROR) {
    return {
      status: QueryStatus.ERROR,
      errorMessage: response.error ?? "Failed to load company details.",
    };
  }

  // SUCCESS
  return {
    status: QueryStatus.SUCCESS,
    data: {
      company: response.data.company,
      compliance: response.data.compliance,
      webIntegrations: response.data.webIntegrations,
      companyContact: response.data.companyContact,
    },
  };
};
