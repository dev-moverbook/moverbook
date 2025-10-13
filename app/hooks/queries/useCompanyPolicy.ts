import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";

// not used
export const useCompanyPolicy = (
  companyId: Id<"companies">
): Doc<"policies"> | undefined => {
  const response = useQuery<typeof api.policies.getPolicy>(
    api.policies.getPolicy,
    { companyId }
  );

  return response;
};
