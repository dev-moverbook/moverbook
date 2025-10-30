"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { GetCompanyRatesData } from "@/types/convex-responses";

export const useCompanyRates = (
  companyId: Id<"companies">
): GetCompanyRatesData | undefined => {
  const response = useQuery(api.labors.getCompanyRates, { companyId });

  return response;
};
