import React, { useState } from "react";
import MoveAddress from "./MoveAddress";
import StopSectionHeader from "@/app/components/move/header/StopSectionHeader";
import { LocationInput } from "@/types/form-types";
import ConfirmModal from "@/app/components/shared/ConfirmModal";

interface StopSectionProps {
  locations: LocationInput[];
  addStopLocation: () => void;
  removeLocation: (index: number) => void;
  updateLocation: (index: number, partial: Partial<LocationInput>) => void;
  showEditButton?: boolean;
  isAddingIndex?: number | null;
  onSaved?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const StopSection = ({
  locations,
  addStopLocation,
  removeLocation,
  updateLocation,
  showEditButton,
  isAddingIndex,
  onSaved,
  isLoading,
  error,
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
        stopCount={stops.length}
        showBanner={showBanner}
        onAddStop={handleAddStop}
      />

      {stops.map((stop, i) => {
        const actualIndex = i + 1;
        return (
          <MoveAddress
            key={stop.uid}
            title={`Stop #${i + 1}`}
            index={actualIndex}
            location={stop}
            updateLocation={updateLocation}
            removeLocation={() => removeLocation(actualIndex)}
            showEditButton={showEditButton}
            isAdding={isAddingIndex === actualIndex}
            onSaved={onSaved}
            isLoading={isLoading}
            error={error}
          />
        );
      })}
    </div>
  );
};

export default StopSection;
