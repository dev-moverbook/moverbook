"use client";

import React, { useState } from "react";
import { LaborSchema } from "@/types/convex-schemas";
import LaborCard from "../cards/LaborCard";
import LaborModal from "../modals/LaborModal";
import { Id } from "@/convex/_generated/dataModel";
import { useCreateLabor } from "../hooks/useCreateLabor";
import { useUpdateLabor } from "../hooks/useUpdateLabor";
import { useDeleteLabor } from "../hooks/useDeleteLabor";
import ConfirmModal from "@/app/components/shared/ConfirmModal";

interface LaborSectionProps {
  labor: LaborSchema[];
  companyId: Id<"companies">;
}

const LaborSection: React.FC<LaborSectionProps> = ({ labor, companyId }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedLabor, setSelectedLabor] = useState<LaborSchema | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [laborToDelete, setLaborToDelete] = useState<Id<"labor"> | null>(null);

  const {
    createLabor,
    createLaborLoading,
    createLaborError,
    setCreateLaborError,
  } = useCreateLabor();

  const {
    updateLabor,
    updateLaborLoading,
    updateLaborError,
    setUpdateLaborError,
  } = useUpdateLabor();

  const {
    deleteLabor,
    deleteLaborLoading,
    deleteLaborError,
    setDeleteLaborError,
  } = useDeleteLabor();

  const handleOpenCreateModal = (): void => {
    setIsEditMode(false);
    setSelectedLabor(null);
    setIsModalOpen(true);
    setCreateLaborError(null);
  };

  const handleOpenEditModal = (laborItem: LaborSchema): void => {
    setIsEditMode(true);
    setSelectedLabor(laborItem);
    setIsModalOpen(true);
    setUpdateLaborError(null);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedLabor(null);
  };

  const handleOpenDeleteModal = (laborId: Id<"labor">): void => {
    setIsDeleteModalOpen(true);
    setLaborToDelete(laborId);
    setDeleteLaborError(null);
  };

  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
    setLaborToDelete(null);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!laborToDelete) return;

    const success = await deleteLabor(laborToDelete);
    if (success) {
      handleCloseDeleteModal();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Labor Rates</h2>

      {labor.map((laborItem) => (
        <div key={laborItem._id} className="flex items-center justify-between">
          <LaborCard
            laborItem={laborItem}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
          />
        </div>
      ))}

      <button
        onClick={handleOpenCreateModal}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add New Labor
      </button>

      <LaborModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreate={createLabor}
        onEdit={updateLabor}
        loading={isEditMode ? updateLaborLoading : createLaborLoading}
        error={isEditMode ? updateLaborError : createLaborError}
        companyId={companyId}
        initialData={selectedLabor}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        deleteLoading={deleteLaborLoading}
        deleteError={deleteLaborError}
        title="Confirm Delete"
        description="Are you sure you want to delete this labor item? This action cannot be undone."
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />
    </div>
  );
};

export default LaborSection;
