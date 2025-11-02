"use client";

import { GoogleMap, Marker } from "@react-google-maps/api";
import { DateTime } from "luxon";
import { Doc } from "@/convex/_generated/dataModel";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

interface MoverLocationMapProps {
  moverLocation: Doc<"moverLocations">;
}
export default function MoverLocationMap({
  moverLocation,
}: MoverLocationMapProps) {
  if (!moverLocation?.lat || !moverLocation?.lng) {
    return <p className="text-grayCustom2">No location data available.</p>;
  }

  const center = {
    lat: moverLocation.lat,
    lng: moverLocation.lng,
  } as const;

  if (!moverLocation.isOn) {
    return <p className="text-grayCustom2">Location sharing is disabled.</p>;
  }

  const lastUpdated = moverLocation.timestamp
    ? DateTime.fromMillis(moverLocation.timestamp).toRelative()
    : "Never";

  return (
    <div className="h-64 w-full rounded-md overflow-hidden relative">
      {" "}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        options={{
          zoomControl: true,
          streetViewControl: false,
          fullscreenControl: false,
        }}
      >
        <Marker position={center} title="Mover Location" />
      </GoogleMap>
      <div className="absolute bottom-2 left-2 bg-white px-3 py-1.5 rounded-md shadow-md text-sm font-medium text-gray-700 z-10">
        Last updated: {lastUpdated}
      </div>
    </div>
  );
}
