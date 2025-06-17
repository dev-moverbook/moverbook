import React, { useEffect, useState } from "react";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import FieldGroup from "@/app/components/shared/FieldGroup";
import FormActions from "@/app/components/shared/FormActions";
import { MoveSchema } from "@/types/convex-schemas";
import { LocationInput } from "@/types/form-types";
import MoveAddress from "@/app/app/[slug]/add-move/components/sections/MoveAddress";
import LocationSummary from "@/app/app/[slug]/add-move/components/sections/LocationSummary";
import StopSectionHeader from "@/app/components/move/header/StopSectionHeader";
import StopSection from "@/app/app/[slug]/add-move/components/sections/StopSection";
import ConfirmDeleteModal from "@/app/app/[slug]/company-setup/modals/ConfirmDeleteModal";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import { useCompanyContact } from "@/app/hooks/queries/useCompanyContact";
import { nanoid } from "nanoid";

interface LocationSectionProps {
  move: MoveSchema;
}

const LocationSection = ({ move }: LocationSectionProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedLocations, setEditedLocations] = useState<LocationInput[]>(
    move.locations
  );
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

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
      locationType: "stop",
      address: "",
      moveType: null,
      aptNumber: null,
      aptName: null,
      squareFootage: null,
      accessType: null,
      moveSize: null,
      stopBehavior: undefined,
    };
    const insertIndex = editedLocations.length - 1;
    setEditedLocations((prev) => [
      ...prev.slice(0, insertIndex),
      newStop,
      ...prev.slice(insertIndex),
    ]);
  };

  const handleSave = async () => {
    const result = await updateMove({
      moveId: move._id,
      updates: {
        locations: editedLocations,
      },
    });

    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedLocations(move.locations);
    setIsEditing(false);
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
    }
  };

  const stops = editedLocations.slice(1, -1);

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

      <ConfirmDeleteModal
        isOpen={confirmDeleteModal}
        onClose={() => {
          setConfirmDeleteModal(false);
          setDeleteIndex(null);
        }}
        onConfirm={handleConfirmDelete}
        deleteLoading={updateMoveLoading}
        deleteError={updateMoveError}
      />
    </div>
  );
};

export default LocationSection;
