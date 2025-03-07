import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

export const useRevokeInvite = () => {
  const [revokeLoading, setRevokeLoading] = useState<boolean>(false);
  const [revokeError, setRevokeError] = useState<string | null>(null);

  const clerkRevokeInviteUser = useAction(api.invitations.revokeInviteUser);

  const revokeInviteUser = async (
    invitationId: Id<"invitations">
  ): Promise<boolean> => {
    setRevokeLoading(true);
    setRevokeError(null);

    try {
      const response = await clerkRevokeInviteUser({ invitationId });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      } else {
        setRevokeError(response.error);
        return false;
      }
    } catch (error) {
      console.error(error);
      setRevokeError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setRevokeLoading(false);
    }
  };

  return { revokeInviteUser, revokeLoading, revokeError, setRevokeError };
};
