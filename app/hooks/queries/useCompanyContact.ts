import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";

export const useCompanyContact = (
  companyId: Id<"companies">,
  { enabled = true }: { enabled?: boolean } = {}
): Doc<"companyContact"> | undefined => {
  const response = useQuery(
    api.companyContact.getCompanyContact,
    enabled ? { companyId } : "skip"
  );

  return response;
};
