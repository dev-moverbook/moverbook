"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { GetCompanyDetailsData } from "@/types/convex-responses";

export const useGetCompanyDetails = (
  companyId: Id<"companies">
): GetCompanyDetailsData | undefined => {
  const response = useQuery<typeof api.companies.getCompanyDetails>(
    api.companies.getCompanyDetails,
    companyId ? { companyId } : "skip"
  );
  return response;
};
