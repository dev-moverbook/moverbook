import React, { useEffect, useState } from "react";
import { LocationInput } from "@/types/form-types";
import MoveAddress from "@/app/app/[slug]/add-move/components/sections/MoveAddress";
import LocationSummary from "@/app/app/[slug]/add-move/components/sections/LocationSummary";
import StopSection from "@/app/app/[slug]/add-move/components/sections/StopSection";
import ConfirmDeleteModal from "@/app/app/[slug]/company-setup/modals/ConfirmDeleteModal";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import { useCompanyContact } from "@/app/hooks/queries/useCompanyContact";
import { nanoid } from "nanoid";
import { useMoveContext } from "@/app/contexts/MoveContext";
import ConfirmModal from "@/app/components/shared/ConfirmModal";

interface LocationSectionProps {}

const LocationSection = ({}: LocationSectionProps) => {
  const { moveData } = useMoveContext();
  const move = moveData.move;
  const [addingStopIndex, setAddingStopIndex] = useState<number | null>(null);
  const [editedLocations, setEditedLocations] = useState<LocationInput[]>(
    move.locations
  );
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);

  const { data: companyContact } = useCompanyContact(move.companyId);
  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();

  useEffect(() => {
    if (Array.isArray(move.locations) && move.locations.length >= 2) {
      setEditedLocations(move.locations);
    }
  }, [move.locations]);

  const updateLocation = (index: number, partial: Partial<LocationInput>) => {
    const updated = editedLocations.map((loc, i) =>
      i === index ? { ...loc, ...partial } : loc
    );
    setEditedLocations(updated);

    updateMove({
      moveId: move._id,
      updates: {
        locations: updated,
      },
    });
  };

  const removeLocation = (index: number) => {
    setEditedLocations((prev) => prev.filter((_, i) => i !== index));
  };

  const addStopLocation = () => {
    const newStop: LocationInput = {
      uid: nanoid(),
      locationRole: "stop",
      address: "",
      locationType: null,
      aptNumber: null,
      aptName: null,
      squareFootage: null,
      accessType: null,
      moveSize: null,
      timeDistanceRange: "0-30 sec (less than 100 ft)",
    };

    const insertIndex = editedLocations.length - 1;

    setEditedLocations((prev) => [
      ...prev.slice(0, insertIndex),
      newStop,
      ...prev.slice(insertIndex),
    ]);

    setAddingStopIndex(insertIndex);
  };

  const handleAddStop = () => {
    addStopLocation();
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 2000);
  };

  const handleRemoveStop = (index: number) => {
    setDeleteIndex(index);
    setConfirmDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (deleteIndex !== null) {
      removeLocation(deleteIndex);
      setConfirmDeleteModal(false);
      if (addingStopIndex === deleteIndex) {
        setAddingStopIndex(null);
      }
    }
  };

  const handleSavedStop = () => {
    setAddingStopIndex(null);
  };

  return (
    <div>
      {editedLocations[0] && (
        <MoveAddress
          title="Starting Location"
          index={0}
          location={editedLocations[0]}
          updateLocation={updateLocation}
          showEditButton={true}
          isLoading={updateMoveLoading}
          error={updateMoveError}
        />
      )}

      <StopSection
        locations={editedLocations}
        addStopLocation={handleAddStop}
        removeLocation={handleRemoveStop}
        updateLocation={updateLocation}
        showEditButton={true}
        isAddingIndex={addingStopIndex}
        onSaved={handleSavedStop}
        isLoading={updateMoveLoading}
        error={updateMoveError}
      />

      {editedLocations.length > 1 &&
        editedLocations[editedLocations.length - 1] && (
          <MoveAddress
            title="Ending Location"
            index={editedLocations.length - 1}
            location={editedLocations[editedLocations.length - 1]}
            updateLocation={updateLocation}
            showEditButton={true}
            isLoading={updateMoveLoading}
            error={updateMoveError}
          />
        )}

      <LocationSummary
        companyContact={companyContact?.companyContact}
        locations={editedLocations}
        segmentDistances={move.segmentDistances}
        roundTripMiles={move.roundTripMiles}
        roundTripDrive={move.roundTripDrive}
        showBorder={true}
      />

      <ConfirmModal
        isOpen={confirmDeleteModal}
        onClose={() => {
          setConfirmDeleteModal(false);
          setDeleteIndex(null);
        }}
        onConfirm={handleConfirmDelete}
        deleteLoading={updateMoveLoading}
        deleteError={updateMoveError}
        title="Remove Stop"
        description="Are you sure you want to remove this stop?"
      />
    </div>
  );
};

export default LocationSection;
