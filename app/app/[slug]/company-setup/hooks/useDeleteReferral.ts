import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

export const useDeleteReferral = () => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteReferralMutation = useMutation(api.referrals.updateReferral);

  const deleteReferral = async (
    referralId: Id<"referrals">
  ): Promise<boolean> => {
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      const response = await deleteReferralMutation({
        referralId,
        updates: { isActive: false },
      });

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setDeleteError(FrontEndErrorMessages.GENERIC);
      return false;
    } catch (error) {
      console.error(error);
      setDeleteError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setDeleteLoading(false);
    }
  };

  return { deleteReferral, deleteLoading, deleteError, setDeleteError };
};
