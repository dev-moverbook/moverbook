import { action } from "./_generated/server";
import { v } from "convex/values";
import { GetDistanceMatrixResponse } from "@/types/convex-responses";
import { ResponseStatus } from "@/types/enums";
import { handleInternalError } from "./backendUtils/helper";

export const getDistanceMatrix = action({
  args: {
    origin: v.string(),
    destination: v.string(),
  },
  handler: async (
    ctx,
    { origin, destination }
  ): Promise<GetDistanceMatrixResponse> => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) throw new Error("Missing Google Maps API key");

      const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "routes.duration,routes.distanceMeters",
        },
        body: JSON.stringify({
          origin: {
            address: origin,
          },
          destination: {
            address: destination,
          },
          travelMode: "DRIVE",
          routingPreference: "TRAFFIC_AWARE",
        }),
      });

      if (!response.ok) {
        console.error("Routes API HTTP error", response.status);
        throw new Error(`Google Routes API error: ${response.status}`);
      }

      const data = await response.json();

      const route = data?.routes?.[0];
      if (!route || !route.distanceMeters || !route.duration) {
        return {
          status: ResponseStatus.ERROR,
          data: null,
          error: "No route data found",
        };
      }

      const distanceMiles = route.distanceMeters / 1609.34;
      const durationMinutes =
        parseDuration(route.duration) ?? route.duration / 60;

      return {
        status: ResponseStatus.SUCCESS,
        data: {
          distanceMiles,
          durationMinutes,
        },
      };
    } catch (error) {
      console.error("Routes API error", error);
      return handleInternalError(error);
    }
  },
});

// Helper to parse ISO 8601 duration like "3600s" or "PT20M34S"
function parseDuration(duration: string | undefined): number | null {
  if (!duration) return null;
  const match = duration.match(/(\d+)s/);
  return match ? parseInt(match[1], 10) / 60 : null;
}
