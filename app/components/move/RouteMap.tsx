// RouteMap.tsx
import React, { useEffect, useRef, useState } from "react";
import { useAddresses } from "./AddressContext";

type LatLng = { lat: number; lng: number };

const GOOGLE_MAPS_API_KEY = process.env
  .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

function decodePolyline(encoded: string): LatLng[] {
  let index = 0,
    lat = 0,
    lng = 0,
    coordinates: LatLng[] = [];
  while (index < encoded.length) {
    let b,
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

    coordinates.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return coordinates;
}

const Polyline: React.FC<{ path: LatLng[]; map: google.maps.Map | null }> = ({
  path,
  map,
}) => {
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || !path.length) return;

    // Remove previous polyline
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    const polyline = new window.google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: "#4285F4",
      strokeOpacity: 0.8,
      strokeWeight: 6,
    });
    polyline.setMap(map);
    polylineRef.current = polyline;

    // Fit map to polyline
    const bounds = new window.google.maps.LatLngBounds();
    path.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds);

    // Cleanup on unmount
    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [path, map]);

  return null;
};

const RouteMap: React.FC = () => {
  const { addresses } = useAddresses();
  const mapRef = useRef<google.maps.Map | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const [polyline, setPolyline] = useState<LatLng[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize Google Map once
  useEffect(() => {
    if (window.google && mapDivRef.current && !mapRef.current) {
      mapRef.current = new window.google.maps.Map(mapDivRef.current, {
        zoom: 10,
        center: { lat: 37.7749, lng: -122.4194 },
      });
    }
  }, []);

  // Update route when addresses change
  useEffect(() => {
    const fetchRoute = async () => {
      setError(null);
      setPolyline([]);
      if (!addresses || addresses.length < 2) {
        setError("At least two addresses required.");
        return;
      }
      try {
        // Geocode addresses and convert to { latitude, longitude }
        const geocode = async (address: string) => {
          const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=${GOOGLE_MAPS_API_KEY}`;
          const res = await fetch(url);
          const data = await res.json();
          if (!data.results[0])
            throw new Error("Geocode failed for " + address);
          const { lat, lng } = data.results[0].geometry.location;
          return { latitude: lat, longitude: lng };
        };
        const [origin, ...rest] = addresses;
        const destination = rest.pop()!;
        const waypoints = rest;
        const originLoc = await geocode(origin);
        const destinationLoc = await geocode(destination);
        const waypointsLoc = await Promise.all(waypoints.map(geocode));

        // Build request for Routes API using { latitude, longitude }
        const body = {
          origin: { location: { latLng: originLoc } },
          destination: { location: { latLng: destinationLoc } },
          intermediates: waypointsLoc.map((loc) => ({
            location: { latLng: loc },
          })),
          travelMode: "DRIVE",
          polylineQuality: "OVERVIEW",
        };

        const resRoute = await fetch(
          "https://routes.googleapis.com/directions/v2:computeRoutes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
              "X-Goog-FieldMask": "routes.polyline",
            },
            body: JSON.stringify(body),
          }
        );
        const dataRoute = await resRoute.json();
        const encoded = dataRoute.routes?.[0]?.polyline?.encodedPolyline;
        if (!encoded) throw new Error("No route found.");
        setPolyline(decodePolyline(encoded));
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchRoute();
  }, [addresses]);

  return (
    <div className="flex flex-col items-center">
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div
        ref={mapDivRef}
        className="w-[99%] h-[350px] mt-5 rounded overflow-hidden"
      />

      {polyline.length > 0 && <Polyline path={polyline} map={mapRef.current} />}
    </div>
  );
};

export default RouteMap;
