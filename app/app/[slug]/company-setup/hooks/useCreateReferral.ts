import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { Id } from "@/convex/_generated/dataModel";

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

      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }
      console.error(response.error);
      setCreateError(FrontEndErrorMessages.GENERIC);
      return false;
    } catch (error) {
      console.error(error);
      setCreateError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setCreateLoading(false);
    }
  };

  return { createReferral, createLoading, createError, setCreateError };
};
