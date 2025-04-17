"use client";
import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";

export const useShowOnboardingLink = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createStripeOnboardingLinkAction = useAction(
    api.connectedAccount.createStripeOnboardingLink
  );

  const getOnboardingLink = async (): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const origin = window.location.origin;
      const response = await createStripeOnboardingLinkAction({ origin });

      if (response.status === ResponseStatus.SUCCESS && response.data) {
        return response.data.url;
      }

      console.error(response.error);
      setError(response.error || FrontEndErrorMessages.GENERIC);
      return null;
    } catch (error) {
      console.error(error);
      setError(FrontEndErrorMessages.GENERIC);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getOnboardingLink,
    isLoading,
    error,
    setError,
  };
};
