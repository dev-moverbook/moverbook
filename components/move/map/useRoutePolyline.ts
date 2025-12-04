import { useEffect, useState } from "react";
import { clientEnv } from "@/frontendUtils/clientEnv";
import { LatLng } from "@/types/types";

function decodePolyline(encoded: string): LatLng[] {
  let index = 0,
    lat = 0,
    lng = 0;
  const coords: LatLng[] = [];

  while (index < encoded.length) {
    let b = 0,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coords.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return coords;
}

export function useRoutePolyline(placeIds: (string | undefined)[]) {
  const [polyline, setPolyline] = useState<LatLng[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoute = async () => {
      setError(null);
      setPolyline([]);
      setLoading(true);

      const clean = placeIds.filter((p): p is string => !!p);
      if (clean.length < 2) {
        setLoading(false);
        return;
      }

      const originId = clean[0];
      const destinationId = clean[clean.length - 1];
      const waypoints = clean.slice(1, -1);

      try {
        const res = await fetch(
          "https://routes.googleapis.com/directions/v2:computeRoutes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": clientEnv().NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
              "X-Goog-FieldMask": "routes.polyline.encodedPolyline",
            },
            body: JSON.stringify({
              origin: { placeId: originId },
              destination: { placeId: destinationId },
              intermediates: waypoints.map((pid) => ({ placeId: pid })),
              travelMode: "DRIVE",
              routingPreference: "TRAFFIC_AWARE",
            }),
          }
        );

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error?.message || `HTTP ${res.status}`);
        }

        const data = await res.json();
        const encoded = data?.routes?.[0]?.polyline?.encodedPolyline;
        if (!encoded) throw new Error("No route found");

        setPolyline(decodePolyline(encoded));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load route");
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [placeIds]);

  return { polyline, error, loading };
}
