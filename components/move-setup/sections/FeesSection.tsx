"use client";

import React, { useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { useCreateFee } from "@/hooks/fees";
import { useUpdateFee } from "@/hooks/fees";
import { useDeleteFee } from "@/hooks/fees";
import FeeModal from "../modals/FeeModal";
import FeeCard from "../cards/FeeCard";
import CenteredContainer from "@/components/shared/CenteredContainer";
import SectionContainer from "@/components/shared/SectionContainer";
import SectionHeader from "@/components/shared/SectionHeader";
import CardContainer from "@/components/shared/CardContainer";
import AddItemButton from "@/components/shared/buttons/AddItemButton";

interface FeesSectionProps {
  fees: Doc<"fees">[];
  companyId: Id<"companies">;
}

const FeesSection: React.FC<FeesSectionProps> = ({ fees, companyId }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedFee, setSelectedFee] = useState<Doc<"fees"> | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [feeToDelete, setFeeToDelete] = useState<Id<"fees"> | null>(null);

  const { createFee, createLoading, createError, setCreateError } =
    useCreateFee();

  const { updateFee, updateLoading, updateError, setUpdateError } =
    useUpdateFee();

  const { deleteFee, deleteLoading, deleteError, setDeleteError } =
    useDeleteFee();

  const handleOpenCreateModal = (): void => {
    setIsEditMode(false);
    setSelectedFee(null);
    setIsModalOpen(true);
    setCreateError(null);
  };

  const handleOpenEditModal = (fee: Doc<"fees">): void => {
    setIsEditMode(true);
    setSelectedFee(fee);
    setIsModalOpen(true);
    setUpdateError(null);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedFee(null);
  };

  const handleOpenDeleteModal = (feeId: Id<"fees">): void => {
    setIsDeleteModalOpen(true);
    setFeeToDelete(feeId);
    setDeleteError(null);
  };

  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
    setFeeToDelete(null);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!feeToDelete) return;

    const success = await deleteFee(feeToDelete);
    if (success) {
      handleCloseDeleteModal();
    }
  };

  return (
    <SectionContainer isLast={true}>
      <CenteredContainer>
        <SectionHeader
          className="px-0 pb-4"
          title="Fees"
          actions={
            <AddItemButton label="Fee" onClick={handleOpenCreateModal} />
          }
        />
        <CardContainer>
          {fees.map((fee) => (
            <FeeCard
              key={fee._id}
              fee={fee}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />
          ))}
        </CardContainer>
        <FeeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onCreate={createFee}
          onEdit={updateFee}
          loading={isEditMode ? updateLoading : createLoading}
          error={isEditMode ? updateError : createError}
          companyId={companyId}
          initialData={selectedFee}
        />

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          deleteLoading={deleteLoading}
          deleteError={deleteError}
          title="Confirm Delete"
          description="Are you sure you want to delete this fee? This action cannot be undone."
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
        />
      </CenteredContainer>
    </SectionContainer>
  );
};

export default FeesSection;
