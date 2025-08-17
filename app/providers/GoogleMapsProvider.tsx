"use client";

import { LoadScript } from "@react-google-maps/api";
import { ErrorMessages } from "@/types/errors";
import FullLoading from "@/app/components/shared/FullLoading";

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({
  children,
}) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error(ErrorMessages.ENV_NOT_SET_GOOGLE_MAPS_API_KEY);
  }

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
