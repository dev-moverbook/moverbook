"use client";

import React, { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { InsurancePolicySchema } from "@/types/convex-schemas";
import SectionContainer from "@/app/components/shared/SectionContainer";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import ConfirmModal from "@/app/components/shared/ConfirmModal";
import { Button } from "@/app/components/ui/button";
import LiabilityModal from "../modals/LiabilityModal";
import LiabilityCard from "../cards/LiablilityCard";
import { useCreateInsurancePolicy } from "../hooks/useCreateInsurancePolicy";
import { useUpdateInsurancePolicy } from "../hooks/useUpdateInsurancePolicy";
import { useDeleteInsurancePolicy } from "../hooks/useDeleteInsurancePolicy";

interface LiabilitySectionProps {
  policies: InsurancePolicySchema[];
  companyId: Id<"companies">;
}

const LiabilitySection: React.FC<LiabilitySectionProps> = ({
  policies,
  companyId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedPolicy, setSelectedPolicy] =
    useState<InsurancePolicySchema | null>(null);
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

  const handleOpenEditModal = (policy: InsurancePolicySchema): void => {
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
          title="Liability Policies"
          actions={
            <Button onClick={handleOpenCreateModal}>+ Add Policy</Button>
          }
        />

        {policies.map((policy) => (
          <div key={policy._id} className="flex items-center justify-between">
            <LiabilityCard
              policy={policy}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />
          </div>
        ))}

        {/* Create/Edit Modal */}
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

        {/* Delete Confirmation Modal */}
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
