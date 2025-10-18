// utils/getDistanceAndDuration.ts
export async function getDistanceAndDuration(
  origin: string,
  destination: string
): Promise<{ distanceMiles: number; durationMinutes: number } | null> {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destination)}&units=imperial&key=${key}`;

  const response = await fetch(url);
  const data = await response.json();

  const result = data?.rows?.[0]?.elements?.[0];
  if (result && result.status === "OK" && result.distance && result.duration) {
    return {
      distanceMiles: parseFloat(result.distance.text.replace(/[^0-9.]/g, "")),
      durationMinutes: Math.round(result.duration.value / 60),
    };
  }

  return null;
}
