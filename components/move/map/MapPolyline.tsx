"use client";

import { useEffect } from "react";
import { LatLng } from "@/types/types";

interface MapPolylineProps {
  map: google.maps.Map | null;
  path: LatLng[];
}

export const MapPolyline: React.FC<MapPolylineProps> = ({ map, path }) => {
  useEffect(() => {
    if (!map || path.length === 0) return;

    const polyline = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: "#4285F4",
      strokeOpacity: 0.8,
      strokeWeight: 6,
    });

    polyline.setMap(map);

    const bounds = new google.maps.LatLngBounds();
    path.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds);

    return () => polyline.setMap(null);
  }, [map, path]);

  return null;
};
