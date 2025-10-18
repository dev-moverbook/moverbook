"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";

export const useCompanyInsurance = (
  companyId: Id<"companies">
): Doc<"insurancePolicies">[] | undefined => {
  const response = useQuery<typeof api.insurancePolicies.getInsurancePolicies>(
    api.insurancePolicies.getInsurancePolicies,
    { companyId }
  );

  return response;
};
