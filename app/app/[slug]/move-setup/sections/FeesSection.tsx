"use client";

import React, { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { FeeSchema } from "@/types/convex-schemas"; // Define FeeSchema in your types
import ConfirmModal from "@/app/components/shared/ConfirmModal";
import { useCreateFee } from "../hooks/useCreateFee"; // Create this hook
import { useUpdateFee } from "../hooks/useUpdateFee"; // Create this hook
import { useDeleteFee } from "../hooks/useDeleteFee"; // Create this hook
import FeeModal from "../modals/FeeModal";
import FeeCard from "../cards/FeeCard";

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
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Fees</h2>

      {fees.map((fee) => (
        <div key={fee._id} className="flex items-center justify-between">
          <FeeCard
            fee={fee}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
          />
        </div>
      ))}

      <button
        onClick={handleOpenCreateModal}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add New Fee
      </button>

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
    </div>
  );
};

export default FeesSection;
