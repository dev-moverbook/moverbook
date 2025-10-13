import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";

export const useActiveInvitations = (
  companyId: Id<"companies">
): Doc<"invitations">[] | undefined => {
  const response = useQuery(api.invitations.getActiveInvitationsByCompanyId, {
    companyId,
  });

  return response;
};
