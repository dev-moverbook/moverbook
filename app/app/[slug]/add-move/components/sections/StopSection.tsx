import React, { useState } from "react";
import MoveAddress from "./MoveAddress";
import StopSectionHeader from "@/app/components/move/header/StopSectionHeader";
import { LocationInput } from "@/types/form-types";

interface StopSectionProps {
  locations: LocationInput[];
  addStopLocation: () => void;
  removeLocation: (index: number) => void;
  updateLocation: (index: number, partial: Partial<LocationInput>) => void;
  showEditButton?: boolean;
}

const StopSection = ({
  locations,
  addStopLocation,
  removeLocation,
  updateLocation,
  showEditButton,
}: StopSectionProps) => {
  const [showBanner, setShowBanner] = useState(false);

  const handleAddStop = (e: React.MouseEvent) => {
    e.preventDefault();
    addStopLocation();
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 2000);
  };

  const stops = locations.slice(1, -1);

  return (
    <div>
      <StopSectionHeader
        stopCount={locations.length - 2}
        showBanner={showBanner}
        onAddStop={handleAddStop}
      />

      {stops.map((stop, i) => (
        <MoveAddress
          key={i + 1}
          title={`Stop #${i + 1}`}
          index={i + 1}
          location={stop}
          updateLocation={updateLocation}
          removeLocation={removeLocation}
          showEditButton={showEditButton}
        />
      ))}
    </div>
  );
};

export default StopSection;
