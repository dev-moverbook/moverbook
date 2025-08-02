import React, { useState } from "react";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import { Button } from "@/app/components/ui/button";
import CardContainer from "@/app/components/shared/CardContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import { Plus } from "lucide-react";
import { MoveFeeInput } from "@/types/form-types";
import AddLineModal from "@/app/app/[slug]/add-move/components/modals/AddLineModal";
import LineItemFeeCard from "@/app/app/[slug]/add-move/components/cards/LineItemFeeCard";
import ConfirmModal from "../../shared/ConfirmModal";
import { Doc, Id } from "@/convex/_generated/dataModel";

interface LineItemsSectionProps {
  fees: MoveFeeInput[];
  moveFeeOptions: any[]; // adjust type if needed
  isLoading: boolean;
  errorMessage: string | null;
  onAdd: (fee: MoveFeeInput) => void;
  onUpdate: (index: number, fee: MoveFeeInput) => void;
  onDelete: (index: number) => void;
}

const LineItemsSection: React.FC<LineItemsSectionProps> = ({
  fees,
  moveFeeOptions,
  isLoading,
  errorMessage,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [showAddLineItemModal, setShowAddLineItemModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteFeeIndex, setDeleteFeeIndex] = useState<number | null>(null);

  const handleOpenAddLineItemModal = () => {
    setEditIndex(null);
    setShowAddLineItemModal(true);
  };

  const handleOpenEditModal = (fee: MoveFeeInput, index: number) => {
    setEditIndex(index);
    setShowAddLineItemModal(true);
  };

  const handleSubmitFee = (fee: MoveFeeInput) => {
    if (editIndex !== null) {
      onUpdate(editIndex, fee);
    } else {
      onAdd(fee);
    }
    setShowAddLineItemModal(false);
  };

  const handleOpenDeleteModal = (fee: MoveFeeInput) => {
    const index = fees.findIndex(
      (f) => f.name === fee.name && f.price === fee.price
    );
    setDeleteFeeIndex(index);
    setShowDeleteModal(true);
  };

  const handleDeleteFee = () => {
    if (deleteFeeIndex !== null) {
      onDelete(deleteFeeIndex);
    }
    setShowDeleteModal(false);
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
        initialData={editIndex !== null ? fees[editIndex] : null}
        onSubmit={handleSubmitFee}
        moveFeeOptions={moveFeeOptions}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />

      {fees.length > 0 && (
        <CardContainer>
          {fees.map((fee, index) => (
            <LineItemFeeCard
              key={`${fee.name}-${index}`}
              fee={fee}
              onEdit={() => handleOpenEditModal(fee, index)}
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

export default LineItemsSection;
