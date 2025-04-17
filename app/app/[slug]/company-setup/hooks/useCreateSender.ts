import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";
import { useState } from "react";
import { FrontEndErrorMessages } from "@/types/errors";

interface UseCreateSenderReturn {
  createSender: (companyContactId: Id<"companyContact">) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export const useCreateSender = (): UseCreateSenderReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createSenderMutation = useAction(api.sendgrid.createSender);

  const createSender = async (
    companyContactId: Id<"companyContact">
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await createSenderMutation({ companyContactId });
      if (response.status === ResponseStatus.SUCCESS) {
        return true;
      }

      console.error(response.error);
      setError(response.error);
      return false;
    } catch (err) {
      console.error(error);
      setError(FrontEndErrorMessages.GENERIC);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createSender,
    isLoading,
    error,
  };
};
