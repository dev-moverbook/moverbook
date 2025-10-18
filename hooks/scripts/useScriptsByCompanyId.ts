import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";

export const useScriptsByCompanyId = (
  companyId: Id<"companies">
): Doc<"scripts">[] | undefined => {
  const response = useQuery<typeof api.scripts.getScriptsByCompanyId>(
    api.scripts.getScriptsByCompanyId,
    { companyId }
  );

  return response;
};
