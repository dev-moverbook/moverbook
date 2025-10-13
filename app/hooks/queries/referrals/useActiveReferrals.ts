import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";

export const useActiveReferrals = (
  companyId: Id<"companies"> | null
): Doc<"referrals">[] | undefined => {
  const response = useQuery(
    api.referrals.getActiveReferralsByCompanyId,
    companyId ? { companyId } : "skip"
  );

  return response;
};
