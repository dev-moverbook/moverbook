"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { GetCompanyArrivalAndPoliciesData } from "@/types/convex-responses";

export const useCompanyArrivalAndPolicies = (
  companyId: Id<"companies">
): GetCompanyArrivalAndPoliciesData | undefined => {
  const result = useQuery<
    typeof api.arrivalWindows.getCompanyArrivalAndPolicies
  >(api.arrivalWindows.getCompanyArrivalAndPolicies, {
    companyId,
  });

  return result;
};
