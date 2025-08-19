"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePlaceIds } from "./AddressContext";

type LatLng = { lat: number; lng: number };

const GOOGLE_MAPS_API_KEY = process.env
  .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

function decodePolyline(encoded: string): LatLng[] {
  let index = 0,
    lat = 0,
    lng = 0;
  const coords: LatLng[] = [];
  while (index < encoded.length) {
    let b = 0,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coords.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return coords;
}

const Polyline: React.FC<{ path: LatLng[]; map: google.maps.Map | null }> = ({
  path,
  map,
}) => {
  useEffect(() => {
    if (!map || !path.length) return;

    const polyline = new window.google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: "#4285F4",
      strokeOpacity: 0.8,
      strokeWeight: 6,
    });
    polyline.setMap(map);

    const bounds = new window.google.maps.LatLngBounds();
    path.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds);

    return () => polyline.setMap(null);
  }, [path, map]);

  return null;
};

const RouteMap: React.FC = () => {
  const { placeIds } = usePlaceIds(); // [origin, ...stops, destination]
  const mapRef = useRef<google.maps.Map | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const [polyline, setPolyline] = useState<LatLng[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.google && mapDivRef.current && !mapRef.current) {
      mapRef.current = new window.google.maps.Map(mapDivRef.current, {
        zoom: 10,
        center: { lat: 37.7749, lng: -122.4194 },
      });
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current || !placeIds) return;

    if (placeIds.length === 1) {
      if (!window.google?.maps?.places) return;
      const service = new window.google.maps.places.PlacesService(
        mapRef.current
      );
      service.getDetails({ placeId: placeIds[0] }, (place, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          place?.geometry?.location
        ) {
          mapRef.current!.setCenter(place.geometry.location);
          mapRef.current!.setZoom(12);
        }
      });
    }
  }, [placeIds]);

  useEffect(() => {
    const fetchRoute = async () => {
      setError(null);
      setPolyline([]);

      if (!placeIds || placeIds.length < 2) return;

      const clean = placeIds.filter(
        (p): p is string => !!p && typeof p === "string"
      );
      if (clean.length < 2) return;

      const originId = clean[0];
      const destinationId = clean[clean.length - 1];
      const waypoints = clean.slice(1, -1);

      const body = {
        origin: { placeId: originId },
        destination: { placeId: destinationId },
        intermediates: waypoints.map((pid) => ({ placeId: pid })),
        travelMode: "DRIVE",
        polylineQuality: "OVERVIEW",
        polylineEncoding: "ENCODED_POLYLINE",
        routingPreference: "TRAFFIC_AWARE",
      };

      try {
        const res = await fetch(
          "https://routes.googleapis.com/directions/v2:computeRoutes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
              "X-Goog-FieldMask": "routes.polyline.encodedPolyline",
            },
            body: JSON.stringify(body),
          }
        );

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(
            errJson?.error?.message || `Routes API HTTP ${res.status}`
          );
        }

        const data = await res.json();
        const encoded = data?.routes?.[0]?.polyline?.encodedPolyline;
        if (!encoded) throw new Error("No route found");
        setPolyline(decodePolyline(encoded));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      }
    };

    fetchRoute();
  }, [placeIds]);

  return (
    <div className="flex flex-col items-center">
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div
        ref={mapDivRef}
        className="w-[99%] h-[350px] rounded overflow-hidden"
      />
      {polyline.length > 0 && <Polyline path={polyline} map={mapRef.current} />}
    </div>
  );
};

export default RouteMap;
