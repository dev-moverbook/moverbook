"use client";

import React, { useEffect, useState } from "react";
import { LocationInput } from "@/types/form-types";
import MoveAddress from "@/components/add-move/components/sections/MoveAddress";
import LocationSummary from "@/components/add-move/components/sections/LocationSummary";
import StopSection from "@/components/add-move/components/sections/StopSection";
import { useUpdateMove } from "@/hooks/moves";
import { useCompanyContact } from "@/hooks/companyContacts";
import { nanoid } from "nanoid";
import { useMoveContext } from "@/contexts/MoveContext";
import { canCreateMove } from "@/frontendUtils/permissions";
import { useSlugContext } from "@/contexts/SlugContext";
import { isMoveCompleted } from "@/frontendUtils/moveHelper";

const LocationSection = () => {
  const { moveData } = useMoveContext();
  const move = moveData.move;
  const { user } = useSlugContext();
  const canCreateMoveUser = canCreateMove(user.role);

  const [editedLocations, setEditedLocations] = useState<LocationInput[]>(
    move.locations ?? []
  );
  const [addingStopIndex, setAddingStopIndex] = useState<number | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);

  const companyContact = useCompanyContact(move.companyId);
  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();

  useEffect(() => {
    setEditedLocations(move.locations ?? []);
  }, [move.locations]);

  const handleSaveLocations = async (
    savedLocation?: LocationInput,
    idx?: number
  ) => {
    let nextLocations = editedLocations;

    if (savedLocation) {
      if (typeof idx === "number") {
        nextLocations = editedLocations.map((loc, i) =>
          i === idx ? savedLocation : loc
        );
      } else if (savedLocation.uid) {
        nextLocations = editedLocations.map((loc) =>
          loc.uid === savedLocation.uid ? savedLocation : loc
        );
      }
    }

    setEditedLocations(nextLocations);

    await updateMove({
      moveId: move._id,
      updates: { locations: nextLocations },
    });
  };

  const updateLocation = (index: number, partial: Partial<LocationInput>) => {
    setEditedLocations((prev) =>
      prev.map((loc, i) => (i === index ? { ...loc, ...partial } : loc))
    );
  };

  const removeLocation = async (index: number) => {
    const nextLocations = editedLocations.filter((_, i) => i !== index);
    setEditedLocations(nextLocations);

    if (addingStopIndex !== null && index === addingStopIndex) {
      setAddingStopIndex(null);
    }

    await updateMove({
      moveId: move._id,
      updates: { locations: nextLocations },
    });
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

  const handleSavedStop = (savedStop?: LocationInput, index?: number) => {
    setAddingStopIndex(null);

    if (savedStop) {
      void handleSaveLocations(savedStop, index);
    }
  };
  const hideButton = isMoveCompleted(move);

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
          onSaved={(savedLocation, index) =>
            handleSaveLocations(savedLocation, index)
          }
          hideButton={hideButton}
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
          hideButton={hideButton}
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
            onSaved={(savedLocation, index) =>
              handleSaveLocations(savedLocation, index)
            }
            hideButton={hideButton}
          />
        )}

      <LocationSummary
        companyContact={companyContact}
        locations={move.locations ?? []}
        segmentDistances={move.segmentDistances ?? []}
        showBorder={false}
      />
    </div>
  );
};

export default LocationSection;
