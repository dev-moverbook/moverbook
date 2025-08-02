import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

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
      const response = await clerkInviteUserToOrganization({
        companyId,
        email,
        role: role as
          | ClerkRoles.MANAGER
          | ClerkRoles.MOVER
          | ClerkRoles.SALES_REP,
        hourlyRate,
      });

      if (response.status !== ResponseStatus.SUCCESS) {
        setInviteError(response.error);
      }

      return response.status === ResponseStatus.SUCCESS;
    } catch (error) {
      console.error(FrontEndErrorMessages.INVITE_USER_ERROR, error);
      setInviteError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setInviteLoading(false);
    }
  };

  return { inviteUser, inviteLoading, inviteError, setInviteError };
};
