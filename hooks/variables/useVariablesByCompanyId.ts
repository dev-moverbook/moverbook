import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { Doc } from "@/convex/_generated/dataModel";

export const useVariablesByCompanyId = (
  companyId: Id<"companies">
): Doc<"variables">[] | undefined => {
  const response = useQuery<typeof api.variables.getVariablesByCompanyId>(
    api.variables.getVariablesByCompanyId,
    { companyId }
  );

  return response;
};
