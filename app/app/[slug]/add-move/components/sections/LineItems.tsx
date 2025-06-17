"use client";

import React, { useState } from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import { Button } from "@/app/components/ui/button";
import CardContainer from "@/app/components/shared/CardContainer";
import AddLineModal from "../modals/AddLineModal";
import LineItemFeeCard from "../cards/LineItemFeeCard";
import Header3 from "@/app/components/shared/heading/Header3";
import { Plus } from "lucide-react";
import { MoveFeeInput } from "@/types/form-types";
import { FeeSchema } from "@/types/convex-schemas";

interface LineItemsProps {
  moveFees: MoveFeeInput[];
  addMoveFee: (fee: MoveFeeInput) => void;
  updateMoveFee: (index: number, fee: MoveFeeInput) => void;
  deleteMoveFee: (index: number) => void;
  moveFeeOptions?: FeeSchema[];
  isLoading: boolean;
  errorMessage?: string | null;
}

const LineItems: React.FC<LineItemsProps> = ({
  moveFees,
  addMoveFee,
  updateMoveFee,
  deleteMoveFee,
  moveFeeOptions,
  isLoading,
  errorMessage,
}) => {
  const [showAddLineItemModal, setShowAddLineItemModal] =
    useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

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
      <Header3
        wrapperClassName="px-0 py-0"
        showCheckmark={false}
        button={
          <Button variant="outline" onClick={handleOpenAddLineItemModal}>
            <div className="flex items-center gap-1">
              <Plus className="w-5 h-5" />
              Line Item
            </div>
          </Button>
        }
      >
        Line Items
      </Header3>

      <AddLineModal
        isOpen={showAddLineItemModal}
        onClose={() => setShowAddLineItemModal(false)}
        initialData={editIndex !== null ? moveFees[editIndex] : null}
        onSubmit={handleSubmitFee}
        moveFeeOptions={moveFeeOptions}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
      {moveFees.length > 0 && (
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
      )}
    </SectionContainer>
  );
};

export default LineItems;
