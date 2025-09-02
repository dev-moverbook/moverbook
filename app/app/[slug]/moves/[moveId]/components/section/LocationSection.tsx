"use client";

import React, { useEffect, useState } from "react";
import { LocationInput } from "@/types/form-types";
import MoveAddress from "@/app/app/[slug]/add-move/components/sections/MoveAddress";
import LocationSummary from "@/app/app/[slug]/add-move/components/sections/LocationSummary";
import StopSection from "@/app/app/[slug]/add-move/components/sections/StopSection";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import { useCompanyContact } from "@/app/hooks/queries/useCompanyContact";
import { nanoid } from "nanoid";
import { useMoveContext } from "@/app/contexts/MoveContext";
import { ClerkRoles } from "@/types/enums";
import { canCreateMove, isMover } from "@/app/frontendUtils/permissions";
import { useSlugContext } from "@/app/contexts/SlugContext";

const LocationSection = () => {
  const { moveData } = useMoveContext();
  const move = moveData.move;

  const { user } = useSlugContext();
  const canCreateMoveUser = canCreateMove(
    user.publicMetadata.role as ClerkRoles
  );
  const isMoverUser = isMover(user.publicMetadata.role as ClerkRoles);

  const [addingStopIndex, setAddingStopIndex] = useState<number | null>(null);
  const [editedLocations, setEditedLocations] = useState<LocationInput[]>(
    move.locations
  );
  const [showBanner, setShowBanner] = useState<boolean>(false);

  const { data: companyContact } = useCompanyContact(move.companyId, {
    enabled: !isMoverUser,
  });
  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();

  useEffect(() => {
    if (Array.isArray(move.locations) && move.locations.length >= 2) {
      setEditedLocations(move.locations);
    }
  }, [move.locations]);

  const persistLocations = async (next: LocationInput[]) => {
    await updateMove({
      moveId: move._id,
      updates: { locations: next },
    });
  };

  const updateLocation = (index: number, partial: Partial<LocationInput>) => {
    const next = editedLocations.map((loc, i) =>
      i === index ? { ...loc, ...partial } : loc
    );
    setEditedLocations(next);
    // persist changes
    void persistLocations(next);
  };

  const removeLocation = async (index: number) => {
    // optimistic update
    const prev = editedLocations;
    const next = prev.filter((_, i) => i !== index);
    setEditedLocations(next);

    if (addingStopIndex !== null && index === addingStopIndex) {
      setAddingStopIndex(null);
    }

    const { success } = await updateMove({
      moveId: move._id,
      updates: { locations: next },
    });

    // rollback if failed
    if (!success) {
      setEditedLocations(prev);
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

    // insert before the ending location
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

    // persist new stop
    void persistLocations(next);
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
          canEdit={canCreateMoveUser}
        />
      )}
      {canCreateMoveUser && (
        <StopSection
          locations={editedLocations}
          addStopLocation={addStopLocation}
          removeLocation={removeLocation}
          updateLocation={updateLocation}
          showEditButton={true}
          isAddingIndex={addingStopIndex}
          onSaved={handleSavedStop}
          isLoading={updateMoveLoading}
          error={updateMoveError}
          showBannerFromParent={showBanner}
        />
      )}

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
            isAdding={false}
            canEdit={canCreateMoveUser}
          />
        )}

      <LocationSummary
        companyContact={companyContact?.companyContact}
        locations={editedLocations}
        segmentDistances={move.segmentDistances}
        showBorder={false}
      />
    </div>
  );
};

export default LocationSection;
