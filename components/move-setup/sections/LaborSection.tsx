"use client";

import React, { useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import SectionContainer from "@/components/shared/SectionContainer";
import CenteredContainer from "@/components/shared/CenteredContainer";
import SectionHeader from "@/components/shared/SectionHeader";
import ConfirmModal from "@/components/shared/ConfirmModal";
import LaborCard from "../cards/LaborCard";
import LaborModal from "../modals/LaborModal";
import { useCreateLabor } from "../hooks/useCreateLabor";
import { useUpdateLabor } from "../hooks/useUpdateLabor";
import { useDeleteLabor } from "../hooks/useDeleteLabor";
import CardContainer from "@/components/shared/CardContainer";
import AddItemButton from "@/components/shared/buttons/AddItemButton";
import { useSlugContext } from "@/contexts/SlugContext";

interface LaborSectionProps {
  labor: Doc<"labor">[];
}

const LaborSection: React.FC<LaborSectionProps> = ({ labor }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedLabor, setSelectedLabor] = useState<Doc<"labor"> | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [laborToDelete, setLaborToDelete] = useState<Id<"labor"> | null>(null);

  const { companyId } = useSlugContext();

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

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setSelectedLabor(null);
    setIsModalOpen(true);
    setCreateLaborError(null);
  };

  const handleOpenEditModal = (laborItem: Doc<"labor">) => {
    setIsEditMode(true);
    setSelectedLabor(laborItem);
    setIsModalOpen(true);
    setUpdateLaborError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLabor(null);
  };

  const handleOpenDeleteModal = (laborId: Id<"labor">) => {
    setIsDeleteModalOpen(true);
    setLaborToDelete(laborId);
    setDeleteLaborError(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setLaborToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!laborToDelete) {
      return;
    }

    const success = await deleteLabor(laborToDelete);
    if (success) {
      handleCloseDeleteModal();
    }
  };

  return (
    <SectionContainer>
      <CenteredContainer>
        <SectionHeader
          title="Labor Rates"
          actions={
            <AddItemButton label="Labor" onClick={handleOpenCreateModal} />
          }
          className="px-0 pb-4"
        />

        <CardContainer className="flex flex-col gap-4">
          {labor.map((laborItem) => (
            <LaborCard
              key={laborItem._id}
              laborItem={laborItem}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />
          ))}
        </CardContainer>

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
      </CenteredContainer>
    </SectionContainer>
  );
};

export default LaborSection;
