"use client";
import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

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
      return await getStripeDashboardLink();
    } catch (error) {
      setErrorFromConvexError(error, setError);
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
