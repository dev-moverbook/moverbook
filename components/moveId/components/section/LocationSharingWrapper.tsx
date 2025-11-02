"use client";

import { useState, useEffect } from "react";
import LocationSharingSection from "./LocationSharingSection";

export default function LocationSharingWrapper() {
  const [isSharing, setIsSharing] = useState<boolean | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("sharingLocation");
    setIsSharing(saved === "true");
  }, []);

  useEffect(() => {
    if (isSharing !== null) {
      localStorage.setItem("sharingLocation", String(isSharing));
    }
  }, [isSharing]);

  if (isSharing === null) {
    return null;
  }

  return (
    <LocationSharingSection isSharing={isSharing} setIsSharing={setIsSharing} />
  );
}
