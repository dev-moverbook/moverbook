import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { setErrorFromConvexError } from "@/app/frontendUtils/errorHelper";

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

      await createSenderMutation({ companyContactId });
      return true;
    } catch (error) {
      setErrorFromConvexError(error, setError);
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
