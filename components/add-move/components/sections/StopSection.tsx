// StopSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import MoveAddress from "./MoveAddress";
import StopSectionHeader from "@/components/move/header/StopSectionHeader";
import { LocationInput } from "@/types/form-types";
import ConfirmModal from "@/components/shared/modal/ConfirmModal";

interface StopSectionProps {
  locations: LocationInput[];
  addStopLocation: () => void;
  removeLocation: (index: number) => Promise<void> | void;
  updateLocation: (index: number, partial: Partial<LocationInput>) => void;
  showEditButton?: boolean;
  isAddingIndex?: number | null;
  onSaved?: () => void;
  isLoading?: boolean;
  error?: string | null;
  showBannerFromParent?: boolean;
  onPlaceSelected?: () => void;
  hideButton?: boolean;
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
  showBannerFromParent,
  onPlaceSelected,
  hideButton = false,
}: StopSectionProps) => {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isAddingIndex === null && onSaved) {
      onSaved();
    }
  }, [isAddingIndex, onSaved]);

  const handleAddStop = (e: React.MouseEvent) => {
    e.preventDefault();
    addStopLocation();
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 2000);
  };

  const handleConfirmDelete = async () => {
    if (deleteIndex !== null) {
      await removeLocation(deleteIndex);
      setShowModal(false);
      setDeleteIndex(null);
      if (onSaved) onSaved();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDeleteIndex(null);
  };

  const handleOpenDeleteModal = (index: number) => {
    setShowModal(true);
    setDeleteIndex(index);
  };

  const stops = locations.slice(1, -1);

  return (
    <div>
      <StopSectionHeader
        stopCount={stops.length}
        showBanner={showBanner || !!showBannerFromParent}
        onAddStop={handleAddStop}
        hideButton={hideButton}
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
            removeLocation={() => handleOpenDeleteModal(actualIndex)}
            showEditButton={showEditButton}
            isAdding={isAddingIndex === actualIndex}
            onSaved={onSaved}
            isLoading={isLoading}
            error={error}
            onPlaceSelected={onPlaceSelected}
          />
        );
      })}

      <ConfirmModal
        title="Are you sure you want to delete this stop?"
        description="This action cannot be undone."
        onClose={handleCloseModal}
        isOpen={showModal}
        onConfirm={handleConfirmDelete}
        deleteLoading={!!isLoading}
        deleteError={error ?? null}
      />
    </div>
  );
};

export default StopSection;
