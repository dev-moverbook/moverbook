import ConfirmModal from "@/components/shared/ConfirmModal";
import SectionContainer from "@/components/shared/SectionContainer";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useResetRoomsCategoriesItems } from "../hooks/useResetRoomsCategoriesItems";
import { Id } from "@/convex/_generated/dataModel";
import CenteredContainer from "@/components/shared/CenteredContainer";
import SectionHeader from "@/components/shared/SectionHeader";

interface ResetSectionProps {
  companyId: Id<"companies">;
}

const ResetSection = ({ companyId }: ResetSectionProps) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const { resetRoomsCategoriesItems, resetLoading, resetError, setResetError } =
    useResetRoomsCategoriesItems();

  const handleOpenConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setResetError(null);
  };

  const handleConfirmDelete = async () => {
    const result = await resetRoomsCategoriesItems(companyId);
    if (result) {
      handleCloseConfirmModal();
    }
  };

  return (
    <SectionContainer isLast={true}>
      <CenteredContainer>
        <SectionHeader className="px-0 pb-4" title="Reset" />
        <p className="text-grayCustom2 mb-4">
          Reset the items, rooms, and categories to the default values.
        </p>

        <Button
          className="w-[200px]"
          variant="outline"
          onClick={handleOpenConfirmModal}
        >
          Reset
        </Button>
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseConfirmModal}
          onConfirm={handleConfirmDelete}
          deleteLoading={resetLoading}
          deleteError={resetError}
          title="Reset Items, Rooms, and Categories"
          description="Are you sure you want to reset the items, rooms, and categories? All updated and edited data will be lost."
          confirmButtonText="Reset"
          cancelButtonText="Cancel"
        />
      </CenteredContainer>
    </SectionContainer>
  );
};

export default ResetSection;
