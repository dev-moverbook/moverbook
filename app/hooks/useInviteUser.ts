import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";

export const useInviteUser = () => {
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const clerkInviteUserToOrganization = useAction(
    api.clerk.clerkInviteUserToOrganization
  );

  const inviteUser = async (
    slug: string,
    email: string,
    role: ClerkRoles,
    hourlyRate: string | null
  ): Promise<boolean> => {
    setInviteLoading(true);
    setInviteError(null);
    let parsedHourlyRate: number | null = null;
    if (hourlyRate) {
      parsedHourlyRate = parseInt(hourlyRate);
    }

    try {
      const response = await clerkInviteUserToOrganization({
        slug,
        email,
        role: role as
          | ClerkRoles.MANAGER
          | ClerkRoles.MOVER
          | ClerkRoles.SALES_REP,
        hourlyRate: parsedHourlyRate,
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

  return { inviteUser, inviteLoading, inviteError };
};
