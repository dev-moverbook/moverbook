"use client";
import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";

export const useStripeDashboardLink = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getStripeDashboardLink = useAction(
    api.connectedAccount.getStripeDashboardLink
  );

  const fetchDashboardLink = async (): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getStripeDashboardLink();

      if (response.status === ResponseStatus.SUCCESS) {
        return response.data.url;
      }
      console.error(response.error);
      setError(response.error);
      return null;
    } catch (error) {
      console.error("Error fetching Stripe dashboard link:", error);
      setError(FrontEndErrorMessages.GENERIC);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchDashboardLink,
    isLoading,
    error,
    setError,
  };
};
