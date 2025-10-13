import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";

export const useCompanyFees = (
  companyId: Id<"companies">
): Doc<"fees">[] | undefined => {
  const response = useQuery<typeof api.fees.getFees>(api.fees.getFees, {
    companyId,
  });

  return response;
};
