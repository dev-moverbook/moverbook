import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";

export const useScriptsAndVariables = (
  companyId: Id<"companies">
): { scripts: Doc<"scripts">[]; variables: Doc<"variables">[] } | undefined => {
  const response = useQuery(
    api.scripts.getActiveScriptsAndVariablesByCompanyId,
    { companyId }
  );

  return response;
};
