"use client";

import { useAction } from "convex/react";
import { useState, useCallback } from "react";
import { api } from "@/convex/_generated/api";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

export const useDistanceMatrix = () => {
  const getDistanceMatrix = useAction(api.google.getDistanceMatrix);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDistance = useCallback(
    async ({
      origin,
      destination,
    }: {
      origin: string;
      destination: string;
    }): Promise<{
      success: boolean;
      distanceMiles?: number;
      durationMinutes?: number;
      error?: string;
    }> => {
      setLoading(true);
      setError(null);

      console.log("origin", origin);
      console.log("destination", destination);

      try {
        const result = await getDistanceMatrix({ origin, destination });
        return {
          success: true,
          distanceMiles: result.distanceMiles,
          durationMinutes: result.durationMinutes,
        };
      } catch (err) {
        setErrorFromConvexError(err, setError);
        return {
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        };
      } finally {
        setLoading(false);
      }
    },
    [getDistanceMatrix]
  );

  return { fetchDistance, loading, error };
};
