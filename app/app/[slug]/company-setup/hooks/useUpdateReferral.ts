import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

export const useUpdateReferral = () => {
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const updateReferralMutation = useMutation(api.referrals.updateReferral);

  const updateReferral = async (
    referralId: Id<"referrals">,
    updates: { name: string }
  ): Promise<boolean> => {
    setUpdateLoading(true);
    setUpdateError(null);

    try {
      await updateReferralMutation({ referralId, updates });

      return true;
    } catch (error) {
      setErrorFromConvexError(error, setUpdateError);
      return false;
    } finally {
      setUpdateLoading(false);
    }
  };

  return { updateReferral, updateLoading, updateError, setUpdateError };
};
