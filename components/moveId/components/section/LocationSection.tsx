"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { LocationInput } from "@/types/form-types";
import { SegmentDistance } from "@/types/types";
import MoveAddress from "@/components/add-move/components/sections/MoveAddress";
import LocationSummary from "@/components/add-move/components/sections/LocationSummary";
import StopSection from "@/components/add-move/components/sections/StopSection";
import { useUpdateMove } from "@/hooks/moves";
import { useCompanyContact } from "@/hooks/companyContact";
import { nanoid } from "nanoid";
import { useMoveContext } from "@/contexts/MoveContext";
import { canCreateMove } from "@/frontendUtils/permissions";
import { useSlugContext } from "@/contexts/SlugContext";
import { useDistanceMatrix } from "@/components/add-move/hooks/useDistanceMatrix";
import { buildDefaultSegments } from "@/frontendUtils/segmentDistanceHelper";
import { segmentsEqual } from "@/frontendUtils/helper";
import { useSegmentDistances } from "@/frontendUtils/moveFormHelper/useSegmentDistances";

const LocationSection = () => {
  const { moveData } = useMoveContext();
  const move = moveData.move;

  const { user } = useSlugContext();
  const canCreateMoveUser = canCreateMove(user.role);

  const [addingStopIndex, setAddingStopIndex] = useState<number | null>(null);
  const [editedLocations, setEditedLocations] = useState<LocationInput[]>(
    move.locations
  );
  const [showBanner, setShowBanner] = useState<boolean>(false);

  const companyContact = useCompanyContact(move.companyId);
  const { updateMove, updateMoveLoading, updateMoveError } = useUpdateMove();
  const { fetchDistance } = useDistanceMatrix();

  const [localSegments, setLocalSegments] = useState<SegmentDistance[]>(
    buildDefaultSegments()
  );

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
      clearPersistTimer();
      persistTimerRef.current = setTimeout(async () => {
        if (
          !lastPersistedLocationsRef.current ||
          !locationsEqual(lastPersistedLocationsRef.current, next)
        ) {
          const success = await updateMove({
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
    companyContact?.address ?? null,
    editedLocations,
    fetchDistance,
    setLocalSegments
  );

  useEffect(() => {
    if (
      !locationsEqual(move.locations, editedLocations) &&
      !locationsEqual(move.locations, lastPersistedLocationsRef.current ?? [])
    ) {
      setEditedLocations(move.locations);
      lastPersistedLocationsRef.current = move.locations;
    }
  }, [move.locations, editedLocations, locationsEqual]);

  const lastSentSegmentsRef = useRef<SegmentDistance[] | null>(
    move.segmentDistances ?? null
  );

  useEffect(() => {
    const current = move.segmentDistances ?? [];
    const next = localSegments;

    const hasNullValues = next.some(
      (segment) => segment.distance === null || segment.duration === null
    );

    if (hasNullValues) {
      return;
    }

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
        companyContact={companyContact}
        locations={editedLocations}
        segmentDistances={localSegments}
        showBorder={false}
      />
    </div>
  );
};

export default LocationSection;
