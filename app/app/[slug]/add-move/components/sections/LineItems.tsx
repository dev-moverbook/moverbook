"use client";

import React, { useState } from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import CardContainer from "@/app/components/shared/CardContainer";
import AddLineModal from "../modals/AddLineModal";
import LineItemFeeCard from "../cards/LineItemFeeCard";
import Header3 from "@/app/components/shared/heading/Header3";
import { MoveFeeInput } from "@/types/form-types";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import ConfirmModal from "@/app/components/shared/ConfirmModal";
import AddItemButton from "@/app/components/shared/buttons/AddItemButton";

const LineItems: React.FC = () => {
  const {
    moveFormData,
    moveFeeOptions,
    isLoading,
    addMoveFee,
    updateMoveFee,
    deleteMoveFee,
  } = useMoveForm();
  const [showAddLineItemModal, setShowAddLineItemModal] =
    useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleOpenAddLineItemModal = () => {
    setEditIndex(null);
    setShowAddLineItemModal(true);
  };

  const handleOpenEditModal = (fee: MoveFeeInput) => {
    const index = moveFormData.moveFees.findIndex(
      (f) => f.name === fee.name && f.price === fee.price
    );
    if (index !== -1) {
      setEditIndex(index);
      setShowAddLineItemModal(true);
    }
  };

  const handleOpenDeleteModal = (fee: MoveFeeInput) => {
    const index = moveFormData.moveFees.findIndex(
      (f) => f.name === fee.name && f.price === fee.price
    );
    if (index !== -1) {
      setDeleteIndex(index);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteFee = () => {
    if (deleteIndex !== null) {
      deleteMoveFee(deleteIndex);
    }
    setShowDeleteModal(false);
  };

  const handleSubmitFee = (fee: MoveFeeInput) => {
    if (editIndex !== null) {
      updateMoveFee(editIndex, fee);
    } else {
      addMoveFee(fee);
    }
    setShowAddLineItemModal(false);
  };

  return (
    <SectionContainer>
      <Header3
        wrapperClassName="px-0 py-0"
        showCheckmark={false}
        button={
          <AddItemButton
            label="Line Item"
            onClick={handleOpenAddLineItemModal}
          />
        }
      >
        Line Items
      </Header3>

      <AddLineModal
        isOpen={showAddLineItemModal}
        onClose={() => setShowAddLineItemModal(false)}
        initialData={
          editIndex !== null ? moveFormData.moveFees[editIndex] : null
        }
        onSubmit={handleSubmitFee}
        moveFeeOptions={moveFeeOptions}
        isLoading={isLoading}
      />
      {moveFormData.moveFees.length > 0 && (
        <CardContainer>
          {moveFormData.moveFees.map((fee, index) => (
            <LineItemFeeCard
              key={`${fee.name}-${index}`}
              fee={fee}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />
          ))}
        </CardContainer>
      )}

      <ConfirmModal
        title="Are you sure you want to delete this line item?"
        description="This action cannot be undone."
        onClose={() => setShowDeleteModal(false)}
        isOpen={showDeleteModal}
        onConfirm={handleDeleteFee}
        deleteLoading={false}
        deleteError={null}
      />
    </SectionContainer>
  );
};

export default LineItems;
