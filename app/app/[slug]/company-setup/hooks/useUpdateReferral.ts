import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

export const useUpdateReferral = () => {
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const updateReferralMutation = useMutation(api.referrals.updateReferral);

  const updateReferral = async (
    referralId: Id<"referrals">,
    updates: { name: string }
  ): Promise<boolean> => {
    setUpdateLoading(true);
    setUpdateError(null);

    try {
      const response = await updateReferralMutation({ referralId, updates });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setUpdateError(FrontEndErrorMessages.GENERIC);
      return false;
    } catch (error) {
      console.error(error);
      setUpdateError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setUpdateLoading(false);
    }
  };

  return { updateReferral, updateLoading, updateError, setUpdateError };
};
