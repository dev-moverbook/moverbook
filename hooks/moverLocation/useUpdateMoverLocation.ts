import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useRef, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";

export function useUpdateMoverLocation({
  moveId,
  enabled,
}: {
  moveId: Id<"moves">;
  enabled: boolean;
}) {
  const updateMoverLocation = useMutation(
    api.moverLocations.updateMoverLocation
  );
  const watchIdRef = useRef<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!moveId || !enabled) {
      return;
    }

    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        setError(null);
        try {
          await updateMoverLocation({
            moveId,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            timestamp: Date.now(),
          });
        } catch (error) {
          setErrorFromConvexError(error, setError);
        }
      },
      (geoError) => {
        setError(geoError.message || "Location access denied");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10_000,
        timeout: 60_000,
      }
    );

    watchIdRef.current = watchId;

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [moveId, updateMoverLocation]);

  return { error };
}
