"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { LocationInput } from "@/types/form-types";
import { SegmentDistance } from "@/types/types";
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
import { useDistanceMatrix } from "@/app/app/[slug]/add-move/hooks/useDistanceMatrix";
import { buildDefaultSegments } from "@/app/frontendUtils/segmentDistanceHelper";
import { segmentsEqual } from "@/app/frontendUtils/helper";
import { useSegmentDistances } from "@/app/frontendUtils/moveFormHelper/useSegmentDistances";

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
  const { fetchDistance } = useDistanceMatrix();

  const [localSegments, setLocalSegments] = useState<SegmentDistance[]>(
    buildDefaultSegments()
  );

  // ---------- helpers to prevent feedback loops ----------
  const locationsEqual = useCallback(
    (a: LocationInput[], b: LocationInput[]) =>
      JSON.stringify(a) === JSON.stringify(b),
    []
  );

  const lastPersistedLocationsRef = useRef<LocationInput[] | null>(
    move.locations
  );
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPersistTimer = () => {
    if (persistTimerRef.current) {
      clearTimeout(persistTimerRef.current);
      persistTimerRef.current = null;
    }
  };

  const persistLocations = useCallback(
    (next: LocationInput[]) => {
      // Debounce saves to avoid writing on each keystroke
      clearPersistTimer();
      persistTimerRef.current = setTimeout(async () => {
        if (
          !lastPersistedLocationsRef.current ||
          !locationsEqual(lastPersistedLocationsRef.current, next)
        ) {
          const { success } = await updateMove({
            moveId: move._id,
            updates: { locations: next },
          });
          if (success) lastPersistedLocationsRef.current = next;
        }
      }, 400);
    },
    [locationsEqual, move._id, updateMove]
  );

  useEffect(() => {
    return () => clearPersistTimer();
  }, []);

  useSegmentDistances(
    companyContact?.companyContact?.address ?? null,
    editedLocations,
    fetchDistance,
    setLocalSegments
  );

  useEffect(() => {
    if (!locationsEqual(move.locations, editedLocations)) {
      setEditedLocations(move.locations);
      lastPersistedLocationsRef.current = move.locations;
    }
  }, [move.locations]); // intentionally minimal deps

  const lastSentSegmentsRef = useRef<SegmentDistance[] | null>(
    move.segmentDistances ?? null
  );

  useEffect(() => {
    const current = move.segmentDistances ?? [];
    const next = localSegments;

    const sameAsMove = segmentsEqual(current, next);
    const sameAsLastSent = lastSentSegmentsRef.current
      ? segmentsEqual(lastSentSegmentsRef.current, next)
      : false;

    if (!sameAsMove && !sameAsLastSent) {
      lastSentSegmentsRef.current = next;
      void updateMove({
        moveId: move._id,
        updates: { segmentDistances: next },
      });
    }
  }, [localSegments, move._id, move.segmentDistances, updateMove]);

  const updateLocation = (index: number, partial: Partial<LocationInput>) => {
    const next = editedLocations.map((loc, i) =>
      i === index ? { ...loc, ...partial } : loc
    );
    setEditedLocations(next);
    persistLocations(next);
  };

  const removeLocation = (index: number) => {
    const next = editedLocations.filter((_, i) => i !== index);
    setEditedLocations(next);

    if (addingStopIndex !== null && index === addingStopIndex) {
      setAddingStopIndex(null);
    }

    persistLocations(next);
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
    persistLocations(next);
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
        segmentDistances={localSegments}
        showBorder={false}
      />
    </div>
  );
};

export default LocationSection;
