"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";
import CardContainer from "@/components/shared/card/CardContainer";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import Header3 from "@/components/shared/heading/Header3";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useCreateAdditionalFee } from "@/hooks/additionalFees";
import { useUpdateAdditionalFee } from "@/hooks/additionalFees";
import AdditionalFeeCard from "../card/AdditionalFeeCard";
import AdditionalFeeModal, {
  AdditionalFeeFormData,
} from "../modals/AdditionalFeeModal";
import ConfirmModal from "@/components/shared/modal/ConfirmModal";

interface AdditionalFeesProps {
  additionalFees: Doc<"additionalFees">[];
  moveId: Id<"moves">;
  fees: Doc<"fees">[];
}

const AdditionalFees = ({
  additionalFees,
  moveId,
  fees,
}: AdditionalFeesProps) => {
  const [showAddLineItemModal, setShowAddLineItemModal] =
    useState<boolean>(false);
  const [editFee, setEditFee] = useState<Doc<"additionalFees"> | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [feeToDelete, setFeeToDelete] = useState<Id<"additionalFees"> | null>(
    null
  );

  const {
    createAdditionalFee,
    createFeeLoading,
    createFeeError,
    setCreateFeeError,
  } = useCreateAdditionalFee();

  const {
    updateAdditionalFee,
    updateFeeLoading,
    updateFeeError,
    setUpdateFeeError,
  } = useUpdateAdditionalFee();

  const handleOpenAddLineItemModal = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setShowAddLineItemModal(true);
  };

  const handleOpenEditModal = (additionalFeeId: Id<"additionalFees">) => {
    const match: Doc<"additionalFees"> | undefined = additionalFees.find(
      (f) => f._id === additionalFeeId
    );
    if (match) {
      setEditFee(match);
      setShowAddLineItemModal(true);
    }
  };

  const handleOpenDeleteModal = (additionalFeeId: Id<"additionalFees">) => {
    if (additionalFeeId) {
      setFeeToDelete(additionalFeeId);
      setShowDeleteModal(true);
    }
  };

  const handleSubmitFee = async (fee: AdditionalFeeFormData) => {
    if (!fee.price) {
      setCreateFeeError("Price is required");
      return;
    }
    if (editFee) {
      const response = await updateAdditionalFee({
        additionalFeeId: editFee._id,
        updates: {
          name: fee.name,
          price: fee.price,
          quantity: fee.quantity,
          feeId: fee?.feeId,
        },
      });
      if (response) {
        handleCloseAddLineItemModal();
      }
    } else {
      const response = await createAdditionalFee({
        moveId: moveId,
        name: fee.name,
        price: fee.price,
        quantity: fee.quantity,
        feeId: fee?.feeId,
      });

      if (response) {
        handleCloseAddLineItemModal();
      }
    }
  };

  const handleCloseAddLineItemModal = () => {
    setShowAddLineItemModal(false);
    setCreateFeeError(null);
    setUpdateFeeError(null);
    setEditFee(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setUpdateFeeError(null);
  };

  const handleConfirmDeleteFee = async () => {
    if (!feeToDelete) {
      setUpdateFeeError("Fee not found");
      return;
    }
    const response = await updateAdditionalFee({
      additionalFeeId: feeToDelete,
      updates: {
        isActive: false,
      },
    });
    if (response) {
      handleCloseDeleteModal();
    }
  };

  return (
    <div>
      <SectionContainer>
        <Header3
          wrapperClassName="px-0 py-0"
          showCheckmark={false}
          button={
            <Button variant="outline" onClick={handleOpenAddLineItemModal}>
              <div className="flex items-center gap-1">
                <Plus className="w-5 h-5" />
                Fees
              </div>
            </Button>
          }
        >
          Additional Fees
        </Header3>

        {additionalFees.length > 0 ? (
          <CardContainer>
            {additionalFees.map((fee, index) => (
              <AdditionalFeeCard
                key={`${fee.name}-${index}`}
                fee={fee}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
              />
            ))}
          </CardContainer>
        ) : (
          <p className="text-grayCustom2">No additional fees</p>
        )}
      </SectionContainer>

      <AdditionalFeeModal
        isOpen={showAddLineItemModal}
        onClose={handleCloseAddLineItemModal}
        initialData={editFee ? editFee : null}
        onSubmit={handleSubmitFee}
        moveFeeOptions={fees}
        isLoading={editFee ? updateFeeLoading : createFeeLoading}
        errorMessage={editFee ? updateFeeError : createFeeError}
      />
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteFee}
        deleteLoading={updateFeeLoading}
        deleteError={updateFeeError}
        title="Confirm Delete"
        description="Are you sure you want to delete this fee?"
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />
    </div>
  );
};

export default AdditionalFees;
