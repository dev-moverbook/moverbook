"use client";

import { useState, useEffect } from "react";
import { LocationInput } from "@/types/form-types";
import MoveAddress from "@/components/add-move/components/sections/MoveAddress"; // Reuse if possible, or create customer version
import StopSection from "@/components/add-move/components/sections/StopSection"; // Reuse or adapt
import { nanoid } from "nanoid";

interface EditableQuoteLocationProps {
  initialLocations: LocationInput[];
  onLocationsChange: (locations: LocationInput[]) => void;
}

const EditableQuoteLocation = ({
  initialLocations,
  onLocationsChange,
}: EditableQuoteLocationProps) => {
  const [editedLocations, setEditedLocations] = useState<LocationInput[]>(
    initialLocations ?? []
  );
  const [addingStopIndex, setAddingStopIndex] = useState<number | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setEditedLocations(initialLocations ?? []);
  }, [initialLocations]);

  useEffect(() => {
    onLocationsChange(editedLocations);
  }, [editedLocations, onLocationsChange]);

  const updateLocation = (index: number, partial: Partial<LocationInput>) => {
    setEditedLocations((prev) =>
      prev.map((loc, i) => (i === index ? { ...loc, ...partial } : loc))
    );
  };

  const removeLocation = (index: number) => {
    const next = editedLocations.filter((_, i) => i !== index);
    setEditedLocations(next);

    if (addingStopIndex === index) {
      setAddingStopIndex(null);
    }
  };

  const addStopLocation = () => {
    const newStop: LocationInput = {
      uid: nanoid(),
      locationRole: "stop",
      address: null,
      locationType: null,
      aptNumber: null,
      aptName: null,
      squareFootage: null,
      accessType: null,
      moveSize: null,
      timeDistanceRange: "0-30 sec (less than 100 ft)",
    };

    const insertIndex = editedLocations.length - 1;
    const next = [
      ...editedLocations.slice(0, insertIndex),
      newStop,
      ...editedLocations.slice(insertIndex),
    ];

    setEditedLocations(next);
    setAddingStopIndex(insertIndex);
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 2000);
  };

  const handleSavedStop = () => {
    setAddingStopIndex(null);
  };

  return (
    <div className="space-y-8">
      {editedLocations[0] && (
        <MoveAddress
          title="Starting Location"
          index={0}
          location={editedLocations[0]}
          updateLocation={updateLocation}
          showEditButton={false}
          canEdit={true}
        />
      )}

      <StopSection
        locations={editedLocations}
        addStopLocation={addStopLocation}
        removeLocation={removeLocation}
        updateLocation={updateLocation}
        showEditButton={false}
        isAddingIndex={addingStopIndex}
        onSaved={handleSavedStop}
        showBannerFromParent={showBanner}
      />

      {editedLocations.length > 1 &&
        editedLocations[editedLocations.length - 1] && (
          <MoveAddress
            title="Ending Location"
            index={editedLocations.length - 1}
            location={editedLocations[editedLocations.length - 1]}
            updateLocation={updateLocation}
            showEditButton={false}
            canEdit={true}
          />
        )}
    </div>
  );
};

export default EditableQuoteLocation;
