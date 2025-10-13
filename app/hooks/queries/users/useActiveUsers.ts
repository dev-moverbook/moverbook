import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";

export const useUsersByStatus = (
  companyId: Id<"companies">,
  isActive: boolean
): Doc<"users">[] | undefined => {
  const response = useQuery(api.users.getAllUsersByCompanyId, {
    companyId,
    isActive,
  });

  return response;
};
