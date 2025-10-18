"use client";

import { useAction } from "convex/react";
import { useState, useCallback } from "react";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";

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

      try {
        const result = await getDistanceMatrix({ origin, destination });
        if (result.status === ResponseStatus.SUCCESS) {
          return {
            success: true,
            distanceMiles: result.data.distanceMiles,
            durationMinutes: result.data.durationMinutes,
          };
        }
        setError(result.error || "Unknown error");
        return { success: false, error: result.error };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected error";
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [getDistanceMatrix]
  );

  return { fetchDistance, loading, error };
};
