import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

export const useCreateTwilioNumber = () => {
  const createTwilioNumberAction = useAction(
    api.actions.twilio.insertTwilioNumber
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createTwilioNumber = async (
    companyId: Id<"companies">
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await createTwilioNumberAction({ companyId });
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { createTwilioNumber, error, isLoading, setError };
};
