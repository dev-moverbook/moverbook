"use client";

import { useRef } from "react";
import { usePlaceIds } from "../AddressContext";
import { MapContainer } from "./MapContainer";
import { MapPolyline } from "./MapPolyline";
import { useRoutePolyline } from "./useRoutePolyline";

export const RouteMap: React.FC = () => {
  const { placeIds } = usePlaceIds();
  const mapRef = useRef<google.maps.Map | null>(null);
  const { polyline, error, loading } = useRoutePolyline(placeIds);

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
          Failed to load route: {error}
        </div>
      )}
      {loading && (
        <div className="p-4 text-center text-gray-500">Loading route...</div>
      )}

      <MapContainer onMapLoad={(map) => (mapRef.current = map)} />
      <MapPolyline map={mapRef.current} path={polyline} />
    </div>
  );
};

export default RouteMap;
