import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";

export const useCompanyContact = (
  companyId: Id<"companies">,
  { enabled = true }: { enabled?: boolean } = {}
): Doc<"companyContacts"> | undefined => {
  const response = useQuery(
    api.companyContacts.getCompanyContact,
    enabled ? { companyId } : "skip"
  );

  return response;
};
