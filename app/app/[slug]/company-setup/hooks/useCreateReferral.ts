import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

export const useCreateReferral = () => {
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const createReferralMutation = useMutation(api.referrals.createReferral);

  const createReferral = async (
    companyId: Id<"companies">,
    name: string
  ): Promise<boolean> => {
    setCreateLoading(true);
    setCreateError(null);

    try {
      const response = await createReferralMutation({ companyId, name });

      return true;
    } catch (error) {
      setErrorFromConvexError(error, setCreateError);
      return false;
    } finally {
      setCreateLoading(false);
    }
  };

  return { createReferral, createLoading, createError, setCreateError };
};
