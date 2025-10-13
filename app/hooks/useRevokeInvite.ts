import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "../frontendUtils/errorHelper";

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
      return await clerkRevokeInviteUser({ invitationId });
    } catch (error) {
      setErrorFromConvexError(error, setRevokeError);
      return false;
    } finally {
      setRevokeLoading(false);
    }
  };

  return { revokeInviteUser, revokeLoading, revokeError, setRevokeError };
};
