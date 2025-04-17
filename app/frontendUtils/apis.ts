import { ErrorMessages } from "@/types/errors";

export const fetchTimezones = async (): Promise<string[]> => {
  try {
    const res = await fetch(
      "https://timeapi.io/api/timezone/availabletimezones"
    );

    if (!res.ok) {
      throw new Error(
        `Failed to fetch timezones: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching timezones:", error);
    throw new Error(ErrorMessages.WORLD_TIME_API_ERROR);
  }
};
