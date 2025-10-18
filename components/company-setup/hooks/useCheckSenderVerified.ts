import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { useState } from "react";
import { FrontEndErrorMessages } from "@/types/errors";

interface UseCheckSenderVerifiedReturn {
  checkSenderVerified: (
    companyContactId: Id<"companyContact">
  ) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export const useCheckSenderVerified = (): UseCheckSenderVerifiedReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkSenderMutation = useAction(api.sendgrid.checkSender);

  const checkSenderVerified = async (
    companyContactId: Id<"companyContact">
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await checkSenderMutation({ companyContactId });
      if (response.status === ResponseStatus.SUCCESS) {
        return response.data?.isVerified ?? false;
      }

      console.error(response.error);
      setError(response.error);
      return false;
    } catch (err) {
      console.error(err);
      setError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    checkSenderVerified,
    isLoading,
    error,
  };
};
