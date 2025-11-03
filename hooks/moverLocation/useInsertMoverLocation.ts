"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

interface CreateMoveCustomerInput {
  moveId: Id<"moves">;
}

export const useInsertMoverLocation = () => {
  const [insertMoverLocationLoading, setLoading] = useState<boolean>(false);
  const [insertMoverLocationError, setError] = useState<string | null>(null);

  const insertMoverLocationMutation = useMutation(
    api.moverLocations.inserMoverLocationSharing
  );

  const insertMoverLocation = async (
    data: CreateMoveCustomerInput
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by this browser");
      setLoading(false);
      return false;
    }

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            maximumAge: 10_000,
            timeout: 10_000,
          });
        }
      );

      const success = await insertMoverLocationMutation({
        ...data,
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        timestamp: Date.now(),
      });

      return success;
    } catch (error) {
      setErrorFromConvexError(error, setError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    insertMoverLocation,
    insertMoverLocationLoading,
    insertMoverLocationError,
    setInsertMoverLocationError: setError,
  };
};
