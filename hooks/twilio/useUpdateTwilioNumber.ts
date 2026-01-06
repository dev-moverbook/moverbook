import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";
import { TollfreeVerificationStatus } from "@/types/types";

export const useUpdateTwilioNumber = () => {
  const updateTwilioNumberAction = useMutation(
    api.twilioPhoneNumbers.updateTwilioPhoneNumber
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateTwilioNumber = async (
    id: Id<"twilioPhoneNumbers">,
    updates: {
      tollfreeVerificationStatus: TollfreeVerificationStatus;
      tollfreeInquiryId: string;
    }
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await updateTwilioNumberAction({ id, updates });
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateTwilioNumber, error, isLoading, setError };
};
