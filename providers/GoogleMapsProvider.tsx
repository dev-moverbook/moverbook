"use client";

import { LoadScript } from "@react-google-maps/api";
import FullLoading from "@/components/shared/skeleton/FullLoading";
import { clientEnv } from "@/frontendUtils/clientEnv";

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
      libraries={["places"]}
      loadingElement={<FullLoading />}
    >
      {children}
    </LoadScript>
  );
};
