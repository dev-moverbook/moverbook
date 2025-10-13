"use client";

import React, { useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import ConfirmModal from "@/app/components/shared/ConfirmModal";
import LiabilityModal from "../modals/LiabilityModal";
import LiabilityCard from "../cards/LiablilityCard";
import { useCreateInsurancePolicy } from "../hooks/useCreateInsurancePolicy";
import { useUpdateInsurancePolicy } from "../hooks/useUpdateInsurancePolicy";
import { useDeleteInsurancePolicy } from "../hooks/useDeleteInsurancePolicy";
import CardContainer from "@/app/components/shared/CardContainer";
import AddItemButton from "@/app/components/shared/buttons/AddItemButton";
import { useSlugContext } from "@/app/contexts/SlugContext";

interface LiabilitySectionProps {
  policies: Doc<"insurancePolicies">[];
}

const LiabilitySection: React.FC<LiabilitySectionProps> = ({ policies }) => {
  const { companyId } = useSlugContext();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedPolicy, setSelectedPolicy] =
    useState<Doc<"insurancePolicies"> | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [policyToDelete, setPolicyToDelete] =
    useState<Id<"insurancePolicies"> | null>(null);

  const {
    createInsurancePolicy,
    createInsurancePolicyLoading,
    createInsurancePolicyError,
    setCreateInsurancePolicyError,
  } = useCreateInsurancePolicy();
  const {
    updateInsurancePolicy,
    updateInsurancePolicyLoading,
    updateInsurancePolicyError,
    setUpdateInsurancePolicyError,
  } = useUpdateInsurancePolicy();
  const {
    deleteInsurancePolicy,
    deleteInsurancePolicyLoading,
    deleteInsurancePolicyError,
    setDeleteInsurancePolicyError,
  } = useDeleteInsurancePolicy();

  const handleOpenCreateModal = (): void => {
    setIsEditMode(false);
    setSelectedPolicy(null);
    setIsModalOpen(true);
    setCreateInsurancePolicyError(null);
  };

  const handleOpenEditModal = (policy: Doc<"insurancePolicies">): void => {
    setIsEditMode(true);
    setSelectedPolicy(policy);
    setIsModalOpen(true);
    setUpdateInsurancePolicyError(null);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedPolicy(null);
  };

  const handleOpenDeleteModal = (policyId: Id<"insurancePolicies">): void => {
    setIsDeleteModalOpen(true);
    setPolicyToDelete(policyId);
    setDeleteInsurancePolicyError(null);
  };

  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
    setPolicyToDelete(null);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!policyToDelete) return;

    const success = await deleteInsurancePolicy(policyToDelete);
    if (success) {
      handleCloseDeleteModal();
    }
  };

  return (
    <SectionContainer>
      <CenteredContainer>
        <SectionHeader
          className="px-0 pb-4"
          title="Liability Coverage"
          actions={
            <AddItemButton label="Coverage" onClick={handleOpenCreateModal} />
          }
        />

        <CardContainer className="flex flex-col gap-4">
          {policies.map((policy) => (
            <LiabilityCard
              policy={policy}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              key={policy._id}
            />
          ))}
        </CardContainer>

        <LiabilityModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onCreate={createInsurancePolicy}
          onEdit={updateInsurancePolicy}
          loading={
            isEditMode
              ? updateInsurancePolicyLoading
              : createInsurancePolicyLoading
          }
          error={
            isEditMode ? updateInsurancePolicyError : createInsurancePolicyError
          }
          companyId={companyId}
          initialData={selectedPolicy}
        />

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          deleteLoading={deleteInsurancePolicyLoading}
          deleteError={deleteInsurancePolicyError}
          title="Confirm Delete"
          description="Are you sure you want to delete this policy? This action cannot be undone."
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
        />
      </CenteredContainer>
    </SectionContainer>
  );
};

export default LiabilitySection;
