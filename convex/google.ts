import { action } from "./_generated/server";
import { v } from "convex/values";
import { GetDistanceMatrixResponse } from "@/types/convex-responses";
import { ResponseStatus } from "@/types/enums";
import { handleInternalError } from "./backendUtils/helper";

const normalizePlaceId = (pid: string) =>
  pid.startsWith("place_id:") ? pid.slice("place_id:".length) : pid;

function parseDurationToMinutes(
  duration: string | number | undefined
): number | null {
  if (!duration) return null;
  if (typeof duration === "number") return duration / 60;
  const secsMatch = duration.match(/^(\d+)s$/);
  if (secsMatch) return Number(secsMatch[1]) / 60;
  const r = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(duration);
  if (r) {
    const h = Number(r[1] ?? 0),
      m = Number(r[2] ?? 0),
      s = Number(r[3] ?? 0);
    return (h * 3600 + m * 60 + s) / 60;
  }
  return null;
}

export const getDistanceMatrix = action({
  args: {
    origin: v.string(),
    destination: v.string(),
  },
  handler: async (
    _ctx,
    { origin, destination }
  ): Promise<GetDistanceMatrixResponse> => {
    try {
      const apiKey =
        process.env.GOOGLE_ROUTES_API_KEY ??
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) throw new Error("Missing Google Routes API key");

      const url = "https://routes.googleapis.com/directions/v2:computeRoutes";

      const originPlaceId = normalizePlaceId(origin);
      const destinationPlaceId = normalizePlaceId(destination);

      const body = {
        origin: { placeId: originPlaceId },
        destination: { placeId: destinationPlaceId },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "routes.duration,routes.distanceMeters",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Routes API HTTP error", response.status, errText);
        throw new Error(
          `Google Routes API error: ${response.status} :: ${errText}`
        );
      }

      const data = await response.json();
      const route = data?.routes?.[0];
      if (!route?.distanceMeters || !route?.duration) {
        return {
          status: ResponseStatus.ERROR,
          data: null,
          error: "No route data found",
        };
      }

      const distanceMiles = route.distanceMeters / 1609.34;
      const durationMinutes =
        parseDurationToMinutes(route.duration) ?? Number(route.duration) / 60;

      return {
        status: ResponseStatus.SUCCESS,
        data: { distanceMiles, durationMinutes },
      };
    } catch (error) {
      console.error("Routes API error", error);
      return handleInternalError(error);
    }
  },
});
