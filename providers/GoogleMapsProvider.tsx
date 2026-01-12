"use client";

import { LoadScript } from "@react-google-maps/api";
import FullLoading from "@/components/shared/skeleton/FullLoading";
import { clientEnv } from "@/frontendUtils/clientEnv";

const GOOGLE_MAPS_LIBRARIES: "places"[] = ["places"];

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({
  children,
}) => {
  const apiKey = clientEnv().NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={GOOGLE_MAPS_LIBRARIES}
      loadingElement={<FullLoading />}
    >
      {children}
    </LoadScript>
  );
};
