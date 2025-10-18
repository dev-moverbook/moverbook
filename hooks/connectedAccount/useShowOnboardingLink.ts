"use client";
import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

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

      return response;
    } catch (error) {
      setErrorFromConvexError(error, setError);
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
