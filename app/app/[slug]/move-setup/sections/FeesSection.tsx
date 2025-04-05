"use client";

import React, { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { FeeSchema } from "@/types/convex-schemas";
import ConfirmModal from "@/app/components/shared/ConfirmModal";
import { useCreateFee } from "../hooks/useCreateFee";
import { useUpdateFee } from "../hooks/useUpdateFee";
import { useDeleteFee } from "../hooks/useDeleteFee";
import FeeModal from "../modals/FeeModal";
import FeeCard from "../cards/FeeCard";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionContainer from "@/app/components/shared/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import { Button } from "@/app/components/ui/button";
import CardListContainer from "@/app/components/shared/CardListContainer";
import CardContainer from "@/app/components/shared/CardContainer";

interface FeesSectionProps {
  fees: FeeSchema[];
  companyId: Id<"companies">;
}

const FeesSection: React.FC<FeesSectionProps> = ({ fees, companyId }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedFee, setSelectedFee] = useState<FeeSchema | null>(null);
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

  const handleOpenEditModal = (fee: FeeSchema): void => {
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
    <SectionContainer>
      <CenteredContainer>
        <SectionHeader
          title="Fees"
          actions={
            <Button onClick={handleOpenCreateModal}>+ Create Fee</Button>
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
        {/* Create/Edit Modal */}
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

        {/* Delete Confirmation Modal */}
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
