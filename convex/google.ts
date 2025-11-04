import { action } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { GetDistanceMatrixData } from "@/types/convex-responses";

const normalizePlaceId = (pid: string) =>
  pid.startsWith("place_id:") ? pid.slice("place_id:".length) : pid;

function parseDurationToMinutes(
  duration: string | number | undefined
): number | null {
  if (!duration) {
    return null;
  }
  if (typeof duration === "number") {
    return Math.round((duration / 60) * 100) / 100;
  }
  const secondsMatch = duration.match(/^(\d+)s$/);
  if (secondsMatch) {
    return Math.round((Number(secondsMatch[1]) / 60) * 100) / 100;
  }
  const regexResult = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(duration);
  if (regexResult) {
    const hours = Number(regexResult[1] ?? 0);
    const minutes = Number(regexResult[2] ?? 0);
    const seconds = Number(regexResult[3] ?? 0);
    return (
      Math.round(((hours * 3600 + minutes * 60 + seconds) / 60) * 100) / 100
    );
  }
  return null;
}

// const isEncodedPlaceId = (input: string): boolean => {
//   const trimmed = input.trim();
//   return trimmed.startsWith("Ei") && trimmed.length >= 100;
// };

const isEncodedPlaceId = (input: string): boolean => {
  const trimmed = input.trim();
  // Encoded place ids often start with "Ei" or "Eil" and are long; loosen length check a bit
  return /^Ei[A-Za-z0-9\-_]{40,}$/.test(trimmed);
};

// const extractPlaceIdFromEncoded = (encoded: string): string | null => {
//   try {
//     const decoded = atob(encoded.replace(/-/g, "+").replace(/_/g, "/"));
//     const match = decoded.match(/ChIJ[A-Za-z0-9_-]{11,}/);
//     return match ? match[0] : null;
//   } catch {
//     return null;
//   }
// };

const extractPlaceIdFromEncoded = (encoded: string): string | null => {
  try {
    // Convert URL-safe base64 to standard base64
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");

    // Node-safe decode. In browsers, Buffer may not exist, so fall back to atob if present.
    let decoded: string;
    if (typeof Buffer !== "undefined") {
      // Some base64 strings may lack padding; add '=' padding if necessary
      const padLength = (4 - (base64.length % 4)) % 4;
      const padded = base64 + "=".repeat(padLength);
      decoded = Buffer.from(padded, "base64").toString("utf8");
    } else if (typeof atob === "function") {
      decoded = atob(base64);
    } else {
      return null;
    }

    const match = decoded.match(/ChIJ[A-Za-z0-9_-]{11,}/);
    return match ? match[0] : null;
  } catch (err) {
    console.warn("Failed to extract placeId from encoded string", err);
    return null;
  }
};

const buildWaypoint = (input: string) => {
  const trimmed = input.trim();

  if (isEncodedPlaceId(trimmed)) {
    const placeId = extractPlaceIdFromEncoded(trimmed);
    if (placeId) {
      return { placeId: normalizePlaceId(placeId) };
    }
  }

  if (/^ChIJ[A-Za-z0-9_-]{11,}$/.test(trimmed)) {
    return { placeId: normalizePlaceId(trimmed) };
  }

  return { address: trimmed };
};

export function getGoogleApiKey(): string {
  const apiKey =
    process.env.GOOGLE_ROUTES_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("Missing Google Routes API key");
  }
  return apiKey;
}

export const getDistanceMatrix = action({
  args: {
    origin: v.string(),
    destination: v.string(),
  },
  handler: async (
    _ctx,
    { origin, destination }
  ): Promise<GetDistanceMatrixData> => {
    try {
      const apiKey = getGoogleApiKey();

      const url = "https://routes.googleapis.com/directions/v2:computeRoutes";

      const body = {
        origin: buildWaypoint(origin),
        destination: buildWaypoint(destination),
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
        throw new ConvexError({
          code: "BAD_REQUEST",
          message: `Google Routes API error: ${response.status} :: ${errText}`,
        });
      }

      const data = await response.json();
      const route = data?.routes?.[0];

      if (!route?.distanceMeters || !route?.duration) {
        throw new ConvexError({
          code: "BAD_REQUEST",
          message: "No route data found in response",
        });
      }

      const rawDistanceMiles = route.distanceMeters / 1609.34;
      const distanceMiles = Math.round(rawDistanceMiles * 100) / 100;

      const durationMinutes = parseDurationToMinutes(route.duration);
      if (durationMinutes === null) {
        throw new ConvexError({
          code: "BAD_REQUEST",
          message: `Invalid duration format: ${route.duration}`,
        });
      }

      return { distanceMiles, durationMinutes };
    } catch (error) {
      console.error("Routes API error", error);
      throw new ConvexError({
        code: "INTERNAL_ERROR",
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  },
});

export async function fetchDistanceMatrix(
  origin: string,
  destination: string
): Promise<GetDistanceMatrixData> {
  try {
    const apiKey = getGoogleApiKey();

    const url = "https://routes.googleapis.com/directions/v2:computeRoutes";

    const body = {
      origin: buildWaypoint(origin),
      destination: buildWaypoint(destination),
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
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: `Google Routes API error: ${response.status} :: ${errText}`,
      });
    }

    const data = await response.json();
    const route = data?.routes?.[0];

    if (!route?.distanceMeters || !route?.duration) {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "No route data found in response",
      });
    }

    const distanceMiles =
      Math.round((route.distanceMeters / 1609.34) * 100) / 100;
    console.log("route.duration", route.duration);
    const durationMinutes = parseDurationToMinutes(route.duration);
    console.log("durationMinutes", durationMinutes);

    if (durationMinutes === null) {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: `Invalid duration format: ${route.duration}`,
      });
    }

    return { distanceMiles, durationMinutes };
  } catch (error) {
    console.error("Routes API error", error);
    throw new ConvexError({
      code: "INTERNAL_ERROR",
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
