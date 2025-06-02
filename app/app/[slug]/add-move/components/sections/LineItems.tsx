"use client";

import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import { Button } from "@/app/components/ui/button";
import React, { useState } from "react";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import CardContainer from "@/app/components/shared/CardContainer";
import { MoveFeeInput } from "@/types/form-types";
import SectionHeaderWithAction from "@/app/components/shared/ SectionHeaderWithAction";
import AddLineModal from "../modals/AddLineModal";
import LineItemFeeCard from "../cards/LineItemFeeCard";

const LineItems = () => {
  const [showAddLineItemModal, setShowAddLineItemModal] =
    useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const { moveFees, addMoveFee, updateMoveFee, deleteMoveFee } = useMoveForm();

  const handleOpenAddLineItemModal = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setEditIndex(null);
    setShowAddLineItemModal(true);
  };

  const handleOpenEditModal = (fee: MoveFeeInput) => {
    const index = moveFees.findIndex(
      (f) => f.name === fee.name && f.price === fee.price
    );
    if (index !== -1) {
      setEditIndex(index);
      setShowAddLineItemModal(true);
    }
  };

  const handleOpenDeleteModal = (fee: MoveFeeInput) => {
    const index = moveFees.findIndex(
      (f) => f.name === fee.name && f.price === fee.price
    );
    if (index !== -1) {
      deleteMoveFee(index);
    }
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
      <SectionHeaderWithAction
        title="Line Items"
        action={
          <Button variant="outline" onClick={handleOpenAddLineItemModal}>
            Add Line Item
          </Button>
        }
      />
      <AddLineModal
        isOpen={showAddLineItemModal}
        onClose={() => setShowAddLineItemModal(false)}
        initialData={editIndex !== null ? moveFees[editIndex] : null}
        onSubmit={handleSubmitFee}
      />
      <CardContainer>
        {moveFees.map((fee, index) => (
          <LineItemFeeCard
            key={`${fee.name}-${index}`}
            fee={fee}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
          />
        ))}
      </CardContainer>
    </SectionContainer>
  );
};

export default LineItems;
