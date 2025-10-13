import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ClerkRoles } from "@/types/enums";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "../frontendUtils/errorHelper";

export const useInviteUser = () => {
  const [inviteLoading, setInviteLoading] = useState<boolean>(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const clerkInviteUserToOrganization = useAction(
    api.clerk.clerkInviteUserToOrganization
  );

  const inviteUser = async (
    companyId: Id<"companies">,
    email: string,
    role: ClerkRoles,
    hourlyRate: number | null
  ): Promise<boolean> => {
    setInviteLoading(true);
    setInviteError(null);

    try {
      await clerkInviteUserToOrganization({
        companyId,
        email,
        role: role as
          | ClerkRoles.MANAGER
          | ClerkRoles.MOVER
          | ClerkRoles.SALES_REP,
        hourlyRate,
      });
      return true;
    } catch (error) {
      setErrorFromConvexError(error, setInviteError);
      return false;
    } finally {
      setInviteLoading(false);
    }
  };

  return { inviteUser, inviteLoading, inviteError, setInviteError };
};
