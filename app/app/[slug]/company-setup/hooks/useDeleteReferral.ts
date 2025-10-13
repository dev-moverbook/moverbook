import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

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
      await deleteReferralMutation({
        referralId,
        updates: { isActive: false },
      });

      return true;
    } catch (error) {
      setErrorFromConvexError(error, setDeleteError);
      return false;
    } finally {
      setDeleteLoading(false);
    }
  };

  return { deleteReferral, deleteLoading, deleteError, setDeleteError };
};
