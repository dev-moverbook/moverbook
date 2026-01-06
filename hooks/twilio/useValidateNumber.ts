import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";
import { TwilioInquirySchema } from "@/types/types";

export const useValidateTwilioNumber = () => {
  const validateTwilioNumberAction = useAction(
    api.actions.twilio.validateTwilioNumber
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validateTwilioNumber =
    async (): Promise<TwilioInquirySchema | null> => {
      setIsLoading(true);
      setError(null);

      try {
        return await validateTwilioNumberAction();
      } catch (error) {
        setErrorFromConvexError(error, setError);
        return null;
      } finally {
        setIsLoading(false);
      }
    };

  return { validateTwilioNumber, error, isLoading, setError };
};
