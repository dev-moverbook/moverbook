"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { GetSalesRepsAndReferralByCompanyIdData } from "@/types/convex-responses";

export const useSalesRepsAndReferrals = (
  companyId: Id<"companies">
): GetSalesRepsAndReferralByCompanyIdData | undefined => {
  const response = useQuery(api.users.getSalesRepsAndReferralByCompanyId, {
    companyId,
  });

  return response;
};
