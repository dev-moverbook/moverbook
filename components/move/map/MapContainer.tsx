"use client";

import { useEffect, useRef } from "react";

interface MapContainerProps {
  onMapLoad: (map: google.maps.Map) => void;
}

export const MapContainer: React.FC<MapContainerProps> = ({ onMapLoad }) => {
  const mapDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.google?.maps || !mapDivRef.current) return;

    const map = new window.google.maps.Map(mapDivRef.current!, {
      zoom: 10,
      center: { lat: 37.7749, lng: -122.4194 },
      mapId: "YOUR_MAP_ID", // Required for modern Maps
    });

    onMapLoad(map);
  }, [onMapLoad]);

  return (
    <div
      ref={mapDivRef}
      className="w-full h-[350px] rounded-lg overflow-hidden border border-gray-300"
    />
  );
};
